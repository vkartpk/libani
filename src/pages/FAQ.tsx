import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const groups = [
  { title: "Orders & Shipping", items: [
    ["How long does delivery take?", "We deliver within 2-3 working days across Pakistan."],
    ["Do you offer free shipping?", "Yes — free shipping on orders above Rs.1000."],
    ["Can I track my order?", "Yes, use our Track Order page with your order number."],
    ["Do you deliver outside Pakistan?", "Currently we serve Pakistan only."],
  ]},
  { title: "Products", items: [
    ["Are your products authentic?", "100% — we source directly from authorised distributors."],
    ["Do products come with warranty?", "Yes, every product ships with brand warranty."],
    ["How do I choose a variant?", "Variants are shown on each product page; ask us if unsure."],
  ]},
  { title: "Returns & Refunds", items: [
    ["What is your return policy?", "We offer 7-day easy returns on all items."],
    ["How do I initiate a return?", "Contact our support team via WhatsApp or email."],
    ["When will I get my refund?", "Refunds are processed within 3-5 business days."],
  ]},
  { title: "Payments", items: [
    ["What payments do you accept?", "Cash on Delivery, Bank Transfer, JazzCash and EasyPaisa."],
    ["Is online payment safe?", "Yes, all transactions are securely processed."],
    ["Can I pay COD?", "Absolutely — COD is available across Pakistan."],
  ]},
];

export default function FAQ() {
  const ld = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))),
  };
  return (
    <>
      <SEO title="FAQ | TechZone" jsonLd={ld} />
      <div className="container-x py-6 max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4">Frequently Asked Questions</h1>
        <div className="mt-6 space-y-8">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="font-display font-bold text-lg mb-2 text-primary">{g.title}</h2>
              <Accordion type="single" collapsible className="bg-card border border-border rounded-lg px-4">
                {g.items.map(([q, a], i) => (
                  <AccordionItem key={i} value={`${g.title}-${i}`}>
                    <AccordionTrigger className="text-sm">{q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}