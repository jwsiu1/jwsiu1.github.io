import requests
import pandas as pd
from datetime import datetime

# Kalshi API Base URL (Public endpoints)
BASE_URL = "https://trading-api.kalshi.com/trade-api/v2"

def get_active_markets():
    """Fetches all active prediction markets from Kalshi."""
    response = requests.get(f"{BASE_URL}/markets", params={"status": "active", "limit": 100})
    if response.status_code == 200:
        return response.json().get('markets', [])
    return []

def scan_for_volatility(markets, threshold=15):
    """Scans markets and flags probability swings greater than the threshold."""
    volatile_markets = []
    
    for market in markets:
        ticker = market.get('ticker')
        # Yes price represents market probability (e.g., 40 cents = 40%)
        current_price = market.get('yes_ask', 0) 
        previous_price = market.get('previous_yes_ask', current_price) # Fallback if historical isn't in this payload
        
        # Calculate percentage swing
        if previous_price > 0:
            swing = abs((current_price - previous_price) / previous_price) * 100
            
            if swing >= threshold:
                volatile_markets.append({
                    'Market': ticker,
                    'Current Prob': f"{current_price}¢",
                    'Swing': f"{swing:.1f}%",
                    'Timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                
    return pd.DataFrame(volatile_markets)

# Execute Scanner
print("Initiating Kalshi Volatility Scan...")
markets = get_active_markets()
alerts_df = scan_for_volatility(markets)

if not alerts_df.empty:
    print(f"ALERT: Detected {len(alerts_df)} highly volatile markets.")
    print(alerts_df.to_string(index=False))
    # Next step: Export to SQL database or trigger an email alert here
else:
    print("All markets stable. No arbitrage opportunities flagged.")
