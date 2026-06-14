"use client";

import { useEffect, useRef, useState } from "react";

const PROMPTS = [
  {
    prompt: "Build a full-stack hackathon project",
    tasks: ["Scaffolding Next.js app", "Designing Prisma schema", "Deploying to Vercel"],
  },
  {
    prompt: "Review this open-source PR",
    tasks: ["Checking type safety", "Running ESLint rules", "Suggesting cleaner diffs"],
  },
  {
    prompt: "Write tests for this API",
    tasks: ["Analyzing endpoint signatures", "Generating unit tests", "Adding edge-case coverage"],
  },
  {
    prompt: "Refactor this React component",
    tasks: ["Splitting into smaller hooks", "Memoizing expensive renders", "Removing unused imports"],
  },
  {
    prompt: "Debug this failing pipeline",
    tasks: ["Reading build logs", "Pinning dependency versions", "Updating CI config"],
  },
];

const SPONSORS = ["acme", "buildkit", "stackpool", "codecredit", "devfund"];

const BASE_TYPE_MS = 35;
const BASE_ERASE_MS = 18;
const HOLD_PROMPT_MS = 2600;
const HOLD_SPONSOR_MS = 3200;
const TASK_GAP_MS = 320;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickNext(current: number, length: number) {
  if (length <= 1) return current;
  let next = randomInt(0, length - 1);
  while (next === current) {
    next = randomInt(0, length - 1);
  }
  return next;
}

type Phase = "idle" | "typing" | "holding" | "erasing";

interface CycleState {
  index: number;
  text: string;
  phase: Phase;
}

export function TerminalCard() {
  const [prompt, setPrompt] = useState<CycleState>({ index: 0, text: "", phase: "idle" });
  const [sponsor, setSponsor] = useState<CycleState>({ index: 0, text: "", phase: "idle" });
  const [visibleTasks, setVisibleTasks] = useState(0);
  const [cursorPrompt, setCursorPrompt] = useState(false);
  const [cursorSponsor, setCursorSponsor] = useState(false);

  const promptRef = useRef(prompt);
  const sponsorRef = useRef(sponsor);
  const visibleTasksRef = useRef(0);

  useEffect(() => {
    promptRef.current = prompt;
  }, [prompt]);
  useEffect(() => {
    sponsorRef.current = sponsor;
  }, [sponsor]);
  useEffect(() => {
    visibleTasksRef.current = visibleTasks;
  }, [visibleTasks]);

  useEffect(() => {
    let cancelled = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const schedule = (fn: () => void, ms: number) => {
      if (cancelled) return;
      const id = setTimeout(fn, ms);
      timers.add(id);
    };

    const typeSpeed = () => BASE_TYPE_MS + randomInt(-12, 18);
    const eraseSpeed = () => BASE_ERASE_MS + randomInt(-6, 12);

    const runPromptCycle = () => {
      if (cancelled) return;
      const target = PROMPTS[promptRef.current.index].prompt;
      setPrompt((p) => ({ ...p, phase: "typing" }));
      setCursorPrompt(true);

      const type = () => {
        if (cancelled) return;
        const current = promptRef.current;
        if (current.text.length < target.length) {
          const next = target.slice(0, current.text.length + 1);
          setPrompt((p) => ({ ...p, text: next }));
          schedule(type, typeSpeed());
        } else {
          revealTasks(0);
          setPrompt((p) => ({ ...p, phase: "holding" }));
          schedule(() => {
            setPrompt((p) => ({ ...p, phase: "erasing" }));
            erasePrompt();
          }, HOLD_PROMPT_MS + randomInt(-400, 800));
        }
      };

      const revealTasks = (taskIndex: number) => {
        if (cancelled) return;
        const tasks = PROMPTS[promptRef.current.index].tasks;
        if (taskIndex < tasks.length) {
          setVisibleTasks(taskIndex + 1);
          schedule(() => revealTasks(taskIndex + 1), TASK_GAP_MS + randomInt(-60, 120));
        }
      };

      const erasePrompt = () => {
        if (cancelled) return;
        const current = promptRef.current;
        if (current.text.length > 0) {
          const next = current.text.slice(0, -1);
          setPrompt((p) => ({ ...p, text: next }));
          if (visibleTasksRef.current > 0) setVisibleTasks(0);
          schedule(erasePrompt, eraseSpeed());
        } else {
          const nextIndex = pickNext(current.index, PROMPTS.length);
          setPrompt({ index: nextIndex, text: "", phase: "idle" });
          setCursorPrompt(false);
          schedule(runPromptCycle, randomInt(200, 700));
        }
      };

      schedule(type, randomInt(150, 450));
    };

    const runSponsorCycle = () => {
      if (cancelled) return;
      const target = SPONSORS[sponsorRef.current.index];
      setSponsor((s) => ({ ...s, phase: "typing" }));
      setCursorSponsor(true);

      const type = () => {
        if (cancelled) return;
        const current = sponsorRef.current;
        if (current.text.length < target.length) {
          const next = target.slice(0, current.text.length + 1);
          setSponsor((s) => ({ ...s, text: next }));
          schedule(type, typeSpeed());
        } else {
          setSponsor((s) => ({ ...s, phase: "holding" }));
          schedule(() => {
            setSponsor((s) => ({ ...s, phase: "erasing" }));
            eraseSponsor();
          }, HOLD_SPONSOR_MS + randomInt(-500, 900));
        }
      };

      const eraseSponsor = () => {
        if (cancelled) return;
        const current = sponsorRef.current;
        if (current.text.length > 0) {
          const next = current.text.slice(0, -1);
          setSponsor((s) => ({ ...s, text: next }));
          schedule(eraseSponsor, eraseSpeed());
        } else {
          const nextIndex = pickNext(current.index, SPONSORS.length);
          setSponsor({ index: nextIndex, text: "", phase: "idle" });
          setCursorSponsor(false);
          schedule(runSponsorCycle, randomInt(300, 1000));
        }
      };

      schedule(type, randomInt(300, 800));
    };

    runPromptCycle();
    schedule(runSponsorCycle, randomInt(900, 1800));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const current = PROMPTS[prompt.index];

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
          <span className="text-green-500">➜</span> ~/gratis git:(main) cat tasks.md
        </p>
        <p className="mt-2 font-medium text-foreground">
          <span className="text-muted">&gt;</span> {prompt.text}
          <span
            className={`ml-0.5 inline-block h-4 w-2 align-text-bottom bg-foreground/80 ${
              cursorPrompt ? "animate-pulse" : ""
            }`}
          />
        </p>
        <div className="mt-4 space-y-1">
          {current.tasks.slice(0, visibleTasks).map((task) => (
            <p key={task} className="text-muted">
              {task}
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between border-t border-border px-5 py-3 text-xs text-muted sm:flex-row sm:items-center">
        <span>
          Sponsor: {sponsor.text}
          <span
            className={`ml-0.5 inline-block h-3 w-1.5 align-text-bottom bg-foreground/70 ${
              cursorSponsor ? "animate-pulse" : ""
            }`}
          />
        </span>
        <span className="mt-1 sm:mt-0">Model: deepseek v4 pro</span>
      </div>
    </div>
  );
}
