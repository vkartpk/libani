import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <>
    <SEO title="404 — Page Not Found | libani" />
    <div className="container-x py-20 text-center">
      <p className="font-display text-7xl md:text-9xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or was moved.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground"><Link to="/">Back to Home</Link></Button>
        <Button asChild variant="outline"><Link to="/products">Browse products</Link></Button>
      </div>
    </div>
  </>
);

export default NotFound;
