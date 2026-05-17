import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { motion, useSpring } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, Star as LucideStar } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button, buttonVariants } from "@/components/ui/button";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular?: boolean;
}

interface PricingSectionProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

const PricingContext = createContext<{
  isMonthly: boolean;
  setIsMonthly: (v: boolean) => void;
}>({ isMonthly: true, setIsMonthly: () => {} });

function Star({
  mousePosition,
  containerRef,
}: {
  mousePosition: { x: number | null; y: number | null };
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [initialPos] = useState({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  });
  const springConfig = { stiffness: 100, damping: 15, mass: 0.1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    if (!containerRef.current || mousePosition.x === null || mousePosition.y === null) {
      springX.set(0);
      springY.set(0);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const starX = rect.left + (parseFloat(initialPos.left) / 100) * rect.width;
    const starY = rect.top + (parseFloat(initialPos.top) / 100) * rect.height;
    const dx = mousePosition.x - starX;
    const dy = mousePosition.y - starY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 600;
    if (dist < radius) {
      const force = 1 - dist / radius;
      springX.set(dx * force * 0.5);
      springY.set(dy * force * 0.5);
    } else {
      springX.set(0);
      springY.set(0);
    }
  }, [mousePosition, initialPos, containerRef, springX, springY]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        top: initialPos.top,
        left: initialPos.left,
        width: `${1 + Math.random() * 2}px`,
        height: `${1 + Math.random() * 2}px`,
        background: "var(--color-foreground)",
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 5,
      }}
    />
  );
}

function InteractiveStarfield({
  mousePosition,
  containerRef,
}: {
  mousePosition: { x: number | null; y: number | null };
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      {Array.from({ length: 150 }).map((_, i) => (
        <Star key={`star-${i}`} mousePosition={mousePosition} containerRef={containerRef} />
      ))}
    </div>
  );
}

export function PricingSection({
  plans,
  title = "Preise, klar gemacht.",
  description = "Drei Pakete. Kein Lockangebot, kein Upsell. Wähle, was passt — wir bauen.",
}: PricingSectionProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <PricingContext.Provider value={{ isMonthly, setIsMonthly }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: null, y: null })}
        className="relative w-full bg-[var(--color-background)] py-24 sm:py-32"
      >
        <InteractiveStarfield mousePosition={mousePosition} containerRef={containerRef} />
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-[var(--color-foreground)]">
              {title}
            </h2>
            <p className="whitespace-pre-line text-lg text-[var(--color-muted-foreground)]">
              {description}
            </p>
          </div>
          <PricingToggle />
          <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </div>
    </PricingContext.Provider>
  );
}

function PricingToggle() {
  const { isMonthly, setIsMonthly } = useContext(PricingContext);
  const monthlyBtnRef = useRef<HTMLButtonElement>(null);
  const annualBtnRef = useRef<HTMLButtonElement>(null);
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const btn = isMonthly ? monthlyBtnRef.current : annualBtnRef.current;
    if (btn) {
      setPillStyle({
        width: btn.offsetWidth,
        transform: `translateX(${btn.offsetLeft}px)`,
      });
    }
  }, [isMonthly]);

  const handleToggle = (monthly: boolean) => {
    if (isMonthly === monthly) return;
    setIsMonthly(monthly);
    if (!monthly && annualBtnRef.current) {
      const rect = annualBtnRef.current.getBoundingClientRect();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#ffffff", "#cccccc", "#888888"],
        ticks: 300,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative flex w-fit items-center rounded-full bg-[var(--color-muted)] p-1">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-[var(--color-primary)] p-1"
          style={pillStyle}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
        <button
          ref={monthlyBtnRef}
          onClick={() => handleToggle(true)}
          className={cn(
            "relative z-10 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-6",
            isMonthly
              ? "text-[var(--color-primary-foreground)]"
              : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
          )}
        >
          Monatlich
        </button>
        <button
          ref={annualBtnRef}
          onClick={() => handleToggle(false)}
          className={cn(
            "relative z-10 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-6",
            !isMonthly
              ? "text-[var(--color-primary-foreground)]"
              : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
          )}
        >
          Jährlich
          <span className={cn("hidden sm:inline opacity-70")}> (20 % sparen)</span>
        </button>
      </div>
    </div>
  );
}

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const { isMonthly } = useContext(PricingContext);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{
        y: plan.isPopular && isDesktop ? -20 : 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.15,
      }}
      className={cn(
        "relative flex flex-col rounded-2xl p-8 bg-[var(--color-card)]/70 backdrop-blur-sm",
        plan.isPopular
          ? "border-2 border-[var(--color-primary)] shadow-2xl shadow-white/5"
          : "border border-[var(--color-border)]",
      )}
    >
      {plan.isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-1.5">
            <LucideStar className="h-4 w-4 fill-current text-[var(--color-primary-foreground)]" />
            <span className="text-sm font-semibold text-[var(--color-primary-foreground)]">
              Beliebteste Wahl
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col text-center">
        <h3 className="text-xl font-semibold text-[var(--color-foreground)]">{plan.name}</h3>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{plan.description}</p>
        <div className="mt-6 flex items-baseline justify-center gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
            <NumberFlow
              value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)}
              format={{
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 0,
              }}
              className="tabular-nums"
            />
          </span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-[var(--color-muted-foreground)]">
            / {plan.period}
          </span>
        </div>
        <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
          {isMonthly ? "Monatliche Abrechnung" : "Jährliche Abrechnung"}
        </p>

        <ul role="list" className="mt-8 space-y-3 text-left text-sm leading-6 text-[var(--color-muted-foreground)]">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <Check className="h-5 w-5 flex-none text-[var(--color-foreground)]" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Button
            asChild
            variant={plan.isPopular ? "default" : "outline"}
            size="lg"
            className="w-full"
          >
            <a href={plan.href} className={cn(buttonVariants({ variant: plan.isPopular ? "default" : "outline", size: "lg" }), "w-full")}>
              {plan.buttonText}
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
