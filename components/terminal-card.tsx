"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PROMPTS = [
  { prompt: "Build a full-stack hackathon project", tasks: ["Scaffolding Next.js app", "Designing Prisma schema", "Deploying to Vercel"] },
  { prompt: "Review this open-source PR", tasks: ["Checking type safety", "Running ESLint rules", "Suggesting cleaner diffs"] },
  { prompt: "Write tests for this API", tasks: ["Analyzing endpoint signatures", "Generating unit tests", "Adding edge-case coverage"] },
  { prompt: "Refactor this React component", tasks: ["Splitting into smaller hooks", "Memoizing expensive renders", "Removing unused imports"] },
  { prompt: "Debug this failing pipeline", tasks: ["Reading build logs", "Pinning dependency versions", "Updating CI config"] },
];

const SPONSORS = ["acme", "buildkit", "stackpool", "codecredit", "devfund"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickNext(current: number, length: number) {
  if (length <= 1) return current;
  let next = randomInt(0, length - 1);
  while (next === current) next = randomInt(0, length - 1);
  return next;
}

function useCycler(items: readonly string[], typeDelay: number, eraseDelay: number, holdMs: number) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "holding" | "erasing">("typing");
  const indexRef = useRef(0);

  useEffect(() => { indexRef.current = index; }, [index]);

  useEffect(() => {
    let cancelled = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const schedule = (fn: () => void, ms: number) => {
      if (cancelled) return;
      const id = setTimeout(fn, ms);
      timers.add(id);
    };

    const startType = () => {
      if (cancelled) return;
      const target = items[indexRef.current];
      setPhase("typing");
      let pos = 0;
      const type = () => {
        if (cancelled) return;
        pos += 1;
        setText(target.slice(0, pos));
        if (pos < target.length) {
          schedule(type, typeDelay + randomInt(-8, 12));
        } else {
          setPhase("holding");
          schedule(() => {
            setPhase("erasing");
            erase(target);
          }, holdMs + randomInt(-400, 800));
        }
      };
      schedule(type, randomInt(100, 300));
    };

    const erase = (target: string) => {
      if (cancelled) return;
      let pos = target.length;
      const tick = () => {
        if (cancelled) return;
        pos -= 1;
        setText(pos > 0 ? target.slice(0, pos) : "");
        if (pos > 0) {
          schedule(tick, eraseDelay + randomInt(-6, 8));
        } else {
          setPhase("idle");
          const next = pickNext(indexRef.current, items.length);
          setIndex(next);
          schedule(startType, randomInt(200, 700));
        }
      };
      schedule(tick, eraseDelay);
    };

    startType();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [items, typeDelay, eraseDelay, holdMs]);

  return { text, index, phase };
}

export function TerminalCard() {
  const promptStrings = useMemo(() => PROMPTS.map((p) => p.prompt), []);
  const sponsorStrings = useMemo(() => SPONSORS, []);

  const prompt = useCycler(promptStrings, 35, 18, 2600);
  const sponsor = useCycler(sponsorStrings, 35, 18, 3200);

  const [visibleTasks, setVisibleTasks] = useState(0);
  const [tasksVisible, setTasksVisible] = useState(false);
  const [displayedPromptIndex, setDisplayedPromptIndex] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const revealTasks = useCallback(() => {
    const tasks = PROMPTS[prompt.index].tasks;
    const ids: ReturnType<typeof setTimeout>[] = [];
    setVisibleTasks(0);
    setTasksVisible(true);
    tasks.forEach((_, i) => {
      const id = setTimeout(() => {
        setVisibleTasks((v) => Math.max(v, i + 1));
      }, 180 + i * (260 + randomInt(-40, 80)));
      ids.push(id);
    });
    return ids;
  }, [prompt.index]);

  useEffect(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (prompt.phase === "typing") {
      const timer = setTimeout(() => {
        setDisplayedPromptIndex(prompt.index);
        setTasksVisible(false);
        setVisibleTasks(0);
      }, 0);
      cleanupRef.current = () => clearTimeout(timer);
      return () => {
        cleanupRef.current?.();
        cleanupRef.current = null;
      };
    }

    if (prompt.phase === "holding") {
      const timer = setTimeout(() => {
        if (prompt.phase !== "holding") return;
        setDisplayedPromptIndex(prompt.index);
        setTasksVisible(true);
        setVisibleTasks(0);
        const ids = revealTasks();
        cleanupRef.current = () => ids.forEach(clearTimeout);
      }, 220);
      cleanupRef.current = () => clearTimeout(timer);
      return () => {
        cleanupRef.current?.();
        cleanupRef.current = null;
      };
    }

    if (prompt.phase === "erasing" || prompt.phase === "idle") {
      const timer = setTimeout(() => setTasksVisible(false), 0);
      cleanupRef.current = () => clearTimeout(timer);
      return () => {
        cleanupRef.current?.();
        cleanupRef.current = null;
      };
    }

    return undefined;
  }, [prompt.phase, prompt.index, revealTasks]);

  useEffect(() => {
    if (tasksVisible || visibleTasks === 0) return;
    const timer = setTimeout(() => {
      if (!tasksVisible) setVisibleTasks(0);
    }, 260);
    return () => clearTimeout(timer);
  }, [tasksVisible, visibleTasks]);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const current = PROMPTS[displayedPromptIndex];
  const isPromptActive = prompt.phase === "typing" || prompt.phase === "holding";
  const isSponsorActive = sponsor.phase === "typing" || sponsor.phase === "holding";

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card font-mono shadow-lg">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 text-xs text-muted">gratis code terminal tui</span>
      </div>
      <div className="min-h-[220px] px-5 py-6 text-sm leading-relaxed sm:px-6 sm:py-8">
        <p className="text-muted">
          <span className="text-green-500">➜</span> ~/gratis cat tasks.md
        </p>
        <p className="mt-2 font-medium text-foreground" aria-live="polite">
          <span className="text-muted">&gt;</span> {prompt.text}
          {isPromptActive && <span className="ml-0.5 inline-block h-4 w-2 align-text-bottom animate-pulse bg-foreground/80" />}
        </p>
        <div
          className={`mt-4 space-y-1 transition-all duration-300 ease-out ${
            tasksVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          {current.tasks.map((task, index) => (
            <p
              key={task}
              className={`text-muted transition-all duration-500 ease-out ${
                visibleTasks > index ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              style={{ transitionDelay: tasksVisible ? `${index * 90}ms` : "0ms" }}
            >
              {task}
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between border-t border-border px-5 py-3 text-xs text-muted sm:flex-row sm:items-center">
        <span>
          Sponsor: {sponsor.text}
          {isSponsorActive && <span className="ml-0.5 inline-block h-3 w-1.5 align-text-bottom animate-pulse bg-foreground/70" />}
        </span>
        <span className="mt-1 sm:mt-0">Model access: sponsored coding compute</span>
      </div>
    </div>
  );
}
