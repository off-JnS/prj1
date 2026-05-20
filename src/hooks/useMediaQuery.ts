import { useLayoutEffect, useState } from "react";

export function useMediaQuery(query: string) {
  // Initialise synchronously so the correct value is available on first render
  // (avoids a flash where the wrong layout/component is shown for one frame).
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useLayoutEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
