import requests
import pandas as pd
from datetime import datetime

# Kalshi API Base URL
BASE_URL = "https://trading-api.kalshi.com/trade-api/v2"

def get_top_volume_markets():
    """Fetches active markets and returns the top 10 by notional dollar volume."""
    markets = []
    cursor = None
    
    # Loop to handle pagination (fetching up to 5,000 active markets)
    for _ in range(5):  
        params = {"status": "active", "limit": 1000}
        if cursor:
            params["cursor"] = cursor
            
        response = requests.get(f"{BASE_URL}/markets", params=params)
        
        if response.status_code == 200:
            data = response.json()
            markets.extend(data.get('markets', []))
            cursor = data.get('cursor')
            # Break early if there are no more pages
            if not cursor:
                break
        else:
            print(f"Error fetching data: {response.status_code}")
            break
            
    # Sort all active markets by volume (descending)
    sorted_markets = sorted(
        markets, 
        key=lambda x: int(x.get('volume', 0)), 
        reverse=True
    )
    
    # Slice the top 10
    top_10 = sorted_markets[:10]
    
    # Format the data for output
    results = []
    for rank, market in enumerate(top_10, start=1):
        results.append({
            'Rank': rank,
            'Market': market.get('ticker'),
            'Current Prob': f"{market.get('yes_ask', 0)}¢",
            'Total Volume': f"${int(market.get('volume', 0)):,}"
        })
        
    return pd.DataFrame(results)

# Execute the script
print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Initiating Kalshi Volume Scan...")
top_10_df = get_top_volume_markets()

if not top_10_df.empty:
    print("\n--- TOP 10 KALSHI MARKETS BY VOLUME ---")
    print(top_10_df.to_string(index=False))
else:
    print("No active markets found.")
