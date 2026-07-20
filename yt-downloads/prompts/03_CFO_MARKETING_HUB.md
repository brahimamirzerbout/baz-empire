# PROMPT 03: CFO MARKETING HUB — Where Finance Meets Marketing
## Generates: Financial intelligence layer for marketing decisions

### SYSTEM PROMPT
You are a CFO who understands marketing. Given transcripts from finance, accounting, and marketing finance sources, extract:
1. Every financial metric that connects to marketing (CAC payback, contribution margin, LTV:CAC)
2. Every P&L line item a CMO should own
3. Every accounting principle that affects marketing decisions
4. Every financial model for marketing ROI
5. Every warning sign that marketing spend is inefficient
6. Every benchmark for unit economics by industry/stage

### INPUT FILES
- accountingstuff/ (108 files — accounting fundamentals)
- edspira/ (553 files — accounting/finance education)
- investopedia/ (425 files — financial definitions)
- marketingcfo/ (58 files — marketing finance)
- uniteconomics/ (57 files — CAC, LTV, margins)
- grahamstephan/ (874 files — personal finance → business finance)
- ramitsethi/ (664 files — money psychology, earning)
- adamkhoo/ (551 files — trading + investing)
- tradingchannel/ (187 files — technical analysis)

### OUTPUT
```python
# cfo_marketing_hub.py — Feature: Financial Intelligence for Marketing

class CFOMarketingHub:
    def unit_economics_engine(self):
        """Real-time CAC/LTV/payback calculations"""
        # Sources: uniteconomics/, marketingcfo/
        pass
    
    def p_and_l_for_cmo(self):
        """CMO-friendly P&L with marketing-specific line items"""
        # Sources: accountingstuff/, edspira/
        pass
    
    def budget_forecaster(self):
        """Marketing budget forecasting with seasonality"""
        # Sources: investopedia/, marketingcfo/
        pass
    
    def roi_calculator(self):
        """Channel-level ROI with attribution"""
        # Sources: uniteconomics/, neilpatel/
        pass
    
    def benchmark_engine(self):
        """Industry benchmarks for every marketing metric"""
        # Sources: investopedia/, hubspot/
        pass
    
    def cash_flow_planner(self):
        """Marketing spend vs cash flow timing"""
        # Sources: accountingstuff/, ceodashboard/
        pass
```

### REVENUE MAP
| Feature | Revenue |
|---------|---------|
| Unit Economics Engine | $149/mo |
| CMO P&L View | $99/mo |
| Budget Forecaster | $199/mo |
| ROI Calculator | $149/mo |
| Benchmark Engine | $79/mo |
| **Full CFO Hub** | **$399/mo** |

### KEY INSIGHTS FROM CORPUS
- "Revenue is vanity, profit is sanity, cash is reality" — Investopedia
- "If CAC payback > 12 months, you're buying revenue not earning it" — Marketing CFO corpus
- "The P&L is the CMO's most important document" — Adam Erhart
- "Contribution margin must exceed 60% for paid acquisition to work" — Unit Economics corpus