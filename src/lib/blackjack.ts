/**
 * Blackjack rules engine for the pricing-page discount game.
 *
 * Pure and immutable — no React, no DOM, no storage. Every function returns a
 * new state, which keeps the rules verifiable on their own and lets the UI
 * treat a round like any other value.
 *
 * House rules: single deck, dealer stands on all 17s (S17), no splits, no
 * doubling, no insurance. Naturals pay nothing extra — the only stake is the
 * discount tier.
 */

export type Suit = "♠" | "♥" | "♦" | "♣";

export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Outcome = "player" | "dealer" | "push";

export type Phase = "player" | "dealer" | "done";

export interface Round {
  /** Remaining undealt cards, top of deck last. */
  deck: Card[];
  player: Card[];
  dealer: Card[];
  phase: Phase;
  outcome: Outcome | null;
}

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

/**
 * Uniform random integer in [0, max). Rejection sampling, because
 * `getRandomValues() % max` skews toward low values when max doesn't divide
 * 2³² evenly — visible over a 52-card shuffle.
 */
function randomBelow(max: number): number {
  if (max <= 0) return 0;
  const crypto = globalThis.crypto;
  if (!crypto?.getRandomValues) return Math.floor(Math.random() * max);

  const limit = Math.floor(0xffffffff / max) * max;
  const buffer = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

/** Fisher–Yates. Returns a new array; the input is untouched. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = randomBelow(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function cardValue(card: Card): number {
  if (card.rank === "A") return 11;
  if (card.rank === "K" || card.rank === "Q" || card.rank === "J" || card.rank === "10") return 10;
  return Number(card.rank);
}

/**
 * Best total for a hand, plus whether an ace is still counting as 11 (a soft
 * hand). Aces start at 11 and are demoted one at a time until the hand fits.
 */
export function handValue(cards: readonly Card[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    total += cardValue(card);
    if (card.rank === "A") aces += 1;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return { total, soft: aces > 0 };
}

export function isBust(cards: readonly Card[]): boolean {
  return handValue(cards).total > 21;
}

/** A natural: exactly two cards totalling 21. */
export function isBlackjack(cards: readonly Card[]): boolean {
  return cards.length === 2 && handValue(cards).total === 21;
}

function draw(deck: Card[], count: number): { drawn: Card[]; rest: Card[] } {
  // Reshuffle rather than run dry — a single round can't exhaust a deck, but
  // this keeps the function total.
  const source = deck.length >= count ? deck : shuffle(createDeck());
  return { drawn: source.slice(0, count), rest: source.slice(count) };
}

export function resolve(player: readonly Card[], dealer: readonly Card[]): Outcome {
  if (isBust(player)) return "dealer";
  if (isBust(dealer)) return "player";

  const playerNatural = isBlackjack(player);
  const dealerNatural = isBlackjack(dealer);
  if (playerNatural && !dealerNatural) return "player";
  if (dealerNatural && !playerNatural) return "dealer";

  const p = handValue(player).total;
  const d = handValue(dealer).total;
  if (p > d) return "player";
  if (d > p) return "dealer";
  return "push";
}

/** Deals a fresh round. A dealt natural settles it immediately. */
export function startRound(): Round {
  const deck = shuffle(createDeck());
  const { drawn, rest } = draw(deck, 4);
  const player = [drawn[0], drawn[2]];
  const dealer = [drawn[1], drawn[3]];

  if (isBlackjack(player) || isBlackjack(dealer)) {
    return { deck: rest, player, dealer, phase: "done", outcome: resolve(player, dealer) };
  }
  return { deck: rest, player, dealer, phase: "player", outcome: null };
}

export function hit(round: Round): Round {
  if (round.phase !== "player") return round;
  const { drawn, rest } = draw(round.deck, 1);
  const player = [...round.player, drawn[0]];

  if (isBust(player)) {
    return { ...round, deck: rest, player, phase: "done", outcome: "dealer" };
  }
  if (handValue(player).total === 21) {
    // 21 never benefits from another card — go straight to the dealer.
    return stand({ ...round, deck: rest, player });
  }
  return { ...round, deck: rest, player };
}

/** Player stands; the dealer draws to 17 and the round settles. */
export function stand(round: Round): Round {
  if (round.phase === "done") return round;

  let deck = round.deck;
  let dealer = round.dealer;

  while (handValue(dealer).total < 17) {
    const { drawn, rest } = draw(deck, 1);
    dealer = [...dealer, drawn[0]];
    deck = rest;
  }

  return {
    deck,
    player: round.player,
    dealer,
    phase: "done",
    outcome: resolve(round.player, dealer),
  };
}
