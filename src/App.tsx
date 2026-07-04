import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ClickSpark from "@/components/fx/ClickSpark";
import CustomCursor from "@/components/fx/CustomCursor";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import ConsentBanner from "@/components/layout/ConsentBanner";
import SmoothScroll from "@/lib/smooth-scroll";
import { IntroProvider } from "@/lib/intro";

const Landing = lazy(() => import("@/pages/Landing"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Studio = lazy(() => import("@/pages/Studio"));
const Kontakt = lazy(() => import("@/pages/Kontakt"));
const Impressum = lazy(() => import("@/pages/Impressum"));
const Datenschutz = lazy(() => import("@/pages/Datenschutz"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    // Screen-reader users land on the new page content, not in the nav.
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

export default function App() {
  // The intro curtain only plays for full loads of the start page — deep
  // links and repeat visits within the same session go straight to content.
  const [showIntro] = useState(() => {
    if (window.location.pathname !== "/") return false;
    try {
      if (sessionStorage.getItem("prj1-intro-seen")) return false;
      sessionStorage.setItem("prj1-intro-seen", "1");
    } catch {
      /* storage blocked — play the intro anyway */
    }
    return true;
  });

  return (
    <IntroProvider initialDone={!showIntro}>
      <ClickSpark sparkColor="#ffffff" sparkSize={12} sparkRadius={18} sparkCount={10} duration={500}>
        <CustomCursor />
        <SmoothScroll />
        {showIntro && <Preloader />}
        <div className="grain-overlay" aria-hidden="true" />
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        <div className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
          <ScrollToTop />
          <SiteNav />
          <Suspense
            fallback={
              <div className="fixed inset-0 z-[60] grid place-items-center bg-black">
                <span className="u-kicker animate-pulse text-white/60">PRJ1</span>
              </div>
            }
          >
            <div id="main" tabIndex={-1} className="outline-none">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/preise" element={<Pricing />} />
                <Route path="/pricing" element={<Navigate to="/preise" replace />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/kontakt" element={<Kontakt />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Suspense>
          <Footer />
        </div>
        <ConsentBanner />
      </ClickSpark>
    </IntroProvider>
  );
}
