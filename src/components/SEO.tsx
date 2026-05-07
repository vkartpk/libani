import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "product" | "article";
  canonical?: string;
  jsonLd?: object | object[];
  faq?: { q: string; a: string }[];
};

export function SEO({ title, description, image, type = "website", canonical, jsonLd, faq }: Props) {
  const url = canonical ?? (typeof window !== "undefined" ? window.location.href : "");
  const ogImage = image ?? "https://lovable.dev/opengraph-image-p98pqg.png";
  const ldArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  if (faq && faq.length) {
    ldArray.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
}