#!/usr/bin/env python3
"""
Email Campaign Builder
Generates email templates for marketing campaigns
Usage: python3 email-campaign.py "product" --type TYPE --audience AUDIENCE
"""

import argparse
import json
from datetime import datetime

TEMPLATES = {
    "cold_outreach": {
        "subject_lines": [
            "Quick question about {topic}",
            "{topic} — worth a 5-min chat?",
            "Re: your {topic} strategy",
            "Idea for {topic} that might help",
            "Saw your work on {topic}",
        ],
        "body_template": """Hi {{first_name}},

I noticed {{company}} is doing great work in the {{industry}} space, and I wanted to reach out.

We've helped businesses like yours with {topic} — specifically:

• {{benefit_1}}
• {{benefit_2}}
• {{benefit_3}}

For example, we recently helped {{case_study_client}} achieve {{case_study_result}}.

Would you be open to a quick 15-min call this week to see if we can help {{company}} too?

Best,
{{your_name}}
{{your_title}}""",
        "tips": [
            "Keep emails under 125 words",
            "Personalize the first line",
            "Include 1 clear CTA",
            "Send Tue-Thu 9-11am",
            "Follow up 3x before giving up",
        ]
    },
    "newsletter": {
        "subject_lines": [
            "This week in {topic}",
            "Your {topic} update is here",
            "5 things about {topic} you missed",
            "The {topic} digest — {date}",
            "{topic} insights inside 📊",
        ],
        "body_template": """# 📰 {topic} Weekly

---

## 🔥 Top Story
{{headline}}
{{summary}}

---

## 💡 Tip of the Week
{{tip}}

---

## 📊 By the Numbers
- {{stat_1}}
- {{stat_2}}
- {{stat_3}}

---

## 🛠️ Tool Spotlight
**{{tool_name}}** — {{tool_description}}
{{tool_link}}

---

## 📅 Upcoming Events
- {{event_1}}
- {{event_2}}

---

Until next week,
{{your_name}}""",
        "tips": [
            "Send consistently (same day, same time)",
            "Aim for 20-30% open rate",
            "Use emojis in subject lines (sparingly)",
            "Include 1 main CTA",
            "Keep scroll depth reasonable",
        ]
    },
    "promo": {
        "subject_lines": [
            "🎉 {topic} deal inside!",
            "Don't miss this {topic} offer",
            "Last chance: {topic} promotion",
            "Your exclusive {topic} discount",
            "🎁 {topic} — special offer for you",
        ],
        "body_template": """Hi {{first_name}},

Great news — we're running a special offer on {topic}!

{{offer_description}}

✅ **What you get:**
- {{benefit_1}}
- {{benefit_2}}
- {{benefit_3}}

💰 **Special Price:** {{price}} (normally {{original_price}})

⏰ **Offer expires:** {{expiry_date}}

[CTA BUTTON: {{cta_text}}]

Questions? Just reply to this email.

Cheers,
{{your_name}}""",
        "tips": [
            "Create urgency with deadlines",
            "Lead with value, not discount",
            "Use 1 clear CTA button",
            "Segment your audience",
            "Test subject lines A/B",
        ]
    },
    "follow_up": {
        "subject_lines": [
            "Following up on {topic}",
            "Still interested in {topic}?",
            "{{first_name}}, quick follow-up",
            "Did you see this about {topic}?",
            "One more thing about {topic}",
        ],
        "body_template": """Hi {{first_name}},

Just following up on my last email about {topic}.

I know you're busy, so I'll keep this short:

{{key_point}}

Would any of these times work for a quick chat?
• {{time_option_1}}
• {{time_option_2}}
• {{time_option_3}}

Or feel free to suggest another time.

Best,
{{your_name}}""",
        "tips": [
            "Wait 2-3 days before following up",
            "Add new value in each follow-up",
            "Keep it shorter than the original",
            "Maximum 3-4 follow-ups",
            "Change the subject line each time",
        ]
    },
    "welcome": {
        "subject_lines": [
            "Welcome to {topic}! 🎉",
            "You're in! Here's your {topic} guide",
            "Nice to meet you — {topic}",
            "Your {topic} journey starts now",
        ],
        "body_template": """Hey {{first_name}}! 👋

Welcome aboard! You've just joined {{community_size}}+ others who are leveling up their {topic} game.

Here's what to do next:

**1️⃣ Step One**
{{step_1_description}}

**2️⃣ Step Two**
{{step_2_description}}

**3️⃣ Step Three**
{{step_3_description}}

📌 **Quick Links:**
- {{resource_1}}
- {{resource_2}}
- {{resource_3}}

Hit reply if you have any questions — we're here to help!

{{your_name}}""",
        "tips": [
            "Send immediately after signup",
            "Set expectations for future emails",
            "Include a quick win in the first email",
            "Link to your best content",
            "Ask them to whitelist your email",
        ]
    }
}

AUDIENCES = {
    "startup": {"tone": "casual, energetic", "pain_points": ["budget", "time", "scaling"]},
    "enterprise": {"tone": "professional, data-driven", "pain_points": ["ROI", "compliance", "integration"]},
    "smb": {"tone": "friendly, practical", "pain_points": ["budget", "time", "growth"]},
    "ecommerce": {"tone": "persuasive, visual", "pain_points": ["conversion", "retention", "cart abandonment"]},
    "saas": {"tone": "technical, benefit-focused", "pain_points": ["churn", "adoption", "onboarding"]},
}

def generate_campaign(topic, campaign_type="cold_outreach", audience="smb", count=3):
    """Generate email campaign content."""
    tmpl = TEMPLATES.get(campaign_type, TEMPLATES["cold_outreach"])
    audience_info = AUDIENCES.get(audience, AUDIENCES["smb"])

    subjects = []
    for subject in tmpl["subject_lines"][:count]:
        subjects.append(subject.format(topic=topic, date=datetime.now().strftime("%b %d")))

    campaign = {
        "topic": topic,
        "type": campaign_type,
        "audience": audience,
        "tone": audience_info["tone"],
        "pain_points": audience_info["pain_points"],
        "subject_lines": subjects,
        "body": tmpl["body_template"].format(topic=topic),
        "tips": tmpl["tips"],
        "generated": datetime.now().isoformat(),
    }

    return campaign

def main():
    parser = argparse.ArgumentParser(description="Email Campaign Builder")
    parser.add_argument("topic", help="Email campaign topic/product")
    parser.add_argument("--type", "-t",
                       choices=list(TEMPLATES.keys()),
                       default="cold_outreach",
                       help="Campaign type (default: cold_outreach)")
    parser.add_argument("--audience", "-a",
                       choices=list(AUDIENCES.keys()),
                       default="smb",
                       help="Target audience (default: smb)")
    parser.add_argument("--count", "-n", type=int, default=3, help="Number of subject lines")
    parser.add_argument("--json", "-j", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    campaign = generate_campaign(args.topic, args.type, args.audience, args.count)

    if args.json:
        print(json.dumps(campaign, indent=2))
    else:
        print("\n" + "=" * 60)
        print(f"  📧 EMAIL CAMPAIGN: {args.topic}")
        print(f"  Type: {args.type} | Audience: {args.audience}")
        print("=" * 60)

        print(f"\n  🎯 Tone: {campaign['tone']}")
        print(f"  💢 Pain Points: {', '.join(campaign['pain_points'])}")

        print(f"\n  📝 Subject Line Options:")
        for i, subj in enumerate(campaign["subject_lines"], 1):
            print(f"     {i}. {subj}")

        print(f"\n  📄 Email Body:")
        for line in campaign["body"].split("\n"):
            print(f"     {line}")

        print(f"\n  💡 Tips:")
        for tip in campaign["tips"]:
            print(f"     • {tip}")

        print("\n" + "=" * 60)

if __name__ == "__main__":
    main()