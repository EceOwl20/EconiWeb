import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { parseBlogContent } from "@/lib/blog-content";
import { getBlogPostBySlug, listBlogPosts } from "@/lib/data-store";
import { blogDetailPageCopy } from "@/lib/site-copy";
import { formatDate } from "@/lib/format";
import { isUnoptimizedImageSrc } from "@/lib/image-src";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";
import { blogMetadata, blogPostSchema } from "@/lib/seo";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function headingToneClass(tone: "default" | "accent" | "soft"): string {
  if (tone === "accent") {
    return "text-[var(--brand-accent-strong)]";
  }

  if (tone === "soft") {
    return "text-[var(--ink-700)]";
  }

  return "text-[var(--brand-primary)]";
}

function paragraphToneClass(tone: "default" | "accent" | "soft"): string {
  if (tone === "accent") {
    return "text-[var(--brand-accent-strong)]";
  }

  if (tone === "soft") {
    return "text-[var(--ink-600)]";
  }

  return "text-[var(--ink-700)]";
}

function listToneClass(tone: "default" | "accent" | "soft"): string {
  if (tone === "accent") {
    return "text-[var(--brand-accent-strong)] marker:text-[var(--brand-green)]";
  }

  if (tone === "soft") {
    return "text-[var(--ink-600)] marker:text-[var(--ink-500)]";
  }

  return "text-[var(--ink-700)] marker:text-[var(--brand-green)]";
}

function quoteToneClass(tone: "default" | "accent" | "soft"): string {
  if (tone === "accent") {
    return "border-[var(--brand-green)] bg-white text-[var(--brand-accent-strong)]";
  }

  if (tone === "soft") {
    return "border-[var(--line)] bg-white text-[var(--ink-600)]";
  }

  return "border-[var(--line-strong)] bg-white text-[var(--ink-700)]";
}

function headingAnchor(text: string, index: number): string {
  const slug = text
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `bolum-${index}-${slug || "icerik"}`;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return { title: "Blog Yazısı Bulunamadı | Econi Invest" };
  }

  return blogMetadata(post);
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const language = await getServerSiteLanguage();
  const copy = blogDetailPageCopy(language);
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const schema = blogPostSchema(post);
  const contentBlocks = parseBlogContent(post.content);
  const tableOfContents = contentBlocks
    .map((block, index) => {
      if (block.type !== "heading" || block.level < 2) {
        return null;
      }

      return {
        id: headingAnchor(block.text, index),
        text: block.text,
        level: block.level,
      };
    })
    .filter(Boolean) as Array<{ id: string; text: string; level: 2 | 3 | 4 | 5 }>;
  const relatedPosts = listBlogPosts()
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="w-full pb-24">
        <section className="frame-wide relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--brand-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="relative h-[280px] sm:h-[380px]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fetchPriority="high"
              unoptimized={isUnoptimizedImageSrc(post.coverImage)}
              fill
              sizes="(max-width: 1024px) 100vw, 1400px"
              className="absolute inset-0 object-cover"
            />
            <div className="hero-overlay absolute inset-0" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9">
              <Link href="/blog" className="text-sm font-semibold text-white underline">
                {copy.back}
              </Link>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/78">
                {formatDate(post.publishedAt, language)} • {post.authorName}
              </p>
              <h1 className="mt-2 max-w-4xl text-[2.2rem] leading-[1.02] font-semibold sm:text-[3.4rem]">{post.title}</h1>
            </div>
          </div>
        </section>

        <section className="frame mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <article className="luxury-card p-6 sm:p-8">
            <p className="text-base leading-8 text-[var(--ink-600)]">{post.excerpt}</p>

            <div className="mt-6 space-y-5 text-sm leading-8 sm:text-base">
              {contentBlocks.map((block, index) => {
                if (block.type === "heading") {
                  const levelClass =
                    block.level <= 2
                      ? "text-2xl font-semibold"
                      : block.level === 3
                        ? "text-xl font-semibold"
                        : block.level === 4
                          ? "text-lg font-semibold"
                          : "text-base font-semibold uppercase tracking-[0.08em]";
                  const headingClass = `${levelClass} ${headingToneClass(block.tone)}`;
                  const headingId = headingAnchor(block.text, index);

                  if (block.level === 1) {
                    return (
                      <h2 id={headingId} key={`heading-${index}`} className={headingClass}>
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.level === 2) {
                    return (
                      <h2 id={headingId} key={`heading-${index}`} className={headingClass}>
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.level === 3) {
                    return (
                      <h3 id={headingId} key={`heading-${index}`} className={headingClass}>
                        {block.text}
                      </h3>
                    );
                  }

                  if (block.level === 4) {
                    return (
                      <h4 id={headingId} key={`heading-${index}`} className={headingClass}>
                        {block.text}
                      </h4>
                    );
                  }

                  return (
                    <h5 id={headingId} key={`heading-${index}`} className={headingClass}>
                      {block.text}
                    </h5>
                  );
                }

                if (block.type === "list") {
                  if (block.ordered) {
                    return (
                      <ol key={`list-${index}`} className={`list-decimal space-y-1 pl-6 ${listToneClass(block.tone)}`}>
                        {block.items.map((item, itemIndex) => (
                          <li key={`ol-${index}-${itemIndex}`}>{item}</li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <ul key={`list-${index}`} className={`list-disc space-y-1 pl-6 ${listToneClass(block.tone)}`}>
                      {block.items.map((item, itemIndex) => (
                        <li key={`ul-${index}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={`quote-${index}`}
                      className={`rounded-xl border-l-4 px-4 py-3 text-sm leading-7 italic ${quoteToneClass(block.tone)}`}
                    >
                      {block.text}
                    </blockquote>
                  );
                }

                if (block.type === "cta") {
                  return (
                    <div key={`cta-${index}`} className="rounded-lg border border-[var(--line)] bg-white px-4 py-4">
                      <a
                        href={block.href}
                        className="inline-flex rounded-lg bg-[var(--brand-green)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
                      >
                        {block.label}
                      </a>
                    </div>
                  );
                }

                if (block.type === "image") {
                  return (
                    <figure key={`image-${index}`} className="overflow-hidden rounded-lg border border-[var(--line)] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.src} alt={block.alt} className="h-auto w-full object-cover" loading="lazy" />
                      <figcaption className="space-y-1 px-4 py-3 text-xs text-[var(--ink-600)]">
                        <p className="font-semibold">{block.alt}</p>
                        {block.caption ? <p>{block.caption}</p> : null}
                      </figcaption>
                    </figure>
                  );
                }

                return (
                  <p key={`paragraph-${index}`} className={paragraphToneClass(block.tone)}>
                    {block.text}
                  </p>
                );
              })}
            </div>
          </article>

          <aside className="space-y-4">
            {tableOfContents.length > 0 ? (
              <section className="luxury-card p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-strong)]">{copy.contents}</p>
                <nav className="mt-3 space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm text-[var(--ink-700)] hover:underline ${item.level >= 4 ? "pl-3" : item.level === 3 ? "pl-2" : ""}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </section>
            ) : null}

            <section className="luxury-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-strong)]">{copy.tags}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-[var(--line)] bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-accent-strong)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="luxury-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-strong)]">{copy.related}</p>
              <div className="mt-3 space-y-3">
                {relatedPosts.map((item) => (
                  <article key={item.id} className="rounded-lg border border-[var(--line)] bg-white p-3">
                    <h2 className="text-sm font-semibold text-[var(--brand-primary)]">{item.title}</h2>
                    <Link href={`/blog/${item.slug}`} className="mt-1 inline-block text-xs font-semibold underline">
                      {copy.read}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <SiteFooter />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>
    </div>
  );
}
