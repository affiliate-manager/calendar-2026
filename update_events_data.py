import csv
import json
import re

def clean_text(text):
    if isinstance(text, str):
        # Remove markdown bold markers
        text = re.sub(r'\*\*', '', text)
        text = re.sub(r"^\*+\s*", "", text).strip()
        text = text.strip('"')
        text = re.sub(r"\s+", " ", text)
        # Remove leading date patterns like "Jan 1: " or "**Jan 1:**"
        text = re.sub(r'^[A-Za-z]{3}\s+\d+:\s*', '', text)
        # Escape quotes for JS
        text = text.replace('\\', '\\\\').replace('"', '\\"')
        return text.strip()
    return ""

def clean_url(url):
    """Clean URL fields - return empty if not a valid URL"""
    if isinstance(url, str):
        url = url.strip()
        if url.startswith('http://') or url.startswith('https://'):
            return url
    return ""

def convert_csv_to_lyb_events(csv_file_path, js_file_path):
    events_data = []
    
    with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
        csv_reader = csv.DictReader(csvfile)
        
        for row in csv_reader:
            if not any(row.values()):
                continue
            
            event_id = row.get('calendar_id', '').strip()
            if not event_id:
                event_id = f"evt-{len(events_data) + 1}"
            
            title_raw = row.get('calendar_title', row.get('Events', ''))
            # First remove markdown bold markers
            title = re.sub(r'\*\*', '', title_raw)
            # Remove date prefix from title (e.g., "Jan 6: " or "Jan 6:" at start only)
            title = re.sub(r'^[A-Za-z]{3}\s+\d{1,2}:\s*', '', title)
            title = clean_text(title)
            desc = clean_text(row.get('calendar_description', row.get('Event Description', '')))
            cta_text = clean_text(row.get('CTA text', ''))
            cta_btn = clean_text(row.get('CTA button text Includes', ''))
            cta_url = row.get('CTA button URL', '').strip()
            cta_img = row.get('CTA image URL (pop up)', '').strip()
            official_url = row.get('Related Official URLs', '').strip()
            location = clean_text(row.get('Event Location', ''))
            google_map_raw = row.get('Navigate with Google Map ', '').strip()  # Note space
            if not google_map_raw:
                google_map_raw = row.get('Navigate with Google Map', '').strip()
            google_map = clean_url(google_map_raw)
            waze = clean_url(row.get('Navigate with Waze', '').strip())
            
            # Get date from start_at or Events column
            start_at = row.get('start_at', '').strip()
            if start_at:
                date = start_at.split('T')[0]
            else:
                # Try to extract date from Events column
                events_col = row.get('Events', '')
                date_match = re.match(r'(\d{4}-\d{2}-\d{2})', events_col)
                if date_match:
                    date = date_match.group(1)
                else:
                    date = ""
            
            category = clean_text(row.get('Event Type', ''))
            investor_type = clean_text(row.get('Event For Investor Type', ''))
            
            # Map categories to short CSS-compatible names
            category_map = {
                # From CSV Event Type column
                'Auctions': 'auction',
                'Tax & Fiscal Events': 'tax-fiscal',
                'Tax & Fiscal': 'tax-fiscal',
                'Tax Deadline': 'tax-fiscal',
                'Tax Deadlines': 'tax-fiscal',
                'Economic Indicators': 'economic',
                'Economic': 'economic',
                'Monetary Policy': 'economic',
                'Energy & Utilities': 'energy',
                'Energy & Sustainability': 'energy',
                'Property Regulations': 'property',
                'Property & Tenancy': 'property',
                'Statutory & Regulatory': 'property',
                'Administrative Deadlines': 'property',
                'Quarter Days': 'property',
                'Parliament Sessions': 'property',
                'Conferences & Seminars': 'conference',
                'Industry Conferences': 'conference',
                'Training & Webinars': 'training',
                'Training': 'training',
                'Networking Events': 'conference',
                'Networking': 'conference',
                'Bank Holidays': 'holiday',
                'Holiday': 'holiday',
                'School Terms & Holidays': 'holiday',
                'Market Reports': 'economic',
            }
            # Normalize the category for lookup
            category_normalized = category.strip()
            category_lower = category_map.get(category_normalized)
            if not category_lower:
                # Fallback: remove special chars and map
                cat_clean = category.lower().replace('&', '').replace('-', ' ').strip()
                cat_clean = ' '.join(cat_clean.split())  # normalize spaces
                fallback_map = {
                    'tax fiscal': 'tax-fiscal',
                    'energy sustainability': 'energy',
                    'property tenancy': 'property',
                    'statutory regulatory': 'property',
                    'school terms holidays': 'holiday',
                    'industry conferences': 'conference',
                    'administrative deadlines': 'property',
                    'monetary policy': 'economic',
                    'parliament sessions': 'property',
                    'quarter days': 'property',
                }
                category_lower = fallback_map.get(cat_clean, 'property')
            
            # Map investor types
            investor_map = {
                'All Investors': 'all',
                'Buy-to-Let Landlord': 'btl',
                'BRRR / Flip Investors': 'brrr',
                'Limited Company (SPV) Landlord': 'ltd',
                'Institutional / High-Net-Worth Investor': 'institutional',
                'New / First-Time Investor': 'new',
            }
            investor_lower = investor_map.get(investor_type, investor_type.lower().replace(' ', '-') if investor_type else 'all')
            
            # Ensure auction events have the correct image
            if 'auction' in category_lower:
                if not cta_img or cta_img != 'https://lendlord.io/wp-content/uploads/2025/12/uk_property_auctions.jpg':
                    cta_img = 'https://lendlord.io/wp-content/uploads/2025/12/uk_property_auctions.jpg'
            
            event = {
                'id': event_id,
                'date': date,
                'title': title,
                'desc': desc,
                'ctaText': cta_text,
                'ctaBtn': cta_btn,
                'ctaUrl': cta_url,
                'ctaImg': cta_img,
                'officialUrl': official_url,
                'location': location,
                'googleMap': google_map,
                'waze': waze,
                'category': category_lower,
                'investorType': investor_lower,
            }
            events_data.append(event)
    
    # Build minified JS output
    js_lines = []
    for event in events_data:
        parts = []
        parts.append(f'id:"{event["id"]}"')
        parts.append(f'date:"{event["date"]}"')
        parts.append(f'title:"{event["title"]}"')
        parts.append(f'desc:"{event["desc"]}"')
        parts.append(f'ctaText:"{event["ctaText"]}"')
        parts.append(f'ctaBtn:"{event["ctaBtn"]}"')
        parts.append(f'ctaUrl:"{event["ctaUrl"]}"')
        parts.append(f'ctaImg:"{event["ctaImg"]}"')
        parts.append(f'officialUrl:"{event["officialUrl"]}"')
        parts.append(f'location:"{event["location"]}"')
        parts.append(f'googleMap:"{event["googleMap"]}"')
        parts.append(f'waze:"{event["waze"]}"')
        parts.append(f'category:"{event["category"]}"')
        parts.append(f'investorType:"{event["investorType"]}"')
        js_lines.append('{' + ','.join(parts) + '}')
    
    js_content = 'var LYB_EVENTS=[\n' + ',\n'.join(js_lines) + '\n];'
    
    with open(js_file_path, mode='w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Successfully converted {len(events_data)} events to LYB_EVENTS format")
    print(f"Output written to: {js_file_path}")
    return len(events_data)

# Execute
csv_file = r'C:\Users\user\Downloads\Add_Event_Addresses_and_Navigation_URLs-Genspark_AI_Sheets-20260120_1114.csv'
js_file = r'C:\Users\user\.cursor\The Landlord Yearbook\js\events-data.js'

count = convert_csv_to_lyb_events(csv_file, js_file)
print(f"\nDone! {count} events updated.")

