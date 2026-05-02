import type { Brand } from "./types";

const img = (seed: string, w = 200, h = 100) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const brands: Brand[] = [
  ["tp-link", "TP-Link", "Global leader in networking and smart home tech."],
  ["tenda", "Tenda", "Affordable wireless networking solutions."],
  ["mt-link", "MT-Link", "Reliable routers and connectivity hardware."],
  ["a4tech", "A4Tech", "Computer peripherals trusted for decades."],
  ["bloody", "Bloody", "Pro gaming peripherals built for esports."],
  ["hyperx", "HyperX", "Premium gaming headsets, keyboards, and gear."],
  ["t-dagger", "T-Dagger", "Gaming peripherals with bold RGB style."],
  ["redragon", "Redragon", "Affordable gaming gear for every setup."],
  ["ronin", "Ronin", "Stylish audio and tech accessories."],
  ["havit", "Havit", "Speakers, headphones, and lifestyle tech."],
  ["logitech", "Logitech", "World-class peripherals and productivity gear."],
  ["space", "Space", "Modern audio products built for clarity."],
  ["baseus", "Baseus", "Innovative charging and mobile accessories."],
  ["anker", "Anker", "Reliable power banks, cables, and chargers."],
  ["lenovo", "Lenovo", "Trusted electronics from a global tech leader."],
  ["xiaomi", "Xiaomi", "Smart everyday tech at honest prices."],
  ["doomax", "Doomax", "Audio and lifestyle electronics."],
  ["joyroom", "Joyroom", "Premium audio and charging solutions."],
  ["amaze", "Amaze", "Quality accessories for work and play."],
  ["ldnio", "LDNIO", "Power, charging, and surge protection experts."],
  ["wiwu", "WiWU", "Modern accessories for laptops and tablets."],
  ["compro", "Compro", "Productivity essentials for your workspace."],
].map(([slug, name, description]) => ({
  id: slug,
  slug,
  name,
  description,
  logo: img(`logo-${slug}`, 200, 100),
  bannerImage: img(`banner-${slug}`, 1600, 500),
}));

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);