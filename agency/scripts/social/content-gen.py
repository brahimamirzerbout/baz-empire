#!/usr/bin/env python3
"""
Social Media Content Generator
Generates post ideas, captions, and hashtag suggestions
Usage: python3 content-gen.py "topic" [--platform PLATFORM] [--count N]
"""

import json
import random
import argparse
from datetime import datetime, timedelta

# Content templates by platform
TEMPLATES = {
    "instagram": {
        "hooks": [
            "🚀 Did you know that {topic}?",
            "💡 Here's the truth about {topic}...",
            "🔥 Stop scrolling — {topic} just changed everything",
            "⚡ 3 reasons {topic} matters right now",
            "🎯 The secret about {topic} no one talks about",
            "📊 {topic} by the numbers 👇",
            "✨ What if I told you about {topic}?",
            "💪 The {topic} hack that changed our workflow",
        ],
        "ctas": [
            "Save this for later! 📌",
            "Drop a 🔥 if you agree!",
            "Tag someone who needs to see this!",
            "Share this with your team! 🚀",
            "Comment YES if you've experienced this!",
            "Follow for more {topic} tips! ✅",
        ],
        "hashtag_pools": {
            "general": ["#marketing", "#digitalmarketing", "#socialmediamarketing", "#contentcreator",
                       "#branding", "#growthhacking", "#entrepreneur", "#business"],
            "engagement": ["#explore", "#viral", "#trending", "#fyp", "#reels",
                          "#instagood", "#follow", "#like4like"],
        }
    },
    "twitter": {
        "hooks": [
            "Thread: Everything you need to know about {topic} 🧵",
            "Unpopular opinion: {topic} is overrated.\n\nHere's why 👇",
            "I spent 6 months studying {topic}.\n\nHere are the 5 biggest takeaways:",
            "The #1 mistake people make with {topic}:\n\nThey overthink it.",
            "Hot take: {topic} will define 2025.\n\nAgree? 🤔",
        ],
        "ctas": [
            "Retweet the first tweet! 🔁",
            "Follow for more insights 📈",
            "What's your take? Reply below 👇",
        ],
        "hashtag_pools": {
            "general": ["#marketing", "#digitalmarketing", "#growth", "#startup",
                       "#SaaS", "#branding", "#contentmarketing"],
        }
    },
    "linkedin": {
        "hooks": [
            "I've been working in {topic} for over 5 years.\n\nHere's what I wish I knew on day one:",
            "The {topic} industry is broken.\n\nBut no one wants to talk about it.",
            "Last week, our team cracked the code on {topic}.\n\nThe results were surprising.",
            "Most companies get {topic} completely wrong.\n\nHere's the framework that actually works:",
            "I asked 100 CMOs about {topic}.\n\n85% said the same thing 👇",
        ],
        "ctas": [
            "Agree? Hit like 👍\nDisagree? I'd love to hear your perspective in the comments.",
            "Share this with someone in your network who needs to see it.",
            "Follow for more insights on {topic}.",
            "What's your experience with {topic}? Drop it in the comments.",
        ],
        "hashtag_pools": {
            "general": ["#marketing", "#digitalmarketing", "#leadership", "#businessstrategy",
                       "#innovation", "#growth", "#entrepreneurship", "#CMO"],
        }
    }
}

PLATFORMS = list(TEMPLATES.keys())

def generate_posts(topic, platform="instagram", count=5):
    """Generate social media posts for a topic."""
    tmpl = TEMPLATES.get(platform, TEMPLATES["instagram"])
    posts = []

    for i in range(count):
        hook = random.choice(tmpl["hooks"]).format(topic=topic)
        cta = random.choice(tmpl["ctas"]).format(topic=topic)

        # Build hashtag set
        hashtags = set()
        for pool_name, pool in tmpl["hashtag_pools"].items():
            hashtags.update(random.sample(pool, min(5, len(pool))))

        # Specific hashtags from topic
        topic_tag = "#" + topic.lower().replace(" ", "").replace("-", "")
        hashtags.add(topic_tag)

        post = {
            "platform": platform,
            "topic": topic,
            "content": f"{hook}\n\n{cta}",
            "hashtags": " ".join(sorted(hashtags)[:8]),
            "best_time": get_best_time(platform),
            "estimated_reach": get_reach_estimate(platform),
        }
        posts.append(post)

    return posts

def get_best_time(platform):
    """Suggest best posting times."""
    times = {
        "instagram": ["Tue-Thu 10-11am", "Tue-Thu 2-3pm", "Mon 11am-12pm"],
        "twitter": ["Mon-Fri 8-10am", "Mon-Fri 12-1pm", "Wed 5-6pm"],
        "linkedin": ["Tue-Wed 7-8am", "Tue-Wed 12pm", "Thu 10-11am"],
    }
    return random.choice(times.get(platform, ["Weekdays 9-11am"]))

def get_reach_estimate(platform):
    """Rough organic reach estimate."""
    reach = {
        "instagram": "15-30% organic",
        "twitter": "2-5% organic",
        "linkedin": "10-20% organic",
    }
    return reach.get(platform, "5-15% organic")

def content_calendar(topic, days=7):
    """Generate a week-long content calendar."""
    platforms = ["instagram", "twitter", "linkedin"]
    calendar = []

    for day in range(days):
        date = (datetime.now() + timedelta(days=day)).strftime("%Y-%m-%d")
        weekday = (datetime.now() + timedelta(days=day)).strftime("%A")
        platform = platforms[day % len(platforms)]
        posts = generate_posts(topic, platform, count=1)

        calendar.append({
            "date": date,
            "day": weekday,
            "platform": platform,
            "post": posts[0]["content"],
            "hashtags": posts[0]["hashtags"],
            "best_time": posts[0]["best_time"],
        })

    return calendar

def main():
    parser = argparse.ArgumentParser(description="Social Media Content Generator")
    parser.add_argument("topic", help="Content topic")
    parser.add_argument("--platform", "-p", choices=PLATFORMS, default="instagram",
                       help="Target platform (default: instagram)")
    parser.add_argument("--count", "-n", type=int, default=5, help="Number of posts (default: 5)")
    parser.add_argument("--calendar", "-c", action="store_true", help="Generate weekly calendar")
    parser.add_argument("--all", "-a", action="store_true", help="Generate for all platforms")
    parser.add_argument("--json", "-j", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    if args.calendar:
        cal = content_calendar(args.topic)
        if args.json:
            print(json.dumps(cal, indent=2))
        else:
            print(f"\n📅 WEEKLY CONTENT CALENDAR: {args.topic.upper()}")
            print("=" * 60)
            for entry in cal:
                print(f"\n  {entry['day']} ({entry['date']})")
                print(f"  Platform: {entry['platform'].upper()}")
                print(f"  Post: {entry['post']}")
                print(f"  Tags: {entry['hashtags']}")
                print(f"  Best time: {entry['best_time']}")
            print()
        return

    platforms = PLATFORMS if args.all else [args.platform]

    for platform in platforms:
        posts = generate_posts(args.topic, platform, args.count)

        if args.json:
            print(json.dumps(posts, indent=2))
        else:
            print(f"\n📱 {platform.upper()} POSTS: {args.topic}")
            print("-" * 50)
            for i, post in enumerate(posts, 1):
                print(f"\n  Post #{i}")
                print(f"  {post['content']}")
                print(f"  {post['hashtags']}")
                print(f"  ⏰ Best time: {post['best_time']}")
                print(f"  📊 Est. reach: {post['estimated_reach']}")

if __name__ == "__main__":
    main()