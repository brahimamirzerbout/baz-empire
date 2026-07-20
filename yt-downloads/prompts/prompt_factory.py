#!/usr/bin/env python3
"""
PROMPT FACTORY — Convert corpus data into feature-building prompts
Usage: python3 prompt_factory.py --category 01 [--channel channel_name] [--limit N]
"""

import os
import glob
import random
import argparse

CORPUS_DIR = os.path.expanduser("~/yt-downloads")

CATEGORIES = {
    "01": {
        "name": "CMO Dashboard",
        "channels": ["marketingcfo", "uniteconomics", "sethgodin", "markritson", "neilpatel", 
                     "adamerhart", "adamerhartai", "hubspot", "thefutur", "alexhormozi"],
        "output": "cmo_dashboard_feature.py",
    },
    "02": {
        "name": "CEO Operating System",
        "channels": ["ceoleadership", "ceodashboard", "ceomindset", "ceoscaling", "ceofundraising",
                     "harvardbusinessreview", "elonmusk", "jeffbezos", "stevejobs", "samaltman",
                     "jensenhuang", "darioamodei", "mustafasuleyman", "pbdconsulting", "valuetainment"],
        "output": "ceo_os_feature.py",
    },
    "03": {
        "name": "CFO Marketing Hub",
        "channels": ["accountingstuff", "edspira", "investopedia", "marketingcfo", "uniteconomics",
                     "grahamstephan", "ramitsethi", "adamkhoo", "tradingchannel"],
        "output": "cfo_marketing_hub_feature.py",
    },
    "04": {
        "name": "Crypto Trading Desk",
        "channels": ["coinbureau", "bankless", "pompliano", "michaelsaylor", "benjamincowen",
                     "adamkhoo", "tradingchannel"],
        "output": "crypto_trading_feature.py",
    },
    "05": {
        "name": "Agency Growth Engine",
        "channels": ["thefutur", "agencymavericks", "creativeagencysuccess", "danmartell",
                     "alexhormozi", "sabrisuby", "bigdeal"],
        "output": "agency_growth_feature.py",
    },
    "06": {
        "name": "Sales Closing Machine",
        "channels": ["grantcardone", "russellbrunson", "bigdeal", "orenmeetsworld", "valuetainment"],
        "output": "sales_closing_feature.py",
    },
    "07": {
        "name": "Brand Positioning Engine",
        "channels": ["brandbuilding", "directresponse", "sethgodin", "markritson", "simonsinek"],
        "output": "brand_positioning_feature.py",
    },
    "08": {
        "name": "Mindset Armor",
        "channels": ["jockowillink", "davidgoggins", "melrobbins", "simonsinek", "goalcast",
                     "fearlessmotivation", "motivationmadness", "motiversity"],
        "output": "mindset_armor_feature.py",
    },
    "09": {
        "name": "Startup Operator",
        "channels": ["myfirstmillion", "ycombinator", "samaltman", "jensenhuang", "darioamodei",
                     "mustafasuleyman", "peterthiel", "raydalio"],
        "output": "startup_operator_feature.py",
    },
    "10": {
        "name": "Content Machine",
        "channels": ["hubspot", "neilpatel", "marketingexamples", "schoolofgreatness",
                     "aliabdaal", "garyvee"],
        "output": "content_machine_feature.py",
    },
}

def load_channel_files(channel, limit=None):
    """Load SRT files from a channel directory"""
    srt_dir = os.path.join(CORPUS_DIR, channel)
    files = sorted(glob.glob(os.path.join(srt_dir, "*.srt")))
    if limit:
        files = random.sample(files, min(limit, len(files)))
    return files

def extract_text_from_srt(srt_path):
    """Extract clean text from SRT file"""
    lines = []
    with open(srt_path, 'r', errors='ignore') as f:
        for line in f:
            line = line.strip()
            # Skip timestamps, line numbers, empty lines
            if not line:
                continue
            if '-->' in line:
                continue
            if line.isdigit():
                continue
            lines.append(line)
    return ' '.join(lines)

def generate_prompt(category_id, limit_per_channel=5):
    """Generate a feature-building prompt from corpus data"""
    cat = CATEGORIES.get(category_id)
    if not cat:
        print(f"Unknown category: {category_id}")
        return
    
    print(f"\n{'='*60}")
    print(f"  PROMPT FACTORY — Category {category_id}: {cat['name']}")
    print(f"{'='*60}\n")
    
    all_text = []
    total_files = 0
    
    for channel in cat["channels"]:
        files = load_channel_files(channel, limit=limit_per_channel)
        if not files:
            print(f"  ⚠ No files found for {channel}")
            continue
        
        print(f"  📂 {channel}: loading {len(files)} files")
        for f in files:
            try:
                text = extract_text_from_srt(f)
                if len(text) > 100:  # Skip empty or very short
                    all_text.append(f"[{channel}] {text[:5000]}")  # Cap per file
                    total_files += 1
            except:
                pass
    
    print(f"\n  Total context loaded: {total_files} files")
    print(f"  Total characters: {sum(len(t) for t in all_text):,}")
    
    prompt = f"""You are building the {cat['name']} feature. Based on the following expert transcripts, 
generate production-ready code, strategies, and frameworks.

CORPUS DATA ({total_files} expert sources):
{chr(10).join(all_text[:50])}

GENERATE:
1. Feature code (Python/TypeScript)
2. Data models and schemas
3. API endpoints
4. UI/UX wireframes description
5. Revenue model
6. Launch checklist

Each output must be directly actionable — no theory, only shipping features."""
    
    # Save prompt
    output_dir = os.path.join(CORPUS_DIR, "prompts")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"prompt_{category_id}_{cat['name'].lower().replace(' ', '_')}.txt")
    
    with open(output_path, 'w') as f:
        f.write(prompt)
    
    print(f"\n  ✅ Prompt saved to: {output_path}")
    print(f"  💰 Revenue target: See {output_dir}/0{category_id}_*.md for pricing")
    
    return prompt

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prompt Factory — Convert corpus data into feature prompts")
    parser.add_argument("--category", "-c", required=True, help="Category ID (01-10)")
    parser.add_argument("--limit", "-l", type=int, default=5, help="Files per channel")
    parser.add_argument("--channel", help="Specific channel to focus on")
    args = parser.parse_args()
    
    generate_prompt(args.category, limit_per_channel=args.limit)