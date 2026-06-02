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
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminBrands = lazy(() => import("./pages/admin/Brands"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminSeo = lazy(() => import("./pages/admin/Seo"));
const AdminFinance = lazy(() => import("./pages/admin/Finance"));

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
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/categories" element={<AdminCategories />} />
                        <Route path="/admin/brands" element={<AdminBrands />} />
                        <Route path="/admin/customers" element={<AdminCustomers />} />
                        <Route path="/admin/seo" element={<AdminSeo />} />
                        <Route path="/admin/finance" element={<AdminFinance />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </Layout>
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
