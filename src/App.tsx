import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { Layout } from "@/components/layout/Layout";
import { ShimmerGrid } from "@/components/ShimmerCard";
import { ProductsHydrator } from "@/components/ProductsHydrator";
import { ThemeApplier } from "@/components/ThemeApplier";
import { MaintenanceGate } from "@/components/MaintenanceGate";

import Index from "./pages/Index.tsx";
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Policy = lazy(() => import("./pages/Policy"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Compare = lazy(() => import("./pages/Compare"));
const AccountOverview = lazy(() => import("./pages/account/Overview"));
const AccountOrders = lazy(() => import("./pages/account/Orders"));
const AccountAddresses = lazy(() => import("./pages/account/Addresses"));
const AccountProfile = lazy(() => import("./pages/account/Profile"));
const AccountSecurity = lazy(() => import("./pages/account/Security"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/libani/Dashboard"));
const AdminOrders = lazy(() => import("./pages/libani/Orders"));
const AdminProducts = lazy(() => import("./pages/libani/Products"));
const AdminCategories = lazy(() => import("./pages/libani/Categories"));
const AdminBrands = lazy(() => import("./pages/libani/Brands"));
const AdminCustomers = lazy(() => import("./pages/libani/Customers"));
const AdminSeo = lazy(() => import("./pages/libani/Seo"));
const AdminPages = lazy(() => import("./pages/libani/Pages"));
const AdminBanners = lazy(() => import("./pages/libani/Banners"));
const AdminFinance = lazy(() => import("./pages/libani/Finance"));
const AdminPayments = lazy(() => import("./pages/libani/Payments"));
const AdminImageOptimizer = lazy(() => import("./pages/libani/ImageOptimizer"));
const AdminSettings = lazy(() => import("./pages/libani/Settings"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                <CompareProvider>
                  <ProductsHydrator>
                  <ThemeApplier />
                  <MaintenanceGate>
                  <Layout>
                    <Suspense fallback={<div className="container-x py-8"><ShimmerGrid /></div>}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:slug" element={<ProductDetail />} />
                        <Route path="/category/:slug" element={<CategoryPage />} />
                        <Route path="/brand/:slug" element={<BrandPage />} />
                        <Route path="/gaming/:slug" element={<CategoryPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/compare" element={<Compare />} />
                        <Route path="/track-order" element={<TrackOrder />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/policies/:slug" element={<Policy />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/account" element={<AccountOverview />} />
                        <Route path="/account/orders" element={<AccountOrders />} />
                        <Route path="/account/addresses" element={<AccountAddresses />} />
                        <Route path="/account/profile" element={<AccountProfile />} />
                        <Route path="/account/security" element={<AccountSecurity />} />
                        <Route path="/libani" element={<AdminDashboard />} />
                        <Route path="/libani/orders" element={<AdminOrders />} />
                        <Route path="/libani/products" element={<AdminProducts />} />
                        <Route path="/libani/categories" element={<AdminCategories />} />
                        <Route path="/libani/brands" element={<AdminBrands />} />
                        <Route path="/libani/customers" element={<AdminCustomers />} />
                        <Route path="/libani/pages" element={<AdminPages />} />
                        <Route path="/libani/banners" element={<AdminBanners />} />
                        <Route path="/libani/seo" element={<AdminSeo />} />
                        <Route path="/libani/finance" element={<AdminFinance />} />
                        <Route path="/libani/payments" element={<AdminPayments />} />
                        <Route path="/libani/image-optimizer" element={<AdminImageOptimizer />} />
                        <Route path="/libani/settings" element={<AdminSettings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                  </MaintenanceGate>
                  </ProductsHydrator>
                </CompareProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
