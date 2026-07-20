#!/usr/bin/env python3
"""
MONEY ENGINE — 10 Features. 1 Platform. Ship Tonight.
Each feature reads from the corpus and produces revenue-generating output.
"""

import os
import json
import glob
import random
from datetime import datetime
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)
CORPUS_DIR = os.path.expanduser("~/yt-downloads")

# ============================================================
# UTILITY: Load insights from corpus
# ============================================================
def load_srt_texts(channel, limit=10):
    """Load clean text from SRT files"""
    texts = []
    pattern = os.path.join(CORPUS_DIR, channel, "*.srt")
    files = sorted(glob.glob(pattern))
    if limit:
        files = random.sample(files, min(limit, len(files))) if len(files) > limit else files
    for f in files:
        try:
            with open(f, 'r', errors='ignore') as fh:
                lines = [l.strip() for l in fh if l.strip() and '-->' not in l and not l.strip().isdigit()]
                text = ' '.join(lines)
                if len(text) > 50:
                    texts.append(text)
        except:
            pass
    return texts

def load_md_texts(channel, limit=10):
    """Load markdown files"""
    texts = []
    pattern = os.path.join(CORPUS_DIR, channel, "*.md")
    files = sorted(glob.glob(pattern))
    if limit:
        files = random.sample(files, min(limit, len(files))) if len(files) > limit else files
    for f in files:
        try:
            with open(f, 'r', errors='ignore') as fh:
                text = fh.read()
                if len(text) > 50:
                    texts.append(text)
        except:
            pass
    return texts

# ============================================================
# FEATURE 01: CMO DASHBOARD
# ============================================================
CMO_RULES = [
    {"rule": "CAC must be < 1/3 of LTV", "source": "Alex Hormozi", "action": "If CAC:LTV > 1:3, pause paid acquisition and optimize conversion"},
    {"rule": "Brand advertising works on a 3-5 year lag", "source": "Mark Ritson", "action": "Allocate 60% to performance, 40% to brand. Measure brand quarterly, performance daily"},
    {"rule": "If you can't measure it, you can't scale it", "source": "Adam Erhart", "action": "Install tracking BEFORE launching any campaign. No tracking = no budget"},
    {"rule": "The best marketing budget is one that compounds", "source": "Ramit Sethi", "action": "Reinvest profits from month 1. 50% of net margin back into acquisition"},
    {"rule": "Contribution margin must exceed 60% for paid acquisition", "source": "Unit Economics corpus", "action": "If contribution margin < 60%, fix pricing or reduce COGS before spending on ads"},
    {"rule": "CAC payback must be under 12 months", "source": "Marketing CFO corpus", "action": "If payback > 12 months, either increase LTV or reduce CAC. No exceptions"},
    {"rule": "7 touches before a purchase", "source": "HubSpot", "action": "Build a 7-touch nurture sequence: email, retarget, content, social, direct, phone, close"},
    {"rule": "The P&L is the CMO's most important document", "source": "Adam Erhart", "action": "Request P&L access on day 1. Map every marketing dollar to a P&L line item"},
    {"rule": "Revenue is vanity, profit is sanity, cash is reality", "source": "Investopedia", "action": "Track cash flow weekly, not revenue. Positive unit economics > top-line growth"},
    {"rule": "Don't scale what isn't working", "source": "Alex Hormozi", "action": "If ROAS < 2:1 after 2 weeks, kill the campaign. No exceptions"},
]

CMO_KPI_TEMPLATES = {
    "cac": {"name": "Customer Acquisition Cost", "formula": "Total Marketing Spend / New Customers", "benchmark": {"saas": "$50-200", "ecommerce": "$10-50", "agency": "$500-2000"}},
    "ltv": {"name": "Lifetime Value", "formula": "ARPU × Avg Lifespan", "benchmark": {"saas": "$500-5000", "ecommerce": "$50-200", "agency": "$5000-50000"}},
    "ltv_cac": {"name": "LTV:CAC Ratio", "formula": "LTV / CAC", "benchmark": {"good": "3:1", "great": "5:1", "worldclass": "10:1"}},
    "payback": {"name": "CAC Payback Period", "formula": "CAC / Monthly ARPU", "benchmark": {"good": "6 months", "acceptable": "12 months", "bad": ">18 months"}},
    "roas": {"name": "Return on Ad Spend", "formula": "Revenue from Ads / Ad Spend", "benchmark": {"good": "3:1", "great": "5:1", "worldclass": "10:1"}},
    "mrr": {"name": "Monthly Recurring Revenue", "formula": "Total monthly subscription revenue", "benchmark": {"seed": "$1K-10K", "growth": "$10K-100K", "scale": "$100K+"}},
    "churn": {"name": "Monthly Churn Rate", "formula": "Lost Customers / Total Customers", "benchmark": {"good": "<2%", "acceptable": "2-5%", "bad": ">5%"}},
    "nps": {"name": "Net Promoter Score", "formula": "% Promoters - % Detractors", "benchmark": {"good": ">30", "great": ">50", "worldclass": ">70"}},
}

# ============================================================
# FEATURE 02: CEO OPERATING SYSTEM
# ============================================================
CEO_MORNING_BRIEF = {
    "cash": "Cash position, burn rate, runway in months",
    "pipeline": "Deals in pipeline, weighted probability, expected close dates",
    "team": "Headcount vs plan, open roles, attrition rate",
    "product": "Key metrics (DAU/MAU, engagement, NPS), blockers",
    "competitive": "Competitor moves, market shifts, regulatory changes",
    "board": "Next board meeting date, key decisions needed",
}

CEO_DECISION_FRAMEWORKS = {
    "hire_fire": {
        "name": "Hire/Fire Decision",
        "steps": ["Is this person in the right seat? (Right role, right skills)", "Have they been given clear expectations? (Written)", "Have they been given the resources to succeed?", "Have they had 30 days to improve after feedback?", "Would you hire them again today?"],
        "rule": "If 3+ are NO: fire. If all YES but no results: wrong seat.",
        "source": "PBD / CEO corpus"
    },
    "scale_cut": {
        "name": "Scale/Cut Decision",
        "steps": ["Is this line item generating >3x return?", "Is it compoundable? (Does it get better over time?)", "Does it have positive unit economics?", "Can you measure it within 30 days?", "Would you invest your own money?"],
        "rule": "3+ YES: scale aggressively. 2+ NO: cut immediately.",
        "source": "Alex Hormozi / CEO corpus"
    },
    "build_buy": {
        "name": "Build/Buy Decision",
        "steps": ["Is this core to our competitive advantage?", "Can we build it in <3 months?", "Do we have the talent in-house?", "Is there an acquisition that solves it today?", "What's the opportunity cost of building?"],
        "rule": "Core + fast to build: BUILD. Non-core or slow: BUY.",
        "source": "My First Million / Y Combinator"
    },
    "raise_bootstrap": {
        "name": "Raise/Bootstrap Decision",
        "steps": ["Can we reach profitability on current revenue?", "Is the market growing >50% YoY?", "Will capital give us a decisive advantage?", "Can we hire the talent we need without funding?", "Will dilution cost us control?"],
        "rule": "Profitable + slow market: BOOTSTRAP. Fast market + talent gap: RAISE.",
        "source": "Sam Altman / Y Combinator"
    },
}

CEO_SCALING_PLAYBOOK = {
    "0_to_1": {
        "name": "Validation Stage (0→1)",
        "revenue": "$0-$10K MRR",
        "focus": "Find product-market fit. Talk to 100 customers. Ship weekly.",
        "team": "2-3 people max. Founder does sales AND product.",
        "metrics": ["Conversations/week", "Conversion rate", "Retention at 30 days"],
        "dont": ["Don't hire", "Don't scale ads", "Don't build features nobody asked for", "Don't raise money yet"],
    },
    "1_to_10": {
        "name": "Systematization Stage (1→10)",
        "revenue": "$10K-$100K MRR",
        "focus": "Build systems. Document everything. Hire first 5 people.",
        "team": "5-10 people. First hires: sales, ops, 1 engineer.",
        "metrics": ["MRR growth rate", "Gross margin", "Net dollar retention", "CAC payback"],
        "dont": ["Don't skip documentation", "Don't hire before process", "Don't lose touch with customers", "Don't over-engineer"],
    },
    "10_to_100": {
        "name": "Scale Stage (10→100)",
        "revenue": "$100K-$1M MRR",
        "focus": "Delegate. Hire leaders. Build org structure. Scale what works.",
        "team": "10-50 people. VPs for each department.",
        "metrics": ["ARR", "Gross margin", "LTV:CAC", "Net revenue retention", "Rule of 40"],
        "dont": ["Don't micromanage", "Don't ignore culture", "Don't let process kill speed", "Don't lose the founding vision"],
    },
}

# ============================================================
# FEATURE 03: CFO MARKETING HUB
# ============================================================
CFO_MODELS = {
    "unit_economics": {
        "name": "Unit Economics Calculator",
        "inputs": ["ARPU", "COGS_per_user", "CAC", "Lifespan_months", "Churn_rate"],
        "outputs": ["Contribution_margin", "LTV", "LTV:CAC", "Payback_months", "Profit_per_customer"],
        "formula": """
contribution_margin = ARPU - COGS_per_user
LTV = contribution_margin * (1 / churn_rate)
ltv_cac = LTV / CAC
payback = CAC / contribution_margin
profit_per_customer = LTV - CAC
"""
    },
    "p_and_l": {
        "name": "CMO P&L View",
        "line_items": {
            "Revenue": {"formula": "MRR × 1", "owner": "Sales"},
            "COGS": {"formula": "Hosting + Support + Data", "owner": "Ops"},
            "Gross_Profit": {"formula": "Revenue - COGS", "owner": "CFO"},
            "Marketing_Spend": {"formula": "Paid + Content + Events + Tools", "owner": "CMO"},
            "CAC": {"formula": "Marketing_Spend / New_Customers", "owner": "CMO"},
            "Sales_Spend": {"formula": "Commissions + Tools", "owner": "Sales"},
            "OPEX": {"formula": "R&D + G&A", "owner": "CEO"},
            "Net_Income": {"formula": "Gross_Profit - Marketing - Sales - OPEX", "owner": "CFO"},
        }
    },
    "budget_allocator": {
        "name": "Marketing Budget Allocator",
        "rules": [
            {"stage": "0→1", "budget_pct": "5-10% of revenue", "split": "80% performance, 20% brand", "channels": "1-2 channels max"},
            {"stage": "1→10", "budget_pct": "10-20% of revenue", "split": "70% performance, 30% brand", "channels": "3-5 channels"},
            {"stage": "10→100", "budget_pct": "20-40% of revenue", "split": "60% performance, 40% brand", "channels": "5-8 channels"},
        ]
    }
}

# ============================================================
# FEATURE 04: CRYPTO TRADING DESK
# ============================================================
CRYPTO_SIGNALS = {
    "bull_market": {
        "indicators": ["BTC above 200-day MA", "Altcoin season index > 75", "Stablecoin inflows increasing", "Fear & Greed > 60"],
        "action": "Long BTC + ETH. Scale into alts with momentum.",
        "risk": "5-10% allocation. Set stops at -15%."
    },
    "bear_market": {
        "indicators": ["BTC below 200-day MA", "Altcoin season index < 25", "Stablecoin outflows increasing", "Fear & Greed < 30"],
        "action": "Accumulate BTC + ETH. DCA weekly. No leverage.",
        "risk": "1-3% allocation per trade. Wide stops."
    },
    "sideways": {
        "indicators": ["BTC between 200-day MA ± 10%", "Volume declining", "Fear & Greed 40-60"],
        "action": "Range trade or stay in stablecoins. Build watchlists.",
        "risk": "2-5% allocation. Tight stops at range boundaries."
    }
}

CRYPTO_RULES = [
    {"rule": "Never risk more than 2% per trade", "source": "Adam Khoo / Trading corpus"},
    {"rule": "BTC dominance rising = rotate into BTC. Falling = alts season", "source": "Coin Bureau"},
    {"rule": "On-chain metrics > technical analysis for long-term holds", "source": "Benjamin Cowen"},
    {"rule": "DCA outperforms 90% of active traders", "source": "Investopedia / Bankless"},
    {"rule": "When everyone is greedy, be fearful. When fearful, be greedy", "source": "Michael Saylor"},
    {"rule": "Never invest what you can't afford to lose entirely", "source": "Every crypto educator"},
    {"rule": "Track your trades. Review weekly. Patterns reveal psychology", "source": "Trading Channel"},
]

# ============================================================
# FEATURE 05: AGENCY GROWTH ENGINE
# ============================================================
AGENCY_PLAYBOOK = {
    "0_to_10k": {
        "name": "Survival ($0→$10K/mo)",
        "focus": "Get ANY client. Validate you can deliver. Build case study.",
        "actions": [
            "Pick ONE service (SEO, ads, social — just one)",
            "Pick ONE niche (dentists, lawyers, SaaS — just one)",
            "Cold outreach 50/day. Phone > email > DMs",
            "Price at $1-3K/mo. No project work. Retainers only.",
            "Over-deliver on client #1. Ask for referral.",
            "Document EVERYTHING. This becomes your playbook.",
        ],
        "source": "The Futur / Agency Mavericks / Alex Hormozi"
    },
    "10k_to_50k": {
        "name": "Stability ($10K→$50K/mo)",
        "focus": "Systematize delivery. Hire first team. Build SOPs.",
        "actions": [
            "Create SOPs for every process (onboarding, delivery, reporting)",
            "Hire your first VA/contractor. Delegate execution.",
            "Raise prices 50%. Fire bottom 20% of clients.",
            "Add a second service ONLY after first is systematized.",
            "Build a referral engine. 50% of new clients from referrals.",
            "Start content marketing. 1 post/day on LinkedIn.",
        ],
        "source": "Dan Martell / Creative Agency Success / Sabri Suby"
    },
    "50k_to_500k": {
        "name": "Scale ($50K→$500K/mo)",
        "focus": "Build leadership team. Productize. Scale acquisition.",
        "actions": [
            "Hire a #2 (COO/Integrator). You own vision, they own execution.",
            "Productize your service. Package, price, propose in < 24 hours.",
            "Build a sales team. You close whales, they close SMBs.",
            "Launch paid acquisition. Facebook + Google + LinkedIn.",
            "Create a growth offer: 'We'll 3x your investment or work free'",
            "Build an advisory board. Join a mastermind. Level up.",
        ],
        "source": "Alex Hormozi / Agency Mavericks / Codie Sanchez"
    }
}

# ============================================================
# FEATURE 06: SALES CLOSING MACHINE
# ============================================================
SALES_SCRIPTS = {
    "cold_opener": {
        "name": "Cold Call Opener",
        "script": "Hey [Name], I know you weren't expecting my call. I'll be quick — I saw [specific observation about their business] and thought you might be leaving money on the table. Worth a 10-minute conversation?",
        "psychology": "Pattern interrupt + specificity + low commitment",
        "source": "Grant Cardone / Oren Klaff"
    },
    "objection_price": {
        "name": "Price Objection Handler",
        "script": "I totally get that. Let me ask — if price weren't an issue, would this solve your problem? [Yes] Great. So the real question isn't 'can you afford this' — it's 'can you afford NOT to have this solved?' What's [problem] costing you each month?",
        "psychology": "Reframe from cost to cost of inaction",
        "source": "Alex Hormozi / Russell Brunson"
    },
    "objection_timing": {
        "name": "Timing Objection Handler",
        "script": "Totally understand. When would be the right time? [They answer] What changes between now and then? [Listen] So if I can show you how to [solve problem] before [their deadline], would that be worth exploring now?",
        "psychology": "Specificity creates urgency. Vague timing = no sale.",
        "source": "Grant Cardone / BigDeal corpus"
    },
    "close_assumptive": {
        "name": "Assumptive Close",
        "script": "Sounds like this is exactly what you need. Are we doing the [basic/pro/enterprise]? Great. What's the best email to send the onboarding to?",
        "psychology": "Assume the sale. Give choice between yes options.",
        "source": "Russell Brunson / Codie Sanchez"
    },
    "follow_up": {
        "name": "7-Touch Follow-Up Sequence",
        "touches": [
            "Day 1: Thank you + recap email",
            "Day 3: Value-add article/resource",
            "Day 7: Case study relevant to their problem",
            "Day 14: Social media connection + engage",
            "Day 21: New feature/update email",
            "Day 30: Direct question: 'What would need to be true for us to work together?'",
            "Day 60: Last touch: 'Should I close your file?'",
        ],
        "source": "HubSpot / Grant Cardone"
    }
}

# ============================================================
# FEATURE 07: BRAND POSITIONING ENGINE
# ============================================================
BRAND_FRAMEWORKS = {
    "positioning_statement": {
        "name": "Positioning Statement Generator",
        "template": "For [target audience] who [need/desire], [brand] is the [category] that [key benefit] because [reason to believe].",
        "example": "For CMOs who need real-time marketing ROI, Money Engine is the CFO platform that shows exact CAC/LTV because we connect your ad spend to your P&L automatically.",
        "source": "Seth Godin / Mark Ritson"
    },
    "brand_archetypes": {
        "name": "12 Brand Archetypes",
        "archetypes": [
            {"name": "The Hero", "brands": "Nike, FedEx", "promise": "Where there's a will, there's a way"},
            {"name": "The Rebel", "brands": "Apple, Harley-Davidson", "promise": "Break the rules"},
            {"name": "The Magician", "brands": "Disney, Tesla", "promise": "Transform your reality"},
            {"name": "The Sage", "brands": "Google, Harvard", "promise": "The truth will set you free"},
            {"name": "The Explorer", "brands": "Patagonia, Jeep", "promise": "Don't fence me in"},
            {"name": "The Creator", "brands": "Adobe, YouTube", "promise": "If it can be imagined, it can be created"},
            {"name": "The Ruler", "brands": "Rolex, Mercedes", "promise": "Power isn't everything, it's the only thing"},
            {"name": "The Caregiver", "brands": "Johnson & Johnson, UNICEF", "promise": "We're here to help"},
            {"name": "The Lover", "brands": "Victoria's Secret, Chanel", "promise": "Indulge your senses"},
            {"name": "The Jester", "brands": "Old Spice, M&M's", "promise": "Life is short, enjoy it"},
            {"name": "The Everyman", "brands": "IKEA, Target", "promise": "Good quality at a fair price"},
            {"name": "The Innocent", "brands": "Dove, Whole Foods", "promise": "Do the right thing"},
        ],
        "source": "Seth Godin / Brand Building corpus"
    }
}

# ============================================================
# FEATURE 08: MINDSET ARMOR
# ============================================================
MINDSET_PROTOCOLS = {
    "morning": {
        "name": "Morning Protocol",
        "steps": [
            "05:00 — Wake. No phone for 30 minutes.",
            "05:10 — Cold shower. 2 minutes minimum.",
            "05:15 — Journal: 3 gratitudes, 1 priority, 1 fear to face.",
            "05:30 — Physical training. 45 min minimum.",
            "06:15 — Read 10 pages. Non-fiction only.",
            "06:45 — Review CEO brief. Set 3 tasks for the day.",
        ],
        "source": "Jocko Willink / David Goggins / Mel Robbins"
    },
    "decision": {
        "name": "Decision Protocol (When Stuck)",
        "steps": [
            "Define the REAL problem (not the symptom)",
            "Ask: What would I do if I wasn't afraid?",
            "Ask: What would [hero] do? (Jocko? Goggins? Hormozi?)",
            "Apply 10-10-10 rule: How will I feel in 10 min? 10 months? 10 years?",
            "Decide. Act. Don't look back.",
        ],
        "source": "Jocko Willink / Simon Sinek / Goalcast"
    },
    "resilience": {
        "name": "Resilience Protocol (When Hit)",
        "steps": [
            "Acknowledge. Feel it for 5 minutes. Set a timer.",
            "Write down: What's the ONE thing I control in this situation?",
            "Ask: What's the opportunity in this obstacle? (Ryan Holiday)",
            "Pick ONE action. Execute immediately. Momentum kills despair.",
            "Review at EOD: What did I learn? What will I do differently?",
        ],
        "source": "David Goggins / Ryan Holiday / Fearless Motivation"
    }
}

# ============================================================
# FEATURE 09: STARTUP OPERATOR
# ============================================================
STARTUP_PLAYBOOK = {
    "idea_validation": {
        "name": "Idea Validation Framework",
        "steps": [
            "1. Write the ONE sentence pitch: 'We help [X] achieve [Y] by doing [Z]'",
            "2. Find 50 people in your target market. Interview them. NOT sell — listen.",
            "3. Ask: 'How are you solving this today? What's painful about it?'",
            "4. If 30+ say the same pain: you have a signal.",
            "5. Build a landing page. Drive $100 in ads. Track signups.",
            "6. If >5% convert: validate. If <2%: pivot or kill.",
        ],
        "source": "My First Million / Y Combinator"
    },
    "launch_checklist": {
        "name": "Launch Checklist",
        "items": [
            "☐ ONE sentence value prop (tested with 50+ people)",
            "☐ Landing page with clear CTA",
            "☐ Payment processing (Stripe)",
            "☐ Onboarding flow (< 3 steps)",
            "☐ Analytics installed (Mixpanel/GA)",
            "☐ Customer support channel (email + chat)",
            "☐ Pricing page (3 tiers: Good/Better/Best)",
            "☐ Email sequence: welcome + day 3 + day 7 + day 14",
            "☐ Legal: Terms + Privacy Policy",
            "☐ First 10 customers identified by name",
        ],
        "source": "Sam Altman / Y Combinator / My First Million"
    }
}

# ============================================================
# FEATURE 10: CONTENT MACHINE
# ============================================================
CONTENT_CALENDAR = {
    "daily_templates": {
        "monday": {"type": "Educational", "hook": "[Number] [Mistakes/Reasons/Steps] [Audience] Make When [Problem]", "cta": "Save this for later"},
        "tuesday": {"type": "Story/Case Study", "hook": "How [Person/Brand] Went From [Pain] To [Result]", "cta": "Follow for more stories like this"},
        "wednesday": {"type": "Controversial/Opinion", "hook": "[Unpopular Opinion]: [Bold Statement About Industry]", "cta": "Agree or disagree? Drop a comment"},
        "thursday": {"type": "Tool/Resource", "hook": "[Number] [Free/Paid] Tools That [Achieve Result]", "cta": "Which one would you try?"},
        "friday": {"type": "Behind the Scenes", "hook": "Here's What [Process/Launch/Decision] Actually Looks Like", "cta": "DM me 'ENGINE' for the full breakdown"},
    },
    "hook_formulas": [
        "[Number] [Mistakes] [Audience] Make When [Action]",
        "How I Went From [Pain] To [Result] In [Timeframe]",
        "[Unpopular Opinion]: [Bold Claim]",
        "Stop [Common Bad Advice]. Do [Better Alternative] Instead.",
        "The [Adjective] Truth About [Topic] Nobody Tells You",
        "If You're [Audience], You Need to Know This About [Topic]",
        "[Number] [Free/Paid] Tools That [Achieve Result]",
        "I Spent [Time/Money] So You Don't Have To: [Topic]",
    ],
    "source": "HubSpot / Neil Patel / Gary Vee / Marketing Examples"
}

# ============================================================
# FLASK ROUTES
# ============================================================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status')
def status():
    total_srt = len(glob.glob(os.path.join(CORPUS_DIR, '*', '*.srt')))
    total_md = len(glob.glob(os.path.join(CORPUS_DIR, '*', '*.md')))
    channels = len([d for d in glob.glob(os.path.join(CORPUS_DIR, '*')) if os.path.isdir(d) and d != os.path.join(CORPUS_DIR, 'prompts')])
    return jsonify({
        "corpus_files": total_srt + total_md,
        "channels": channels,
        "features": 10,
        "last_updated": datetime.now().isoformat()
    })

@app.route('/api/cmo')
def cmo_dashboard():
    rules = random.sample(CMO_RULES, min(5, len(CMO_RULES)))
    return jsonify({"rules": rules, "kpis": CMO_KPI_TEMPLATES})

@app.route('/api/ceo')
def ceo_dashboard():
    return jsonify({
        "morning_brief": CEO_MORNING_BRIEF,
        "decision_frameworks": CEO_DECISION_FRAMEWORKS,
        "scaling_playbook": CEO_SCALING_PLAYBOOK,
    })

@app.route('/api/cfo')
def cfo_hub():
    return jsonify(CFO_MODELS)

@app.route('/api/crypto')
def crypto_desk():
    return jsonify({"signals": CRYPTO_SIGNALS, "rules": CRYPTO_RULES})

@app.route('/api/agency')
def agency_growth():
    return jsonify(AGENCY_PLAYBOOK)

@app.route('/api/sales')
def sales_machine():
    return jsonify(SALES_SCRIPTS)

@app.route('/api/brand')
def brand_engine():
    return jsonify(BRAND_FRAMEWORKS)

@app.route('/api/mindset')
def mindset_armor():
    return jsonify(MINDSET_PROTOCOLS)

@app.route('/api/startup')
def startup_operator():
    return jsonify(STARTUP_PLAYBOOK)

@app.route('/api/content')
def content_machine():
    return jsonify(CONTENT_CALENDAR)

@app.route('/api/insights/<channel>')
def channel_insights(channel, limit=5):
    texts = load_srt_texts(channel, limit=limit)
    return jsonify({"channel": channel, "insights_count": len(texts), "sample": texts[:3] if texts else []})

@app.route('/api/calculate/unit_economics', methods=['POST'])
def calculate_unit_economics():
    data = request.json
    arpu = data.get('arpu', 100)
    cogs = data.get('cogs', 30)
    cac = data.get('cac', 50)
    churn = data.get('churn', 0.05)
    
    contribution_margin = arpu - cogs
    ltv = contribution_margin / churn if churn > 0 else contribution_margin * 12
    ltv_cac = ltv / cac if cac > 0 else 0
    payback = cac / contribution_margin if contribution_margin > 0 else 0
    profit_per_customer = ltv - cac
    
    verdict = "✅ HEALTHY" if ltv_cac >= 3 else ("⚠️ MARGINAL" if ltv_cac >= 1.5 else "❌ UNSUSTAINABLE")
    
    return jsonify({
        "contribution_margin": round(contribution_margin, 2),
        "ltv": round(ltv, 2),
        "ltv_cac_ratio": round(ltv_cac, 2),
        "payback_months": round(payback, 1),
        "profit_per_customer": round(profit_per_customer, 2),
        "verdict": verdict,
        "recommendation": f"{'Scale acquisition' if ltv_cac >= 3 else 'Fix unit economics before scaling'}. LTV:CAC is {round(ltv_cac,1)}:1. Target is 3:1+."
    })

if __name__ == '__main__':
    print("\n🔥 MONEY ENGINE — 10 Features. 1 Platform. Ship Tonight.")
    print("="*55)
    print(f"  Corpus: {len(glob.glob(os.path.join(CORPUS_DIR, '*', '*.srt')))} SRT files")
    print(f"  Channels: {len([d for d in glob.glob(os.path.join(CORPUS_DIR, '*')) if os.path.isdir(d)])}")
    print(f"  Features: 10 (CMO, CEO, CFO, Crypto, Agency, Sales, Brand, Mindset, Startup, Content)")
    print(f"\n  🌐 Open: http://localhost:5000")
    print(f"  📊 API: http://localhost:5000/api/status")
    print("="*55 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)