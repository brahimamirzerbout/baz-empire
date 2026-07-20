# PROMPT 01: CMO DASHBOARD — Marketing Intelligence Command Center
## Generates: Full CMO dashboard feature with real-time KPIs, attribution, and P&L

### SYSTEM PROMPT
You are a CMO operating system. Given transcripts from marketing leaders, extract:
1. Every metric they mention (CAC, LTV, ROAS, MQL, SQL, etc.)
2. Every framework they use (funnel stages, attribution models, budget allocation rules)
3. Every decision-making rule (when to scale, when to cut, when to pivot)
4. Every tool they recommend (dashboards, analytics, automation)
5. Every warning sign they flag (vanity metrics, attribution fraud, platform dependency)

### INPUT FORMAT
Feed these channel SRT files as context:
- marketingcfo/ (58 files — P&L, unit economics, CAC/LTV)
- uniteconomics/ (57 files — unit economics deep dives)
- sethgodin/ (46 files — brand philosophy, positioning)
- markritson/ (42 files — brand strategy, measurement)
- neilpatel/ (520 files — SEO, content, growth)
- adamerhart/ (296 files — marketing strategy)
- adamerhartai/ (173 files — AI marketing tools)
- hubspot/ (310 files — inbound, CRM, automation)
- thefutur/ (410 files — pricing, value, agency growth)
- alexhormozi/ (447 files — offers, acquisition, retention)

### OUTPUT FORMAT
Generate production code for:
```python
# cmo_dashboard.py — Feature: Real-time CMO command center
# Inputs: marketing spend data, revenue data, channel data
# Outputs: KPI cards, attribution waterfall, budget optimizer, alert system

class CMODashboard:
    def __init__(self):
        self.metrics = {}  # Populated from corpus
        self.rules = []    # Decision rules from experts
        self.alerts = []   # Warning thresholds
    
    def calculate_unit_economics(self):
        """Extracted from: uniteconomics/, marketingcfo/"""
        # CAC, LTV, payback period, margin analysis
        pass
    
    def attribution_waterfall(self):
        """Extracted from: markritson/, neilpatel/"""
        # Long-term brand vs short-term direct response
        pass
    
    def budget_optimizer(self):
        """Extracted from: alexhormozi/, adamerhart/"""
        # Scale winners, cut losers, test budget allocation
        pass
    
    def ai_tool_stack(self):
        """Extracted from: adamerhartai/, AIchannels/"""
        # AI tools for each marketing function
        pass
```

### FEATURE REVENUE MAP
| Feature | Source | Revenue |
|---------|--------|---------|
| Unit Economics Calculator | uniteconomics/ | $99/mo |
| Attribution Waterfall | markritson/ | $149/mo |
| Budget Optimizer | hormozi/ | $199/mo |
| AI Tool Recommender | adamerhartai/ | $49/mo |
| KPI Alert System | marketingcfo/ | $79/mo |

### RULES FROM CORPUS
- "CAC must be < 1/3 of LTV" — Alex Hormozi
- "Brand advertising works on a 3-5 year lag" — Mark Ritson
- "If you can't measure it, you can't scale it" — Adam Erhart
- "The best marketing budget is one that compounds" — Ramit Sethi