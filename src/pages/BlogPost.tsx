import { Navigate, useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPost, blogPosts } from "@/data/blogPosts";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPost(slug);
  if (!post) return <Navigate to="/404" replace />;
  const html = DOMPurify.sanitize(post.content);
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: post.title, datePublished: post.date, author: { "@type": "Person", name: post.author }, image: post.coverImage };
  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);
  return (
    <>
      <SEO title={post.metaTitle} description={post.metaDescription} type="article" image={post.coverImage} jsonLd={ld} />
      <div className="container-x py-6 max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.title }]} />
        <article className="mt-6">
          <span className="text-xs uppercase tracking-wider text-primary font-bold">{post.category}</span>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{post.author} · {post.date}</p>
          <img src={post.coverImage} alt={post.title} className="mt-6 w-full rounded-lg aspect-video object-cover" />
          <div className="prose prose-invert prose-sm md:prose-base max-w-none mt-8" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <section className="mt-12">
          <h2 className="section-title">Related Posts</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="bg-card border border-border rounded-lg overflow-hidden lift-hover">
                <img src={p.coverImage} alt={p.title} className="w-full aspect-video object-cover" />
                <div className="p-3"><p className="text-xs text-primary uppercase tracking-wider">{p.category}</p><p className="mt-1 font-display font-bold text-sm leading-tight">{p.title}</p></div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}