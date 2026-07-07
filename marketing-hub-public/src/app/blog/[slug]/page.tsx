import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getRelatedPosts, BLOG_POSTS } from "@/lib/blog";
import { Clock, Tag, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — BAZ Empire Blog`,
    description: post.excerpt,
  };
}

function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Minimal markdown-lite renderer — paragraphs, ## headings, - lists, **bold**. */
function renderBody(body: string) {
  const lines = body.split("\n");
  const out: Record<string, unknown>[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) {
      out.push(
        <p key={`p-${out.length}`} className="text-base leading-relaxed mb-4 opacity-90">
          {renderInline(para.join(" "))}
        </p>,
      );
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc pl-6 space-y-1.5 mb-4 opacity-90">
          {list.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      out.push(
        <h2 key={`h-${out.length}`} className="text-2xl font-black mt-8 mb-3">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("- ")) {
      flushPara();
      list.push(line.slice(2));
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return out;
}

function renderInline(s: string) {
  const parts: Record<string, unknown>[] = [];
  let i = 0;
  let key = 0;
  while (i < s.length) {
    const bold = s.indexOf("**", i);
    if (bold === -1) {
      parts.push(s.slice(i));
      break;
    }
    parts.push(s.slice(i, bold));
    const end = s.indexOf("**", bold + 2);
    if (end === -1) {
      parts.push(s.slice(bold));
      break;
    }
    parts.push(<strong key={key++}>{s.slice(bold + 2, end)}</strong>);
    i = end + 2;
  }
  return parts;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();
  const related = getRelatedPosts(post.slug);

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
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
          >
            <ArrowLeft className="w-4 h-4" /> All essays
          </Link>
          <Link href="/leads" className="text-sm font-bold text-amber-600 hover:text-amber-500">
            Free sprint →
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-2">
          <Link
            href={`/blog#cat-${post.category}`}
            className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600"
          >
            {post.category}
          </Link>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm opacity-70">
          <span>{post.author}</span>
          <span>·</span>
          <span>{fmtDate(post.publishedAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readMinutes} min read
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold"
            >
              <Tag className="w-3 h-3" /> {t}
            </span>
          ))}
        </div>

        <p className="text-lg mt-8 opacity-90 italic border-l-4 border-amber-400 pl-4">
          {post.excerpt}
        </p>

        <div className="mt-8">{renderBody(post.body)}</div>

        {/* CTA at end */}
        <div
          className="mt-12 rounded-2xl p-6 text-center"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)" }}
        >
          <h3 className="text-xl font-black text-white">Ready to apply this?</h3>
          <p className="text-white/90 mt-2">
            The Hub runs the audit, applies the formula, and ships the work — all on one machine.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Link
              href="/leads"
              className="bg-white dark:bg-zinc-900 text-amber-700 font-bold px-5 py-2.5 rounded-lg hover:bg-amber-50"
            >
              Start 7-day sprint
            </Link>
            <Link
              href="/case-studies"
              className="bg-white dark:bg-zinc-900/10 text-white border border-white/30 font-bold px-5 py-2.5 rounded-lg hover:bg-white dark:bg-zinc-900/20"
            >
              See case studies
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-black mb-4">Keep reading</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="block group">
                  <article
                    className="rounded-lg p-4 border h-full hover:border-amber-400 transition-colors"
                    style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {fmtDate(r.publishedAt)} · {r.readMinutes} min
                    </div>
                    <h3 className="font-bold text-sm leading-snug group-hover:text-amber-600 transition-colors">
                      {r.title}
                    </h3>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <footer className="border-t mt-12" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="max-w-3xl mx-auto px-6 py-6 text-sm opacity-70 flex items-center justify-between flex-wrap gap-3">
          <div>{BLOG_POSTS.length} essays · BAZ Empire Blog</div>
          <div className="flex gap-4">
            <Link href="/site">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
