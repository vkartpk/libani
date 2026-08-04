import type { BlogPost } from "./types";
import blogEarbuds from "@/assets/blog-earbuds.jpg";
import blogRouter from "@/assets/blog-router.jpg";
import blogKeyboards from "@/assets/blog-keyboards.jpg";
import blogPowerbank from "@/assets/blog-powerbank.jpg";
import blogMesh from "@/assets/blog-mesh.jpg";
import blogGaming from "@/assets/blog-gaming.jpg";

const covers: Record<string, string> = {
  b1: blogEarbuds,
  b2: blogRouter,
  b3: blogKeyboards,
  b4: blogPowerbank,
  b5: blogMesh,
  b6: blogGaming,
};

const longContent = (title: string) => `
<h2>Why this matters</h2>
<p>${title} is one of the most asked-about topics by our customers. In this guide we'll walk through everything you need to know — from buying considerations to long-term care.</p>
<h2>What to look for</h2>
<p>The right product comes down to three things: build quality, warranty, and after-sales support. We always recommend buying from authorised resellers like libani to make sure you get the genuine article.</p>
<h3>Build quality</h3>
<p>Look for materials and finish — premium brands invest in durability that pays off over years.</p>
<h3>Warranty</h3>
<p>A solid warranty is your safety net. Every product on libani ships with brand warranty.</p>
<h2>Our top picks</h2>
<p>Browse our curated collection to see staff favourites — tested in real-world conditions before being added to the lineup.</p>
<h2>Final thoughts</h2>
<p>Choosing tech doesn't have to be complicated. Stick with trusted brands, reliable retailers, and you'll always come out ahead.</p>
`;

export const blogPosts: BlogPost[] = [
  { id: "b1", slug: "best-wireless-earbuds-pakistan-2025", title: "Best Wireless Earbuds You Can Buy in Pakistan (2025)", category: "Reviews", author: "Hamza Ali", date: "2025-09-12", tags: ["earbuds","tws","reviews"] },
  { id: "b2", slug: "how-to-choose-the-right-router", title: "How to Choose the Right Wi-Fi Router for Your Home", category: "Guides", author: "Sana Khan", date: "2025-08-28", tags: ["routers","networking","guide"] },
  { id: "b3", slug: "mechanical-vs-membrane-keyboards", title: "Mechanical vs Membrane Keyboards — Which Should You Pick?", category: "Guides", author: "Bilal Raza", date: "2025-08-04", tags: ["keyboards","gaming"] },
  { id: "b4", slug: "power-bank-buying-guide", title: "Power Bank Buying Guide: mAh, Watts, and What Actually Matters", category: "Tips", author: "Hamza Ali", date: "2025-07-19", tags: ["power-banks","charging"] },
  { id: "b5", slug: "tp-link-deco-mesh-review", title: "TP-Link Deco M4 Mesh System — In-Depth Review", category: "Reviews", author: "Sana Khan", date: "2025-06-30", tags: ["tp-link","mesh","networking"] },
  { id: "b6", slug: "techzone-launches-gaming-collection", title: "libani Launches All-New Gaming Collection", category: "News", author: "libani Team", date: "2025-06-10", tags: ["gaming","news"] },
].map((b) => ({
  ...b,
  excerpt: `Everything you need to know about ${b.title.toLowerCase()} — practical advice from our team.`,
  content: longContent(b.title),
  coverImage: covers[b.id] ?? blogGaming,
  metaTitle: `${b.title} | libani Blog`,
  metaDescription: `Read about ${b.title.toLowerCase()} on the libani blog — guides, reviews and news from Pakistan's premier tech accessories store.`,
})) as BlogPost[];

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);