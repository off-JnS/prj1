import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Tracks whether the intro preloader has finished, so the hero can hold its
 * entrance choreography until the curtain lifts. Routes without a preloader
 * start with done=true.
 */
const IntroContext = createContext<{ done: boolean; finish: () => void }>({
  done: true,
  finish: () => {},
});

export function IntroProvider({
  initialDone,
  children,
}: {
  initialDone: boolean;
  children: ReactNode;
}) {
  const [done, setDone] = useState(initialDone);
  const finish = useCallback(() => setDone(true), []);
  const value = useMemo(() => ({ done, finish }), [done, finish]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
