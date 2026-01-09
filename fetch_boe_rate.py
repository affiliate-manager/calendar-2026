#!/usr/bin/env python3
"""
Bank of England Base Rate Fetcher
=================================
Fetches the current Official Bank Rate from the Bank of England
and saves it to js/live-rates.json for the Landlord Yearbook calendar.

Usage: python fetch_boe_rate.py

Cron Job (Cloudways): 
  0 14 * * * cd /path/to/app && python3 fetch_boe_rate.py
"""

import requests
import json
import re
from datetime import datetime
import os

OUTPUT_FILE = "js/live-rates.json"
SERIES_CODE = "IUMABEDR"

MPC_DATES_2026 = [
    "2026-02-06", "2026-03-20", "2026-05-08", "2026-06-19",
    "2026-08-07", "2026-09-18", "2026-11-06", "2026-12-18"
]

def fetch_boe_rate():
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"}
    
    try:
        print("[INFO] Fetching Bank of England rate...")
        url = "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate"
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        patterns = [
            r'Bank Rate[^0-9]*?(\d+\.?\d*)%',
            r'Official Bank Rate[^0-9]*?(\d+\.?\d*)%',
            r'>(\d+\.\d{2})%<',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, response.text, re.IGNORECASE)
            if match:
                rate = match.group(1)
                if 0 < float(rate) <= 15:
                    print(f"[SUCCESS] Found rate: {rate}%")
                    return (rate, datetime.now().strftime("%Y-%m-%d"))
    except Exception as e:
        print(f"[ERROR] {e}")
    
    return ("4.50", datetime.now().strftime("%Y-%m-%d"))

def get_next_mpc_date():
    today = datetime.now().strftime("%Y-%m-%d")
    for mpc_date in MPC_DATES_2026:
        if mpc_date > today:
            return mpc_date
    return "2027-02-05"

def load_previous_rate():
    try:
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r') as f:
                return json.load(f).get('base_rate')
    except:
        pass
    return None

def generate_insight(rate, direction):
    rate_float = float(rate)
    if rate_float >= 5:
        if direction == "down":
            return f"Rates have decreased to {rate}%, offering relief for borrowers. Tracker mortgage holders will see savings."
        return f"Rates held at {rate}%. Markets expect gradual easing. Consider your refinancing strategy."
    elif rate_float >= 4:
        return f"At {rate}%, rates are moderating. Good time to review mortgage options."
    return f"With rates at {rate}%, borrowing costs are relatively low. Consider locking in rates."

def save_rates(rate, obs_date, previous_rate):
    current = float(rate)
    previous = float(previous_rate) if previous_rate else current
    change_val = current - previous
    
    if change_val > 0:
        direction = "up"
        formatted = f"+{change_val:.2f}"
    elif change_val < 0:
        direction = "down"
        formatted = f"{change_val:.2f}"
    else:
        direction = "hold"
        formatted = "0.00"
    
    data = {
        "base_rate": rate,
        "observation_date": obs_date,
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "change": {"direction": direction, "value": abs(change_val), "formatted": formatted},
        "next_mpc_date": get_next_mpc_date(),
        "market_insight": generate_insight(rate, direction),
        "source": "Bank of England IUSD",
        "series_code": SERIES_CODE
    }
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"[SUCCESS] Saved to {OUTPUT_FILE}: {rate}%")

def main():
    print("=" * 40)
    print("Bank of England Rate Fetcher")
    print("=" * 40)
    
    previous_rate = load_previous_rate()
    rate, obs_date = fetch_boe_rate()
    save_rates(rate, obs_date, previous_rate)

if __name__ == "__main__":
    main()

