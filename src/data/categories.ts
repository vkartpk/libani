import {
  Wifi, Headphones, Mouse, Keyboard, Speaker, Webcam, Mic, HardDrive,
  Printer, Cable, Battery, Watch, Camera, Tv, Pencil, Gamepad2, Laptop,
  Plug, Usb, Zap, Car, Briefcase, Headset, Disc, Monitor, Fan, Box,
} from "lucide-react";

export type CategoryNode = {
  slug: string;
  name: string;
  icon: typeof Wifi;
  group?: string;
};

export const categories: CategoryNode[] = [
  { slug: "routers", name: "Routers", icon: Wifi, group: "main" },
  { slug: "tws", name: "Wireless Earbuds (TWS)", icon: Headphones, group: "main" },
  { slug: "headphones", name: "Headphones", icon: Headphones, group: "main" },
  { slug: "earphones", name: "Earphones & Neckbands", icon: Headset, group: "main" },
  { slug: "smart-watches", name: "Smart Watches", icon: Watch, group: "main" },
  { slug: "power-banks", name: "Power Banks", icon: Battery, group: "main" },
  { slug: "security-cameras", name: "Security Cameras", icon: Camera, group: "main" },
  { slug: "android-tv-box", name: "Android TV Box", icon: Tv, group: "main" },
  { slug: "graphic-tablets", name: "Graphic Tablets", icon: Pencil, group: "main" },
  { slug: "speakers", name: "Speakers", icon: Speaker, group: "peripherals" },
  { slug: "mouse", name: "Mouse", icon: Mouse, group: "peripherals" },
  { slug: "keyboard", name: "Keyboard", icon: Keyboard, group: "peripherals" },
  { slug: "accessories", name: "Accessories", icon: Box, group: "peripherals" },
  { slug: "printers", name: "Printers & Scanners", icon: Printer, group: "peripherals" },
  { slug: "storage", name: "Storage Drives", icon: HardDrive, group: "peripherals" },
  { slug: "microphone", name: "Microphone", icon: Mic, group: "peripherals" },
  { slug: "webcam", name: "Webcam", icon: Webcam, group: "peripherals" },
  { slug: "laptop-stands", name: "Laptop Stands", icon: Laptop, group: "extra" },
  { slug: "usb-hubs", name: "USB Hubs & Adapters", icon: Usb, group: "extra" },
  { slug: "power-extensions", name: "Power Extensions", icon: Plug, group: "extra" },
  { slug: "charging-cables", name: "Charging Cables", icon: Cable, group: "extra" },
  { slug: "car-chargers", name: "Car Chargers & Mounts", icon: Car, group: "extra" },
  { slug: "bags", name: "Bags & Sleeves", icon: Briefcase, group: "extra" },
];

export const gamingCategories: CategoryNode[] = [
  { slug: "gamepads", name: "Gamepads", icon: Gamepad2 },
  { slug: "gaming-mouse", name: "Gaming Mouse", icon: Mouse },
  { slug: "gaming-keyboard", name: "Gaming Keyboard", icon: Keyboard },
  { slug: "gaming-headphones", name: "Gaming Headphones", icon: Headphones },
  { slug: "gaming-chair", name: "Gaming Chair", icon: Box },
  { slug: "gaming-mousepad", name: "Gaming Mousepad", icon: Disc },
  { slug: "cooling-fan", name: "Cooling Fan", icon: Fan },
  { slug: "gaming-case", name: "Gaming Case", icon: Box },
  { slug: "gaming-display", name: "Gaming Display", icon: Monitor },
  { slug: "gaming-combo", name: "Gaming Combo", icon: Zap },
];

export const allCategories = [...categories, ...gamingCategories];
export const getCategory = (slug: string) => allCategories.find((c) => c.slug === slug);