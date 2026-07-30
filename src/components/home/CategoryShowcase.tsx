import { Link } from "react-router-dom";
import { categories, gamingCategories } from "@/data/categories";
import imgRouter from "@/assets/products/router-archer.jpg";
import imgTws from "@/assets/products/tws-earbuds.jpg";
import imgHeadphones from "@/assets/products/gaming-headset.jpg";
import imgWatch from "@/assets/products/smart-watch.jpg";
import imgPowerBank from "@/assets/products/power-bank.jpg";
import imgMouse from "@/assets/products/gaming-mouse-2.jpg";
import imgKeyboard from "@/assets/products/mech-keyboard.jpg";
import imgCamera from "@/assets/products/security-camera.jpg";
import imgTvBox from "@/assets/products/tv-box.jpg";
import imgGamingMouse from "@/assets/products/gaming-mouse.jpg";

const categoryImages: Record<string, string> = {
  routers: imgRouter,
  tws: imgTws,
  headphones: imgHeadphones,
  "smart-watches": imgWatch,
  "power-banks": imgPowerBank,
  mouse: imgMouse,
  keyboard: imgKeyboard,
  "security-cameras": imgCamera,
  "android-tv-box": imgTvBox,
  "gaming-mouse": imgGamingMouse,
};

const showcase = [
  ...categories.filter((c) => ["routers","tws","headphones","smart-watches","power-banks","mouse","keyboard","security-cameras","android-tv-box"].includes(c.slug)),
  gamingCategories.find((c) => c.slug === "gaming-mouse")!,
];

export function CategoryShowcase() {
  return (
    <section className="container-x mt-14">
      <h2 className="section-title">Shop by Category</h2>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {showcase.map((c) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            className="group overflow-hidden rounded-lg bg-card border border-border hover:border-primary transition"
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={categoryImages[c.slug]}
                alt={`${c.name} category`}
                loading="lazy"
                width={800}
                height={800}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3 text-center text-xs font-medium">{c.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}