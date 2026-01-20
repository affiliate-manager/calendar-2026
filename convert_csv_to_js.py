import csv
import json
import re

def clean_title(text):
    """Clean up the title by removing markdown formatting and date prefixes"""
    if not text:
        return ""
    # Remove markdown bold formatting
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    # Remove leading asterisk and date prefix like "* **Jan 1:**"
    text = re.sub(r'^\*\s*', '', text)
    # Remove date prefixes like "Jan 1:" or "Jan 1-5:"
    text = re.sub(r'^[A-Z][a-z]{2}\s+\d+(?:-\d+)?(?:\s*\([A-Z]+\))?:\s*', '', text)
    # Remove (CRITICAL) markers for cleaner titles
    text = re.sub(r'\s*\(CRITICAL\)', '', text)
    # Clean up any remaining formatting
    text = text.strip()
    return text

def clean_description(text):
    """Clean up the description"""
    if not text:
        return ""
    # Remove markdown formatting
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'^\*\s*', '', text)
    # Remove trailing template text
    text = re.sub(r'\s*-\s*specialized property event covering.*$', '', text)
    return text.strip()

def map_event_type_to_category(event_type):
    """Map Event Type to category code"""
    category_mapping = {
        'Auctions': 'auction',
        'Tax & Fiscal': 'tax',
        'Tax Deadlines': 'tax',
        'Training & Webinars': 'training',
        'Networking': 'networking',
        'Industry Conferences': 'networking',
        'Economic Indicators': 'market',
        'Monetary Policy': 'market',
        'Bank Holidays': 'holiday',
        'Property & Tenancy': 'policy',
        'Statutory & Regulatory': 'policy',
        'Energy & Sustainability': 'policy',
        'Administrative Deadlines': 'tax',
        'Quarter Days': 'market',
        'School Terms & Holidays': 'holiday',
        'Parliament Sessions': 'policy',
    }
    return category_mapping.get(event_type, 'market')

def map_investor_type(investor_type):
    """Map investor type to code"""
    investor_mapping = {
        'Single-Buy-to-Let Landlord': 'btl',
        'All Investors': 'btl',
        'Professional HMO/Multi-Let Investor': 'hmo',
        'Commercial & Mixed-Use Landlord': 'commercial',
        'Limited Company (SPV) Investor': 'commercial',
        'BRRR & Property Developer': 'development',
        'Student Accommodation Specialist': 'sa',
        'Short-Term Let (STL) / FHL Host': 'sa',
        'Institutional / High-Net-Worth Investor': 'commercial',
    }
    return investor_mapping.get(investor_type, 'btl')

def escape_js_string(s):
    """Escape string for JavaScript"""
    if not s:
        return ""
    # Escape backslashes first, then quotes
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    s = s.replace('\n', '\\n')
    return s

def process_csv(input_file, output_file):
    events = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Skip empty rows
            if not row.get('calendar_id') or not row.get('calendar_id').strip():
                continue
            
            # Extract date from start_at
            start_at = row.get('start_at', '')
            end_at = row.get('end_at', '')
            
            if not start_at or start_at == 'Not Available':
                continue
                
            # Extract date (YYYY-MM-DD) from datetime
            date = start_at[:10] if len(start_at) >= 10 else ''
            
            # Build the event object
            event = {
                'id': row.get('calendar_id', '').strip(),
                'date': date,
                'title': clean_title(row.get('calendar_title', '')),
                'description': clean_description(row.get('Event Description', '')),
                'ctaText': row.get('CTA text', '').strip(),
                'ctaButtonText': row.get('CTA button text Includes', '').strip()[:60] if row.get('CTA button text Includes') else '',
                'ctaUrl': row.get('CTA button URL', '').strip(),
                'ctaImage': row.get('CTA image URL (pop up)', '').strip(),
                'location': row.get('Event Location', '').strip(),
                'officialUrl': row.get('Related Official URLs', '').strip(),
                'googleMapsUrl': '',
                'wazeUrl': '',
                'startAt': start_at,
                'endAt': end_at if end_at and end_at != 'Not Available' else start_at,
                'timezone': row.get('timezone', 'Europe/London').strip() or 'Europe/London',
                'category': map_event_type_to_category(row.get('Event Type', '')),
                'investorType': map_investor_type(row.get('Event For Investor Type', '')),
            }
            
            # Handle Google Maps URL
            google_maps = row.get('Navigate with Google Map', '').strip()
            if google_maps and 'Google Maps' not in google_maps and 'Open in Google Maps' not in google_maps:
                if google_maps.startswith('http'):
                    event['googleMapsUrl'] = google_maps
            elif event['location'] and event['location'] != 'Online' and event['location'] != 'Online Auction':
                # Generate Google Maps URL from location
                location_encoded = event['location'].replace(' ', '+')
                event['googleMapsUrl'] = f"https://maps.google.com/?q={location_encoded}"
            
            # Handle Waze URL
            waze = row.get('Navigate with Waze', '').strip()
            if waze and 'Waze' not in waze and 'Open in Waze' not in waze:
                if waze.startswith('http'):
                    event['wazeUrl'] = waze
            elif event['location'] and event['location'] != 'Online' and event['location'] != 'Online Auction':
                # Generate Waze URL from location
                location_encoded = event['location'].replace(' ', '+')
                event['wazeUrl'] = f"https://waze.com/ul?q={location_encoded}"
            
            # Clean up button text if too long
            if len(event['ctaButtonText']) > 50:
                event['ctaButtonText'] = event['ctaButtonText'][:47] + '...'
            
            events.append(event)
    
    # Generate JavaScript output
    js_output = """// ============================================
// The Landlord Yearbook - Event Data 2026
// Data sourced from Landlord Calendar 2026 Google Sheet
// Generated from CSV file
// ============================================

const EXPERTS_DATA = [
    {
        name: "Fontaine Brothers",
        expertise: "Systemization (R2R), R2R Academy, Corporate Contracts",
        imageUrl: "https://lendlord.io/wp-content/uploads/2024/02/snapedit_1708674545709.png",
        consultUrl: "https://fontainebrothers.co.uk/investors?utm_campaign=lendlord_calendar",
        keywords: ["r2r", "rent to rent", "corporate", "systemization", "contracts"]
    },
    {
        name: "James Coupland",
        expertise: "Arbitrage Sourced Deals (Hull), JPU Academy",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/James-Coupland.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["arbitrage", "sourcing", "deals", "hull"]
    },
    {
        name: "Gavin & Mitch Vaughan",
        expertise: "Sourcing / B2B Corporate Let Sourcing, SA Management",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Gavin-Vaughan-The-Property-Twins.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["sourcing", "corporate", "serviced accommodation", "sa", "management"]
    },
    {
        name: "Harvey Growth",
        expertise: "Remote / Tech AI Sourcing, Remote BRR",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Harvey-Growth-Properties.jpeg",
        consultUrl: "https://harveygrowthproperties.com/contact?utm_campaign=lendlord_calendar",
        keywords: ["remote", "tech", "ai", "brr", "sourcing", "technology"]
    },
    {
        name: "Charlie Lamdin",
        expertise: "Advocacy BestAgent Platform, Moving Advice",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Charlie-Lamdin.jpg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["agent", "moving", "advocacy", "platform"]
    },
    {
        name: "Sally Lawson",
        expertise: "Optimization Agent Rainmaker, Funnels, White Label",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Sally-Lawson.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["optimization", "marketing", "funnels", "agent"]
    },
    {
        name: "Zee Razaq",
        expertise: "Finance / Tax Virtual FD, SSAS Pension, SPV Advice",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Zee-Razaq.jpg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["tax", "finance", "pension", "ssas", "spv", "corporation", "vat", "mtd", "compliance"]
    },
    {
        name: "Jessica Bishop",
        expertise: "Brand / Reach Super-Prime Sales, Social Marketing",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Jessica-Bishop.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["brand", "marketing", "social", "sales", "prime"]
    },
    {
        name: "Emma Fildes",
        expertise: "Representation Buying Agency, Negotiation",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Emma-Fildes.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["buying", "negotiation", "agency", "representation", "auction"]
    },
    {
        name: "Honest Property Sisters",
        expertise: "Sustainability Mentorship, Slow Wealth Strategy",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/12/UK-Property-Experts-and-Podcast-Hosts-for-lendlord.png",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["sustainability", "mentorship", "wealth", "strategy", "new investor"]
    },
    {
        name: "Matt Brighton",
        expertise: "Data / Analytics Property Insights API, DIY Renovation",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Matt-Brighton.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["data", "analytics", "renovation", "diy", "insights", "ons", "statistics"]
    },
    {
        name: "Vanessa Warwick",
        expertise: "Due Diligence Property Tribes Forum, Peer Support",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Vanessa-Warwick.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant/Vanessa-Warwick?utm_campaign=lendlord_calendar",
        keywords: ["due diligence", "forum", "peer", "support", "community", "networking"]
    },
    {
        name: "Jamie York",
        expertise: "BRR Sourcing & Packaging High-velocity portfolio scaling & education",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Jamie-York-for-Lendlord.jpeg",
        consultUrl: "https://www.aspireeducation.co.uk/joinaspireeducation?utm_campaign=lendlord_calendar",
        keywords: ["brr", "sourcing", "packaging", "portfolio", "education", "training"]
    },
    {
        name: "Vijay Singh",
        expertise: "Turnkey Volume BTL Hands-free yield aggregation in low-cost North East markets",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Vijay-Singh.jpg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["btl", "buy to let", "turnkey", "yield", "north east"]
    },
    {
        name: "Lewis Dawson",
        expertise: "SA & Asset Sweating Hybridizing hospitality yields with residential assets",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Lewis-Dawson.jpg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant/Lewis-Dawson?utm_campaign=lendlord_calendar",
        keywords: ["serviced accommodation", "sa", "hospitality", "airbnb", "holiday let"]
    },
    {
        name: "Jack Smith",
        expertise: "Portfolio Scaling Structuring Joint Ventures for capital-efficient growth",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/12/jack-smith-for-Lendlord.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["portfolio", "joint venture", "jv", "scaling", "capital", "growth"]
    },
    {
        name: "John Howard",
        expertise: "Institutional Development Equity funding, trading strategy, and distressed asset rescue",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/John-Howard.jpeg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant/John-Howard?utm_campaign=lendlord_calendar",
        keywords: ["development", "equity", "funding", "trading", "distressed", "institutional"]
    },
    {
        name: "Sean Land",
        expertise: "Land Sourcing Planning gain arbitrage and direct-to-vendor negotiation",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Sean-Land.jpg",
        consultUrl: "https://app.lendlord.io/uk-property-investment-consultant?utm_campaign=lendlord_calendar",
        keywords: ["land", "planning", "development", "negotiation", "vendor"]
    },
    {
        name: "Dale Anderson",
        expertise: "Off-Plan Distribution Curated, due-diligence-backed access to new build stock",
        imageUrl: "https://lendlord.io/wp-content/uploads/2025/11/Dale-Anderson.jpeg",
        consultUrl: "https://daleanderson.co.uk?utm_campaign=lendlord_calendar",
        keywords: ["off-plan", "new build", "development", "distribution"]
    }
];

const EVENTS_DATA = [
"""
    
    # Add each event
    for i, event in enumerate(events):
        js_output += "    {\n"
        js_output += f'        id: "{escape_js_string(event["id"])}",\n'
        js_output += f'        date: "{event["date"]}",\n'
        js_output += f'        title: "{escape_js_string(event["title"])}",\n'
        js_output += f'        description: "{escape_js_string(event["description"])}",\n'
        js_output += f'        ctaText: "{escape_js_string(event["ctaText"])}",\n'
        js_output += f'        ctaButtonText: "{escape_js_string(event["ctaButtonText"])}",\n'
        js_output += f'        ctaUrl: "{escape_js_string(event["ctaUrl"])}",\n'
        js_output += f'        ctaImage: "{escape_js_string(event["ctaImage"])}",\n'
        js_output += f'        location: "{escape_js_string(event["location"])}",\n'
        js_output += f'        officialUrl: "{escape_js_string(event["officialUrl"])}",\n'
        js_output += f'        googleMapsUrl: "{escape_js_string(event["googleMapsUrl"])}",\n'
        js_output += f'        wazeUrl: "{escape_js_string(event["wazeUrl"])}",\n'
        js_output += f'        startAt: "{event["startAt"]}",\n'
        js_output += f'        endAt: "{event["endAt"]}",\n'
        js_output += f'        timezone: "{event["timezone"]}",\n'
        js_output += f'        category: "{event["category"]}",\n'
        js_output += f'        investorType: "{event["investorType"]}"\n'
        
        if i < len(events) - 1:
            js_output += "    },\n"
        else:
            js_output += "    }\n"
    
    js_output += """];

// Category labels for display
const CATEGORY_LABELS = {
    tax: "Tax & Compliance",
    training: "Training & Education",
    networking: "Networking Events",
    market: "Market Data & Reports",
    auction: "Auctions",
    policy: "Policy & Regulation",
    holiday: "Bank Holidays"
};

// Investor type labels
const INVESTOR_LABELS = {
    btl: "Buy-to-Let",
    hmo: "HMO Investors",
    commercial: "Commercial",
    development: "Development",
    sa: "Serviced Accommodation",
    new: "New Investors"
};
"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_output)
    
    print(f"Successfully converted {len(events)} events to JavaScript format")
    print(f"Output written to: {output_file}")

if __name__ == "__main__":
    input_file = r"c:\Users\user\Downloads\Add_Event_Addresses_and_Navigation_URLs-Genspark_AI_Sheets-20260120_1114.csv"
    output_file = r"C:\Users\user\.cursor\The Landlord Yearbook\data.js"
    process_csv(input_file, output_file)

