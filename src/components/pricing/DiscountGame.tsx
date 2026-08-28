import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Overlay from "@/components/ui/Overlay";
import { cn } from "@/lib/utils";
import {
  handValue,
  hit as hitRound,
  isBlackjack,
  isBust,
  stand as standRound,
  startRound,
  type Card,
  type Round,
} from "@/lib/blackjack";
import { bankDiscount, useDiscount } from "@/hooks/useDiscount";
import type { DiscountTier } from "@/data/plans";

const PROMPTED_KEY = "prj1-discount-prompted";
const AUTO_OPEN_DELAY = 20_000;

type Phase = "intro" | "playing" | "offer" | "final";

/* --------------------------------------------------------------- cards --- */

function CardBack() {
  return (
    <div
      className="h-full w-full rounded-[7px] bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.28)_3px,rgba(255,255,255,0.28)_4px)]"
      aria-hidden="true"
    />
  );
}

function PlayingCard({ card, hidden, index }: { card: Card; hidden?: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -34, rotate: -10 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.11, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative h-[5.5rem] w-[3.75rem] flex-none rounded-lg border p-1.5 font-mono shadow-lg sm:h-24 sm:w-16",
        hidden ? "border-white/25 bg-white/5" : "border-white/70 bg-white text-black",
      )}
      aria-label={hidden ? "Verdeckte Karte" : `${card.rank} ${card.suit}`}
    >
      {hidden ? (
        <CardBack />
      ) : (
        <>
          <span className="absolute left-1.5 top-1 text-[11px] font-bold leading-none">
            {card.rank}
          </span>
          <span className="absolute inset-0 grid place-items-center text-lg leading-none">
            {card.suit}
          </span>
          <span className="absolute bottom-1 right-1.5 rotate-180 text-[11px] font-bold leading-none">
            {card.rank}
          </span>
        </>
      )}
    </motion.div>
  );
}

function Hand({
  title,
  cards,
  hideSecond,
}: {
  title: string;
  cards: Card[];
  hideSecond?: boolean;
}) {
  const visible = hideSecond ? cards.slice(0, 1) : cards;
  const { total, soft } = handValue(visible);

  return (
    <section>
      <header className="flex items-baseline justify-between gap-4">
        <h3 className="u-kicker">{title}</h3>
        <p className="font-mono text-xs tabular-nums text-[var(--color-muted-foreground)]">
          {hideSecond ? `${total} + ?` : `${soft ? "soft " : ""}${total}`}
        </p>
      </header>
      <div className="mt-3 flex gap-2">
        {cards.map((card, i) => (
          <PlayingCard
            key={`${card.rank}${card.suit}${i}`}
            card={card}
            hidden={hideSecond && i > 0}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- game --- */

/** Short verdict for the player's hand, in the card-table vocabulary. */
function handLabel(round: Round): string | null {
  if (round.phase !== "done") return null;
  if (isBust(round.player)) return "Bust";
  if (isBlackjack(round.player)) return "Blackjack!";
  if (isBust(round.dealer)) return "Dealer bust";
  return null;
}

function GameBody({ onClose }: { onClose: () => void }) {
  const { tier: heldTier } = useDiscount();
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState<Round | null>(null);
  const [doubling, setDoubling] = useState(false);
  const [result, setResult] = useState<"won" | "lost" | null>(null);
  /** The tier actually in force after the last settle — floor included. */
  const [inForce, setInForce] = useState<DiscountTier>(heldTier);

  const stake = doubling ? 20 : 10;

  const deal = useCallback(() => {
    setRound(startRound());
    setPhase("playing");
  }, []);

  // Settle the round once the engine says it is done.
  useEffect(() => {
    if (!round || round.phase !== "done") return;

    const timer = window.setTimeout(() => {
      if (round.outcome === "push") {
        // A tie costs nothing — deal again at the same stake.
        setRound(startRound());
        return;
      }
      if (round.outcome === "player") {
        if (doubling) {
          setInForce(bankDiscount(20));
          setResult("won");
          setPhase("final");
        } else {
          // Banked immediately: closing the dialog now keeps the discount.
          setInForce(bankDiscount(10));
          setPhase("offer");
        }
        return;
      }
      // A loss yields nothing from *this* game, but any tier won earlier
      // survives — bankDiscount returns whichever is higher.
      setInForce(bankDiscount(0));
      setResult("lost");
      setPhase("final");
    }, 900);

    return () => window.clearTimeout(timer);
  }, [round, doubling]);

  const label = round ? handLabel(round) : null;
  const settling = round?.phase === "done" && phase === "playing";

  return (
    <div className="rounded-3xl border border-white/15 bg-[var(--color-card)] p-6 sm:p-8">
      <header>
        <p className="u-kicker">Rabatt-Spiel</p>
        <h2 className="u-display mt-3 text-3xl sm:text-4xl">
          Blackjack um deinen <em className="u-serif not-italic">Rabatt.</em>
        </h2>
      </header>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              Schlag den Dealer und du bekommst <strong className="text-white">10 %</strong> auf
              jedes Website-Paket. Gewinnst du, darfst du einmal verdoppeln — auf 20 %, oder
              zurück auf null.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              Ein Versuch pro Besuch · Dealer stands on 17
            </p>
            <button
              type="button"
              onClick={deal}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--color-foreground)] px-8 text-sm font-semibold text-[var(--color-background)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              Deal
            </button>
          </motion.div>
        )}

        {phase === "playing" && round && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
              Einsatz: {stake} % Rabatt
            </p>
            <Hand title="Dealer" cards={round.dealer} hideSecond={round.phase === "player"} />
            <Hand title="Du" cards={round.player} />

            {label && (
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-white">{label}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRound((r) => (r ? hitRound(r) : r))}
                disabled={round.phase !== "player"}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[var(--color-foreground)] px-6 text-sm font-semibold text-[var(--color-background)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
              >
                Hit
              </button>
              <button
                type="button"
                onClick={() => setRound((r) => (r ? standRound(r) : r))}
                disabled={round.phase !== "player"}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-[var(--color-foreground)]/40 px-6 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)] disabled:opacity-40"
              >
                Stand
              </button>
            </div>

            {settling && (
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted-foreground)]">
                Wird abgerechnet …
              </p>
            )}
          </motion.div>
        )}

        {phase === "offer" && (
          <motion.div
            key="offer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <p className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {inForce} % gesichert
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {inForce >= 20 ? (
                <>
                  Mehr als 20 % gibt es nicht — du kannst trotzdem noch eine Hand spielen.
                  Verlieren kannst du dabei nichts.
                </>
              ) : (
                <>
                  Double or nothing: noch eine Hand für <strong className="text-white">20 %</strong>{" "}
                  — verlierst du, bleibt es bei {inForce} %.
                </>
              )}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setDoubling(true);
                  setRound(startRound());
                  setPhase("playing");
                }}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[var(--color-foreground)] px-6 text-sm font-semibold text-[var(--color-background)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Double or nothing
              </button>
              <button
                type="button"
                onClick={() => {
                  setResult("won");
                  setPhase("final");
                }}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-[var(--color-foreground)]/40 px-6 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)]"
              >
                {inForce} % behalten
              </button>
            </div>
          </motion.div>
        )}

        {phase === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            {result === "lost" && inForce === 0 ? (
              <>
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-white">
                  Dealer gewinnt
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  Kein Rabatt diesmal. Lade die Seite neu und versuch es wieder — die Preise
                  bleiben so lange, wie sie sind.
                </p>
              </>
            ) : result === "lost" ? (
              <>
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-white">
                  Dealer gewinnt
                </p>
                <p className="u-display mt-4 text-5xl sm:text-6xl">{inForce} %</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  Diese Hand geht an den Dealer — dein bereits gewonnener Rabatt bleibt dir
                  trotzdem erhalten.
                </p>
              </>
            ) : (
              <>
                <p className="u-display text-5xl sm:text-6xl">{inForce} %</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  Rabatt auf jedes Website-Paket, sieben Tage gültig. Er ist bereits in den Preisen
                  unten eingerechnet und wird beim Checkout übernommen.
                </p>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--color-foreground)] px-8 text-sm font-semibold text-[var(--color-background)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              Zu den Paketen
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- entry --- */

/**
 * Discount game entry point: an always-live teaser strip on the pricing page,
 * plus one unprompted opening per session.
 *
 * The table is open on every reload — there is no per-visit play limit. The
 * only session-scoped guard left is the auto-open, because a modal that
 * throws itself at you on every single page load is hostile. The button is
 * always there for anyone who wants another hand.
 */
export default function DiscountGame() {
  const { tier } = useDiscount();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (tier > 0) return;

    try {
      if (sessionStorage.getItem(PROMPTED_KEY)) return;
    } catch {
      /* storage blocked — fall through and prompt once for this page */
    }

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(PROMPTED_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    }, AUTO_OPEN_DELAY);

    return () => window.clearTimeout(timer);
  }, [tier]);

  return (
    <>
      <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-dashed border-[var(--color-border)] p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="u-kicker">
            {tier > 0 ? `${tier} % Rabatt aktiv` : "Spiel um den Preis"}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            {tier >= 20
              ? "Höchster Rabatt gesichert, sieben Tage gültig und in den Preisen oben eingerechnet."
              : tier > 0
                ? `${tier} % sind dir sicher und in den Preisen oben eingerechnet. Noch eine Hand auf 20 %? Verlieren kannst du deinen Rabatt nicht.`
                : "Eine Hand Blackjack gegen den Dealer: 10 % auf jedes Website-Paket, verdoppelbar auf 20 %."}
          </p>
        </div>
        {tier < 20 && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-12 flex-none items-center justify-center gap-2 rounded-full border border-[var(--color-foreground)]/40 px-6 text-sm font-semibold transition-colors hover:border-[var(--color-foreground)]"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {tier > 0 ? "Nochmal geben" : "Karten geben"}
          </button>
        )}
      </div>

      <Overlay open={open} onClose={close} label="Blackjack um deinen Rabatt" className="max-w-md">
        {/* Remount on each opening so a fresh session starts at the intro. */}
        {open && <GameBody onClose={close} />}
      </Overlay>
    </>
  );
}
