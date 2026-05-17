import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ClickSpark from "@/components/fx/ClickSpark";
import CustomCursor from "@/components/fx/CustomCursor";
import InfinityLoader from "@/components/fx/InfinityLoader";
import ResponsiveNav from "@/components/layout/ResponsiveNav";
import Footer from "@/components/layout/Footer";

const Landing = lazy(() => import("@/pages/Landing"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Impressum = lazy(() => import("@/pages/Impressum"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ClickSpark sparkColor="#ffffff" sparkSize={12} sparkRadius={18} sparkCount={10} duration={500}>
      <CustomCursor />
      <div className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <ScrollToTop />
        <ResponsiveNav />
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[60] grid place-items-center bg-[var(--color-background)]">
              <InfinityLoader />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </ClickSpark>
  );
}
