import Products from "./Products";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  return <Products title={`Search: "${q}"`} description={`Results for "${q}"`} />;
}