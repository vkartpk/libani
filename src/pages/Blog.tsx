import { Link } from "react-router-dom";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { blogPosts } from "@/data/blogPosts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Blog() {
  const [cat, setCat] = useState("All");
  const cats = ["All","Reviews","Guides","News","Tips"];
  const items = cat === "All" ? blogPosts : blogPosts.filter((p) => p.category === cat);
  return (
    <>
      <SEO title="Blog | TechZone" description="Reviews, guides, news and tips from the TechZone team." />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4">From the Blog</h1>
        <Tabs value={cat} onValueChange={setCat} className="mt-4">
          <TabsList className="bg-card">{cats.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}</TabsList>
        </Tabs>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-card border border-border rounded-lg overflow-hidden lift-hover">
              <img src={p.coverImage} alt={p.title} className="w-full aspect-video object-cover" loading="lazy" />
              <div className="p-4">
                <span className="text-xs uppercase tracking-wider text-primary font-bold">{p.category}</span>
                <h2 className="mt-2 font-display font-bold leading-tight group-hover:text-primary transition-colors">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                <p className="mt-3 text-xs text-muted-foreground">{p.author} · {p.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}