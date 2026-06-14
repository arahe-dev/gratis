import { useEffect, useRef, useState } from "react";

export function useTypewriter(text: string, delay: number) {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    indexRef.current = 0;

    function tick() {
      if (!mounted) return;
      indexRef.current += 1;
      if (indexRef.current === 1) setDone(false);
      setValue(text.slice(0, indexRef.current));
      if (indexRef.current < text.length) {
        timeoutRef.current = setTimeout(tick, delay);
      } else {
        setDone(true);
      }
    }

    timeoutRef.current = setTimeout(tick, delay);

    return () => {
      mounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, delay]);

  return { value, done };
}
