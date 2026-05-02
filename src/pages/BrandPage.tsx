import { useParams } from "react-router-dom";
import Products from "./Products";
import { getBrand } from "@/data/brands";

export default function BrandPage() {
  const { slug = "" } = useParams();
  const brand = getBrand(slug);
  return <Products title={brand ? `${brand.name} Collection` : "Brand"} preset={{ brand: slug }} description={brand?.description} />;
}