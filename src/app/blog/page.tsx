import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listBlogPosts } from "@/lib/data-store";
import { blogListPageCopy } from "@/lib/site-copy";
import { formatDate } from "@/lib/format";
import { isUnoptimizedImageSrc } from "@/lib/image-src";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";
import { blogListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İçgörüler | Econi Invest",
  description: "Gayrimenkul yatırımı, satış stratejisi, fiyatlama ve lokasyon trendleri üzerine uzman içerikler.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const language = await getServerSiteLanguage();
  const copy = blogListPageCopy(language);
  const posts = listBlogPosts();
  const schema = blogListSchema(posts);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="w-full pb-24">
        <section className="frame-wide fade-up rounded-lg border border-[var(--line)] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">{copy.heroKicker}</p>
          <h1 className="mt-3 text-[2.4rem] leading-[1.02] font-bold text-[var(--brand-primary)] sm:text-[3.8rem]">{copy.heroTitle}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-600)] sm:text-base">
            {copy.heroBody}
          </p>
        </section>

        <section className="frame mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="luxury-card overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fetchPriority="low"
                unoptimized={isUnoptimizedImageSrc(post.coverImage)}
                width={960}
                height={420}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="h-52 w-full object-cover"
              />
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
                  {formatDate(post.publishedAt, language)} • {post.authorName}
                </p>
                <h2 className="mt-2 text-[1.75rem] leading-[1.05] font-semibold text-[var(--brand-primary)]">{post.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-600)]">{post.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[var(--line)] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-accent-strong)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-semibold text-[#6b5028] underline">
                  {copy.read}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <SiteFooter />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>
    </div>
  );
}
