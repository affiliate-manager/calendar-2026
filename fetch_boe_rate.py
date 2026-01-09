#!/usr/bin/env python3
"""
Bank of England Base Rate Fetcher
=================================
Fetches the current Official Bank Rate from the Bank of England IADB
and saves it to js/live-rates.json for the Landlord Yearbook calendar.

Series Code: IUMABEDR (Official Bank Rate)
API: Free, no authentication required

Usage: python fetch_boe_rate.py

Cron Job (Cloudways): 
  0 14 * * * cd /path/to/app && python3 fetch_boe_rate.py
"""

import requests
import json
import re
from datetime import datetime, timedelta
import os

OUTPUT_FILE = "js/live-rates.json"
SERIES_CODE = "IUMABEDR"

# MPC meeting dates for 2026
MPC_DATES_2026 = [
    "2026-02-06", "2026-03-20", "2026-05-08", "2026-06-19",
    "2026-08-07", "2026-09-18", "2026-11-06", "2026-12-18"
]

def fetch_boe_rate():
    """
    Fetch the latest Bank of England Base Rate using the CSV endpoint.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
        "Accept": "text/csv, text/plain, */*"
    }
    
    # Calculate date range (last 30 days to today)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=60)
    
    # Bank of England CSV endpoint
    url = (
        f"https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp?"
        f"csv.x=yes&"
        f"Datefrom={start_date.strftime('%d/%b/%Y')}&"
        f"Dateto={end_date.strftime('%d/%b/%Y')}&"
        f"SeriesCodes={SERIES_CODE}&"
        f"CSVF=TN&"
        f"UsingCodes=Y"
    )
    
    try:
        print(f"[INFO] Fetching Bank of England rate...")
        print(f"[INFO] URL: {url}")
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        content = response.text
        print(f"[DEBUG] Response length: {len(content)} chars")
        
        # Try to parse CSV data
        # Look for lines with date and rate (format: DD MMM YYYY, rate)
        lines = content.strip().split('\n')
        
        rate = None
        obs_date = None
        
        for line in reversed(lines):  # Start from most recent
            # Try to match patterns like "18 Dec 2025, 3.75" or similar
            match = re.search(r'(\d{1,2}\s+\w{3}\s+\d{4})[,\s]+(\d+\.?\d*)', line)
            if match:
                date_str = match.group(1)
                rate_val = match.group(2)
                if 0 < float(rate_val) <= 20:  # Sanity check
                    rate = rate_val
                    try:
                        obs_date = datetime.strptime(date_str, '%d %b %Y').strftime('%Y-%m-%d')
                    except:
                        obs_date = datetime.now().strftime('%Y-%m-%d')
                    print(f"[SUCCESS] Found rate: {rate}% on {obs_date}")
                    return (rate, obs_date)
        
        # If CSV parsing fails, try to find any rate pattern
        rate_match = re.search(r'(\d+\.\d{2})', content)
        if rate_match:
            rate = rate_match.group(1)
            if 0 < float(rate) <= 20:
                print(f"[SUCCESS] Found rate (fallback): {rate}%")
                return (rate, datetime.now().strftime('%Y-%m-%d'))
        
        print("[WARNING] Could not parse rate from response")
        return None
        
    except Exception as e:
        print(f"[ERROR] Failed to fetch rate: {e}")
        return None

def get_next_mpc_date():
    """Get the next MPC meeting date."""
    today = datetime.now().strftime("%Y-%m-%d")
    for mpc_date in MPC_DATES_2026:
        if mpc_date > today:
            return mpc_date
    return "2027-02-05"  # First 2027 meeting (estimated)

def load_previous_data():
    """Load previous rate data from JSON file."""
    try:
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r') as f:
                return json.load(f)
    except:
        pass
    return None

def generate_insight(rate, direction, previous_rate=None):
    """Generate market insight text based on rate and direction."""
    rate_float = float(rate)
    
    if direction == "down":
        return (f"The Bank Rate was cut to {rate}%"
                f"{f' from {previous_rate}%' if previous_rate else ''}. "
                f"This signals continued easing by the MPC. Tracker mortgage holders "
                f"will see lower payments, while fixed rate deals remain competitive.")
    elif direction == "up":
        return (f"The Bank Rate was raised to {rate}%"
                f"{f' from {previous_rate}%' if previous_rate else ''}. "
                f"This may increase mortgage costs. Consider reviewing your "
                f"fixed rate options before the next MPC decision.")
    else:
        if rate_float >= 4.5:
            return (f"Rates held at {rate}%. At these elevated levels, markets "
                    f"expect gradual cuts ahead. Consider your refinancing strategy.")
        elif rate_float >= 3.5:
            return (f"The Bank Rate remains at {rate}%. Markets are watching for "
                    f"further easing signals. A good time to compare mortgage deals.")
        else:
            return (f"With rates at {rate}%, borrowing costs are relatively low. "
                    f"Consider locking in competitive fixed rates.")

def save_rates(rate, obs_date, previous_data=None):
    """Save rate data to JSON file."""
    previous_rate = previous_data.get('base_rate') if previous_data else None
    
    # Calculate change
    if previous_rate:
        current = float(rate)
        previous = float(previous_rate)
        change_val = current - previous
        
        if change_val < -0.001:
            direction = "down"
            formatted = f"{change_val:.2f}"
        elif change_val > 0.001:
            direction = "up"
            formatted = f"+{change_val:.2f}"
        else:
            direction = "hold"
            formatted = "0.00"
    else:
        direction = "hold"
        formatted = "0.00"
        change_val = 0
    
    data = {
        "base_rate": rate,
        "observation_date": obs_date,
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "change": {
            "direction": direction,
            "value": abs(change_val) if change_val else 0,
            "formatted": formatted
        },
        "previous_rate": previous_rate,
        "next_mpc_date": get_next_mpc_date(),
        "market_insight": generate_insight(rate, direction, previous_rate),
        "source": "Bank of England IUSD",
        "series_code": SERIES_CODE
    }
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"[SUCCESS] Saved to {OUTPUT_FILE}")
    print(f"  Rate: {rate}%")
    print(f"  Change: {formatted}% ({direction})")
    print(f"  Next MPC: {data['next_mpc_date']}")

def main():
    print("=" * 50)
    print("Bank of England Rate Fetcher")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    previous_data = load_previous_data()
    result = fetch_boe_rate()
    
    if result:
        rate, obs_date = result
        save_rates(rate, obs_date, previous_data)
    else:
        print("[INFO] Using existing data (fetch failed)")
        if previous_data:
            print(f"  Current rate in file: {previous_data.get('base_rate')}%")

if __name__ == "__main__":
    main()
