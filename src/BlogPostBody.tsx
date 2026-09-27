import { ReactNode } from "react";

const A = ({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) => <a href={href} className={className}>{children}</a>;

export type Post = {
  slug: string; title: string; excerpt: string; content: string;
  featured_image: string; category: string; author: string; reading_time: string;
  status: string; published_at?: string; image_alt?: string;
};

export function BlogPostBody({ p, showShare = true }: { p: Post; showShare?: boolean }) {
  const date = p.published_at ? new Date(p.published_at) : null;
  const dateLabel = date ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <article className="article">
      <div className="wrap articlehead">
        <small>{p.category}　·　{dateLabel}　·　{p.reading_time} read</small>
        <h1>{p.title}</h1>
        <p>{p.excerpt}</p>
      </div>
      {p.featured_image && <img className="cover" src={p.featured_image} alt={p.image_alt || p.title} onError={(e:any)=>{e.currentTarget.style.display="none"}} />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: p.content }} />
      {showShare && (
        <div className="wrap">
          <div className="share">Share: <A href={`https://x.com/intent/tweet?text=${encodeURIComponent(p.title)}`}>X</A> · <A href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href)}`}>LinkedIn</A></div>
        </div>
      )}
    </article>
  );
}
