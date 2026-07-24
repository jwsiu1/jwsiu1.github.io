import requests
import pandas as pd
import json
from datetime import datetime

BASE_URL = "https://trading-api.kalshi.com/trade-api/v2"

def get_top_events_by_volume():
    markets = []
    cursor = None
    
    # Pagination: Pull active markets in batches
    for _ in range(5):  
        params = {"status": "active", "limit": 1000}
        if cursor:
            params["cursor"] = cursor
            
        response = requests.get(f"{BASE_URL}/markets", params=params)
        
        if response.status_code == 200:
            data = response.json()
            markets.extend(data.get('markets', []))
            cursor = data.get('cursor')
            if not cursor:
                break
        else:
            break
            
    if not markets:
        return []

    # Convert to DataFrame
    df = pd.DataFrame(markets)
    
    # Clean volume data
    df['volume'] = pd.to_numeric(df['volume'], errors='coerce').fillna(0)
    
    # Group by event_ticker to combine all sub-markets (e.g., LeBron's 30 team options)
    grouped = df.groupby('event_ticker').agg({
        'volume': 'sum',
        'title': 'first'  # Event title
    }).reset_index()
    
    # Sort by total volume descending
    top_10_df = grouped.sort_values(by='volume', ascending=False).head(10)
    
    # Format output array
    top_10_data = []
    for rank, row in enumerate(top_10_df.itertuples(), start=1):
        event_ticker = str(row.event_ticker).lower()
        title = str(row.title) if pd.notna(row.title) else row.event_ticker
        
        top_10_data.append({
            "rank": rank,
            "name": title,
            "vol": int(row.volume),
            "url": f"https://kalshi.com/markets/{event_ticker}"
        })
        
    return top_10_data

if __name__ == "__main__":
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Running Kalshi volume pipeline...")
    data = get_top_events_by_volume()
    
    # Export to JSON file for index.html to fetch
    with open("kalshi_top10.json", "w") as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully updated kalshi_top10.json with {len(data)} events.")
