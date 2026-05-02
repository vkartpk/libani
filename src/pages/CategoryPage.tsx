import { useParams } from "react-router-dom";
import Products from "./Products";
import { getCategory } from "@/data/categories";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const cat = getCategory(slug);
  return <Products title={cat?.name ?? "Category"} preset={{ category: slug }} />;
}