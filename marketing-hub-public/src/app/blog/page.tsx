import Link from "next/link";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog";
import { Clock, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The BAZ Empire Blog — Marketing strategy, copy, and offers",
  description:
    "Long-form essays on STP, the Grand Slam Offer, Schwartz's 5 levels, Seth Godin's tribes, and the marketing frameworks that compound.",
};

function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS;
  const byCategory = new Map<string, typeof BLOG_POSTS>();
  for (const p of BLOG_POSTS) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category)!.push(p);
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      {/* Sticky nav */}
      <header
        className="border-b sticky top-0 z-20 backdrop-blur-md"
        style={{ background: "rgba(15,23,42,0.85)", borderColor: "rgb(var(--border))" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/site" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg grid place-items-center"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" }}
            >
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold">BAZ Empire · The Blog</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <Link href="/site" className="opacity-80 hover:opacity-100">
              Home
            </Link>
            <Link href="/case-studies" className="opacity-80 hover:opacity-100">
              Case studies
            </Link>
            <Link href="/leads" className="opacity-80 hover:opacity-100">
              7-day sprint
            </Link>
            <Link href="/pricing" className="opacity-80 hover:opacity-100">
              Pricing
            </Link>
            <Link href="/login" className="opacity-80 hover:opacity-100">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          The BAZ Empire Blog
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
          Marketing that{" "}
          <span className="bg-gradient-to-r from-amber-500 to-rose-600 bg-clip-text text-transparent">
            compounds.
          </span>
        </h1>
        <p className="text-base md:text-lg opacity-80 mt-4 max-w-2xl">
          Long-form essays on the frameworks that actually work — STP, the Grand Slam Offer,
          Schwartz's 5 levels, Seth Godin's tribes, and the marketing decisions that compound over
          decades.
        </p>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <Link href={`/blog/${featured.slug}`} className="block group">
            <article
              className="rounded-2xl overflow-hidden border-2 border-amber-400/30 hover:border-amber-400 transition-colors"
              style={{ background: "rgb(var(--surface))" }}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div
                  className="aspect-video md:aspect-auto relative"
                  style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
                >
                  <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                    <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
                      Featured
                    </div>
                    <div className="text-3xl md:text-4xl font-black leading-tight">
                      {featured.title}
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 text-xs opacity-70 mb-3">
                    <span>{featured.author}</span>
                    <span>·</span>
                    <span>{fmtDate(featured.publishedAt)}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featured.readMinutes} min read
                    </span>
                  </div>
                  <p className="text-base opacity-90 leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featured.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold"
                      >
                        <Tag className="w-3 h-3" /> {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 text-sm font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                    Read the essay →
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-2xl font-black mb-4">Browse by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BLOG_CATEGORIES.map((c) => {
            const count = (byCategory.get(c.id) ?? []).length;
            return (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="rounded-lg p-4 border hover:border-amber-400 transition-colors"
                style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
              >
                <div className="font-bold text-sm">{c.label}</div>
                <div className="text-xs opacity-70 mt-1">
                  {count} {count === 1 ? "essay" : "essays"}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Posts by category */}
      {BLOG_CATEGORIES.map((cat) => {
        const posts = byCategory.get(cat.id);
        if (!posts || posts.length === 0) return null;
        return (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className="max-w-6xl mx-auto px-6 mb-12 scroll-mt-20"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-black">{cat.label}</h2>
              <p className="text-sm opacity-70">{cat.description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                  <article
                    className="rounded-lg p-5 border h-full hover:border-amber-400 transition-colors"
                    style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
                  >
                    <div className="flex items-center gap-3 text-xs opacity-70 mb-2">
                      <span>{fmtDate(p.publishedAt)}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {p.readMinutes} min
                      </span>
                    </div>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-amber-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm opacity-80 mt-2 leading-relaxed">{p.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" }}
        >
          <h3 className="text-2xl md:text-3xl font-black text-white">
            Ship a 7-day marketing sprint
          </h3>
          <p className="text-white/90 mt-2 max-w-xl mx-auto">
            Free guided sprint that uses the Hub itself. Pick STP on day 1, ship a landing page on
            day 2, audit your offer on day 3.
          </p>
          <Link
            href="/leads"
            className="inline-block mt-5 bg-white dark:bg-zinc-900 text-amber-700 font-bold px-7 py-3 rounded-lg hover:bg-amber-50 transition-colors"
          >
            Start the free sprint →
          </Link>
        </div>
      </section>
    </div>
  );
}
