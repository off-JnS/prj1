import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import ClickSpark from "@/components/fx/ClickSpark";
import CustomCursor from "@/components/fx/CustomCursor";
import SiteNav from "@/components/layout/SiteNav";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";
import ConsentBanner from "@/components/layout/ConsentBanner";
import SmoothScroll from "@/lib/smooth-scroll";
import { IntroProvider } from "@/lib/intro";
// The start page ships in the entry bundle: it is where most visits land,
// and a lazy chunk would add a network round trip before the first paint.
import Landing from "@/pages/Landing";

const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Studio = lazy(() => import("@/pages/Studio"));
const Kontakt = lazy(() => import("@/pages/Kontakt"));
const Impressum = lazy(() => import("@/pages/Impressum"));
const Datenschutz = lazy(() => import("@/pages/Datenschutz"));
const Vertragsbedingungen = lazy(() => import("@/pages/Vertragsbedingungen"));
const Auftragsverarbeitung = lazy(() => import("@/pages/Auftragsverarbeitung"));
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
      return !sessionStorage.getItem("prj1-intro-seen");
    } catch {
      return true; // storage blocked — play the intro anyway
    }
  });

  // Written in an effect, not the initializer: StrictMode runs initializers
  // twice, and the second run would read our own write and skip the intro.
  useEffect(() => {
    if (!showIntro) return;
    try {
      sessionStorage.setItem("prj1-intro-seen", "1");
    } catch {
      /* storage blocked */
    }
  }, [showIntro]);

  return (
    // LazyMotion + `m` components ship only the DOM animation features we
    // use (strict: a stray `motion.*` throws instead of silently re-adding
    // the full bundle). reducedMotion="user": Framer skips transform/layout
    // animations for visitors who ask the OS for less motion.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <IntroProvider initialDone={!showIntro}>
          <ClickSpark sparkColor="#ffffff" sparkSize={12} sparkRadius={18} sparkCount={10} duration={500}>
            <CustomCursor />
            <SmoothScroll />
            {showIntro && <Preloader />}
            <a href="#main" className="skip-link">
              Zum Inhalt springen
            </a>
            <div className="u-paper min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
              <ScrollToTop />
              <SiteNav />
              <Suspense
                fallback={
                  <div className="grid min-h-[100svh] place-items-center bg-black">
                    <span className="u-kicker animate-pulse text-white/70">PRJ1</span>
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
                    <Route path="/vertragsbedingungen" element={<Vertragsbedingungen />} />
                    <Route path="/agb" element={<Navigate to="/vertragsbedingungen" replace />} />
                    <Route path="/auftragsverarbeitung" element={<Auftragsverarbeitung />} />
                    <Route path="/avv" element={<Navigate to="/auftragsverarbeitung" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                {/* Inside Suspense so it can't paint at the top and then get
                    shoved down when the lazy page arrives (CLS ≈ 1.0 before). */}
                <Footer />
              </Suspense>
            </div>
            <ConsentBanner />
          </ClickSpark>
        </IntroProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
