import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { getLanguageFromPath } from "@/lib/urlUtils";
import { initGA } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { useDynamicSEO } from "@/hooks/useDynamicSEO";
import Footer from "@/components/Footer";


// Core pages (loaded immediately)
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazy loaded pages
const Test = lazy(() => import("@/pages/test"));
const Results = lazy(() => import("@/pages/results"));
const PremiumResults = lazy(() => import("@/pages/premium-results"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const SignIn = lazy(() => import("@/pages/signin"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const Checkout = lazy(() => import("@/pages/checkout"));
const UpsellSimple = lazy(() => import("@/pages/upsell-simple"));
const UpsellTest = lazy(() => import("@/pages/upsell-test"));
const About = lazy(() => import("@/pages/about"));
const WhatIsIkigai = lazy(() => import("@/pages/what-is-ikigai"));
const PersonalityTypes = lazy(() => import("@/pages/personality-types"));
const TypeTest = lazy(() => import("@/pages/type-test"));
const IkigaiTest = lazy(() => import("@/pages/ikigai-test"));
const TestAccessControl = lazy(() => import("@/pages/test-access-control"));
const TestSimple = lazy(() => import("@/pages/test-simple"));
const BuilderType = lazy(() => import("@/pages/ikigai-types/builder"));
const ExplorerType = lazy(() => import("@/pages/ikigai-types/explorer"));
const DreamerType = lazy(() => import("@/pages/ikigai-types/dreamer"));
const AchieverType = lazy(() => import("@/pages/ikigai-types/achiever"));
const HelperType = lazy(() => import("@/pages/ikigai-types/helper"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogSimple = lazy(() => import("@/pages/blog-simple"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const BlogPostEnhanced = lazy(() => import("@/pages/blog-post-enhanced"));
const AdminBlogEnhanced = lazy(() => import("@/pages/admin-blog-enhanced"));
const BlogImport = lazy(() => import("@/pages/blog-import"));
const LoginTest = lazy(() => import("@/pages/login-test"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Shop = lazy(() => import("@/pages/shop"));
const ShopCheckout = lazy(() => import("@/pages/shop-checkout"));
const ShopSuccess = lazy(() => import("@/pages/shop-success"));
const AdminShop = lazy(() => import("@/pages/admin-shop"));
const AdminEmails = lazy(() => import("@/pages/admin-emails"));
const CheckoutAnalytics = lazy(() => import("@/pages/checkout-analytics"));
const EmailCollection = lazy(() => import("@/pages/email-collection"));
const DevAdminLogin = lazy(() => import("@/pages/dev-admin-login"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  const { i18n } = useTranslation();

  // Track page views when routes change
  useAnalytics();

  // Scroll to top on route changes for better user experience
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Update language based on URL path and preload translations
  useEffect(() => {
    const detectedLanguage = getLanguageFromPath(location);
    if (detectedLanguage !== i18n.language) {
      i18n.changeLanguage(detectedLanguage).then(() => {
        // Ensure all required namespaces are loaded for the new language
        if (detectedLanguage === 'fr') {
          i18n.loadNamespaces(['common', 'navigation', 'landing'], () => {
            console.log('French namespaces loaded');
          });
        }
      });
    }
  }, [location, i18n]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Landing} />
      <Route path="/test" component={Test} />
      <Route path="/full-ikigai-test" component={Test} />
      <Route path="/ikigai-type-test" component={TypeTest} />
      <Route path="/email-collection/:sessionId">
        {(params) => <EmailCollection sessionId={params.sessionId} />}
      </Route>
      <Route path="/results/:sessionId" component={Results} />
      <Route path="/test-results/:sessionId" component={Results} />
      <Route path="/premium-results/:sessionId" component={PremiumResults} />
      <Route path="/premium-test-results/:sessionId" component={PremiumResults} />
      <Route path="/es/results/:sessionId" component={Results} />
      <Route path="/es/test-results/:sessionId" component={Results} />
      <Route path="/es/premium-results/:sessionId" component={PremiumResults} />
      <Route path="/es/premium-test-results/:sessionId" component={PremiumResults} />
      <Route path="/es" component={isAuthenticated ? Home : Landing} />
      <Route path="/es/home" component={isAuthenticated ? Home : Landing} />
      <Route path="/es/test" component={Test} />
      <Route path="/es/full-ikigai-test" component={Test} />
      <Route path="/es/ikigai-type-test" component={TypeTest} />
      <Route path="/es/email-collection/:sessionId">
        {(params) => <EmailCollection sessionId={params.sessionId} />}
      </Route>
      <Route path="/es/dashboard" component={Dashboard} />
      <Route path="/es/admin" component={AdminDashboard} />
      <Route path="/es/admin/emails" component={AdminEmails} />
      <Route path="/es/admin/blog-enhanced" component={AdminBlogEnhanced} />
      <Route path="/es/admin/shop" component={AdminShop} />
      <Route path="/es/admin/blog-import" component={BlogImport} />
      <Route path="/es/upsell" component={UpsellSimple} />
      <Route path="/es/upgrade" component={UpsellSimple} />
      <Route path="/es/premium-features" component={UpsellSimple} />
      <Route path="/es/upsell-simple" component={UpsellSimple} />
      <Route path="/es/upsell-test" component={UpsellTest} />
      <Route path="/es/upsell/success" component={lazy(() => import("./pages/upsell-success"))} />
      <Route path="/es/checkout" component={Checkout} />
      <Route path="/es/about" component={About} />
      <Route path="/es/what-is-ikigai" component={WhatIsIkigai} />
      <Route path="/es/ikigai-personality-types" component={PersonalityTypes} />
      <Route path="/es/ikigai-test" component={IkigaiTest} />
      <Route path="/es/test-access" component={TestAccessControl} />
      <Route path="/es/test-simple" component={TestSimple} />
      <Route path="/es/ikigai-types/builder" component={BuilderType} />
      <Route path="/es/ikigai-types/explorer" component={ExplorerType} />
      <Route path="/es/ikigai-types/dreamer" component={DreamerType} />
      <Route path="/es/ikigai-types/achiever" component={AchieverType} />
      <Route path="/es/ikigai-types/helper" component={HelperType} />
      <Route path="/es/ikigai-types/creative-enthusiast" component={lazy(() => import('./pages/ikigai-types/creative-enthusiast'))} />
      <Route path="/es/ikigai-types/skilled-expert" component={lazy(() => import('./pages/ikigai-types/skilled-expert'))} />
      <Route path="/es/ikigai-types/purpose-driven-leader" component={lazy(() => import('./pages/ikigai-types/purpose-driven-leader'))} />
      <Route path="/es/ikigai-types/career-focused-achiever" component={lazy(() => import('./pages/ikigai-types/career-focused-achiever'))} />
      <Route path="/es/blog" component={BlogSimple} />
      <Route path="/es/blog-old" component={Blog} />
      <Route path="/es/blog/:slug" component={BlogPostEnhanced} />
      <Route path="/es/blog-old/:slug" component={BlogPost} />
      {/* All ES admin routes removed for security - server-side only */}
      <Route path="/es/login" component={Login} />
      <Route path="/es/register" component={Register} />
      <Route path="/es/login-test" component={LoginTest} />
      <Route path="/es/privacy" component={Privacy} />
      <Route path="/es/terms" component={Terms} />
      
      {/* French Language Routes */}
      <Route path="/fr/results/:sessionId" component={Results} />
      <Route path="/fr/test-results/:sessionId" component={Results} />
      <Route path="/fr/premium-results/:sessionId" component={PremiumResults} />
      <Route path="/fr/premium-test-results/:sessionId" component={PremiumResults} />
      <Route path="/fr" component={isAuthenticated ? Home : Landing} />
      <Route path="/fr/home" component={isAuthenticated ? Home : Landing} />
      <Route path="/fr/test" component={Test} />
      <Route path="/fr/full-ikigai-test" component={Test} />
      <Route path="/fr/ikigai-type-test" component={TypeTest} />
      <Route path="/fr/email-collection/:sessionId">
        {(params) => <EmailCollection sessionId={params.sessionId} />}
      </Route>
      <Route path="/fr/dashboard" component={Dashboard} />
      <Route path="/fr/admin" component={AdminDashboard} />
      <Route path="/fr/admin/emails" component={AdminEmails} />
      <Route path="/fr/admin/blog-enhanced" component={AdminBlogEnhanced} />
      <Route path="/fr/admin/shop" component={AdminShop} />
      <Route path="/fr/admin/blog-import" component={BlogImport} />
      <Route path="/fr/upsell" component={UpsellSimple} />
      <Route path="/fr/upgrade" component={UpsellSimple} />
      <Route path="/fr/premium-features" component={UpsellSimple} />
      <Route path="/fr/upsell-simple" component={UpsellSimple} />
      <Route path="/fr/upsell-test" component={UpsellTest} />
      <Route path="/fr/upsell/success" component={lazy(() => import("./pages/upsell-success"))} />
      <Route path="/fr/checkout" component={Checkout} />
      <Route path="/fr/about" component={About} />
      <Route path="/fr/what-is-ikigai" component={WhatIsIkigai} />
      <Route path="/fr/ikigai-personality-types" component={PersonalityTypes} />
      <Route path="/fr/ikigai-test" component={IkigaiTest} />
      <Route path="/fr/test-access" component={TestAccessControl} />
      <Route path="/fr/test-simple" component={TestSimple} />
      <Route path="/fr/ikigai-types/builder" component={BuilderType} />
      <Route path="/fr/ikigai-types/explorer" component={ExplorerType} />
      <Route path="/fr/ikigai-types/dreamer" component={DreamerType} />
      <Route path="/fr/ikigai-types/achiever" component={AchieverType} />
      <Route path="/fr/ikigai-types/helper" component={HelperType} />
      <Route path="/fr/ikigai-types/creative-enthusiast" component={lazy(() => import('./pages/ikigai-types/creative-enthusiast'))} />
      <Route path="/fr/ikigai-types/skilled-expert" component={lazy(() => import('./pages/ikigai-types/skilled-expert'))} />
      <Route path="/fr/ikigai-types/purpose-driven-leader" component={lazy(() => import('./pages/ikigai-types/purpose-driven-leader'))} />
      <Route path="/fr/ikigai-types/career-focused-achiever" component={lazy(() => import('./pages/ikigai-types/career-focused-achiever'))} />
      <Route path="/fr/blog" component={BlogSimple} />
      <Route path="/fr/blog-old" component={Blog} />
      <Route path="/fr/blog/:slug" component={BlogPostEnhanced} />
      <Route path="/fr/blog-old/:slug" component={BlogPost} />
      <Route path="/fr/login" component={Login} />
      <Route path="/fr/register" component={Register} />
      <Route path="/fr/login-test" component={LoginTest} />
      <Route path="/fr/privacy" component={Privacy} />
      <Route path="/fr/terms" component={Terms} />
      <Route path="/signin" component={SignIn} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      {/* Admin routes - accessible only after server-side authentication */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/emails" component={AdminEmails} />
      <Route path="/admin/blog-enhanced" component={AdminBlogEnhanced} />
      <Route path="/admin/checkout-analytics" component={CheckoutAnalytics} />
      <Route path="/admin/shop" component={AdminShop} />
      <Route path="/admin/blog-import" component={BlogImport} />
      <Route path="/upsell" component={UpsellSimple} />
      <Route path="/upgrade" component={UpsellSimple} />
      <Route path="/premium-features" component={UpsellSimple} />
      <Route path="/upsell-simple" component={UpsellSimple} />
      <Route path="/upsell-test" component={UpsellTest} />
      <Route path="/upsell/success" component={lazy(() => import("./pages/upsell-success"))} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/about" component={About} />
      <Route path="/what-is-ikigai" component={WhatIsIkigai} />
      <Route path="/ikigai-personality-types" component={PersonalityTypes} />
      <Route path="/ikigai-test" component={IkigaiTest} />
      <Route path="/test-access" component={TestAccessControl} />
      <Route path="/test-simple" component={TestSimple} />
      <Route path="/ikigai-types/builder" component={BuilderType} />
      <Route path="/ikigai-types/explorer" component={ExplorerType} />
      <Route path="/ikigai-types/dreamer" component={DreamerType} />
      <Route path="/ikigai-types/achiever" component={AchieverType} />
      <Route path="/ikigai-types/helper" component={HelperType} />
      <Route path="/ikigai-types/creative-enthusiast" component={lazy(() => import('./pages/ikigai-types/creative-enthusiast'))} />
      <Route path="/ikigai-types/skilled-expert" component={lazy(() => import('./pages/ikigai-types/skilled-expert'))} />
      <Route path="/ikigai-types/purpose-driven-leader" component={lazy(() => import('./pages/ikigai-types/purpose-driven-leader'))} />
      <Route path="/ikigai-types/career-focused-achiever" component={lazy(() => import('./pages/ikigai-types/career-focused-achiever'))} />
      <Route path="/blog" component={BlogSimple} />
      <Route path="/blog-old" component={Blog} />
      <Route path="/ga-test" component={lazy(() => import('./pages/ga-test'))} />
      <Route path="/ga-production-test" component={lazy(() => import('./pages/ga-production-test'))} />
      <Route path="/blog/:slug" component={BlogPostEnhanced} />
      <Route path="/blog-old/:slug" component={BlogPost} />
      {/* All admin routes removed for security - server-side only */}

      {/* Admin routes removed for security - only server-side access allowed */}
      <Route path="/admin/checkout-analytics" component={CheckoutAnalytics} />
      <Route path="/login-test" component={LoginTest} />
      <Route path="/dev-admin-login" component={DevAdminLogin} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/checkout" component={lazy(() => import('./pages/shop-checkout'))} />
      <Route path="/shop/success" component={lazy(() => import('./pages/shop-success'))} />
      <Route path="/positive-words" component={lazy(() => import('./pages/positive-words'))} />
      <Route path="/ikigai-word-wheel" component={lazy(() => import('./pages/positive-words'))} />
      <Route path="/positive-words/:letter" component={lazy(() => import('./pages/positive-words/letter'))} />
      <Route path="/positive-words-that-start-with-a" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-b" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-c" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-d" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-e" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-f" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-g" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-h" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-i" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-j" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-k" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-l" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-m" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-n" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-o" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-p" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-q" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-r" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-s" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-t" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-u" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-v" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-w" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-x" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-y" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-z" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/positive-words-that-start-with-*" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/es/shop" component={Shop} />
      <Route path="/es/shop/checkout" component={ShopCheckout} />
      <Route path="/es/shop/success" component={ShopSuccess} />
      <Route path="/es/positive-words" component={lazy(() => import('./pages/positive-words'))} />
      <Route path="/es/ikigai-word-wheel" component={lazy(() => import('./pages/positive-words'))} />
      <Route path="/es/positive-words/:letter" component={lazy(() => import('./pages/positive-words/letter'))} />
      <Route path="/es/positive-words-that-start-with-a" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-b" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-c" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-d" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-e" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-f" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-g" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-h" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-i" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-j" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-k" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-l" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-m" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-n" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-o" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-p" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-q" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-r" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-s" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-t" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-u" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-v" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-w" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-x" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-y" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-z" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/positive-words-that-start-with-*" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/es/login-test" component={LoginTest} />
      <Route path="/es/dev-admin-login" component={DevAdminLogin} />
      <Route path="/es/privacy" component={Privacy} />
      <Route path="/es/terms" component={Terms} />
      
      {/* French Shop Routes */}
      <Route path="/fr/shop" component={Shop} />
      <Route path="/fr/shop/checkout" component={ShopCheckout} />
      <Route path="/fr/shop/success" component={ShopSuccess} />
      <Route path="/fr/positive-words" component={lazy(() => import('./pages/positive-words'))} />
      <Route path="/fr/ikigai-word-wheel" component={lazy(() => import('./pages/positive-words'))} />
      <Route path="/fr/positive-words/:letter" component={lazy(() => import('./pages/positive-words/letter'))} />
      <Route path="/fr/positive-words-that-start-with-a" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-b" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-c" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-d" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-e" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-f" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-g" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-h" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-i" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-j" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-k" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-l" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-m" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-n" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-o" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-p" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-q" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-r" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-s" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-t" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-u" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-v" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-w" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-x" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-y" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-z" component={lazy(() => import('./pages/positive-words/redirect'))} />
      <Route path="/fr/positive-words-that-start-with-*" component={lazy(() => import('./pages/positive-words/redirect'))} />
      
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    initGA();
  }, []);

  // Initialize dynamic SEO for route-specific meta tags
  useDynamicSEO();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Router />
            </div>
            <Footer />

          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;