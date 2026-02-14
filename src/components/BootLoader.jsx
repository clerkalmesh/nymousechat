import { useEffect, useRef, useState } from "react";

const introLines = [
  "memesh://init",
  "secure runtime engaged",
  "",
  "type ENTER to access memesh protocols",
];

const updateLines = [
  "$ apt update",
  "Hit:1 memesh/core InRelease",
  "Get:2 memesh/crypto Modules [12.4 kB]",
  "Get:3 memesh/runtime SecureLayer [3,421 kB]",
  "Fetched 3,433 kB in 1s",
  "",
  "$ apt upgrade",
  "Reading package lists... Done",
  "Building dependency tree... Done",
  "Calculating upgrade... Done",
  "",
  "Upgrading:",
  " - identity-engine",
  " - relay-mesh",
  " - encryption-layer",
];

const philosophyLines = [
  "> memesh protocols initialized",
  "",
  "> memesh is not a platform",
  "> memesh is not a server",
  "",
  "> memesh is a protocol layer",
  "> where identity is derived from keys",
  "> not accounts",
  "",
  "> lose your secret key = lose your identity",
  "> no authority can restore it",
  "",
  "> only possession defines existence",
  "",
  "> secure session ready",
  "> entering memesh interface...",
];

export default function ProtocolBootLoader({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("intro");
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/kane.mp3");
    audioRef.current.volume = 0.4;
  }, []);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ==============================
  // REALISTIC CHARACTER TYPING
  // ==============================
  const typeLine = async (text, speed = 18) => {
    let buffer = "";
    setLines((prev) => [...prev, ""]);

    for (let i = 0; i < text.length; i++) {
      buffer += text[i];

      setLines((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = buffer;
        return copy;
      });

      await delay(speed);
    }
  };

  // ==============================
  // INTRO SEQUENCE
  // ==============================
  useEffect(() => {
    if (stage !== "intro") return;

    const run = async () => {
      setLines([]);

      for (const line of introLines) {
        await typeLine(line, 22);
        await delay(120);
      }
    };

    run();
  }, [stage]);

  // ==============================
  // INPUT LISTENER
  // ==============================
  useEffect(() => {
    const handler = (e) => {
      if (stage !== "intro") return;

      if (e.key.length === 1) {
        setInput((p) => (p + e.key).toUpperCase());
      }

      if (e.key === "Backspace") {
        setInput((p) => p.slice(0, -1));
      }

      if (e.key === "Enter") {
        if (input === "ENTER") {
          audioRef.current?.play();
          setStage("update");
          setInput("");
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input, stage]);

  // ==============================
  // UPDATE SEQUENCE
  // ==============================
  useEffect(() => {
    if (stage !== "update") return;

    const run = async () => {
      setLines([]);

      for (const line of updateLines) {
        await typeLine(line, 12);
        await delay(60);
      }

      setStage("progress");
    };

    run();
  }, [stage]);

  // ==============================
  // PROGRESS SIMULATION
  // ==============================
  useEffect(() => {
    if (stage !== "progress") return;

    if (progress < 100) {
      const t = setTimeout(() => {
        setProgress((p) => Math.min(p + Math.random() * 7, 100));
      }, 80);

      return () => clearTimeout(t);
    } else {
      setStage("philosophy");
    }
  }, [progress, stage]);

  // ==============================
  // PHILOSOPHY SEQUENCE
  // ==============================
  useEffect(() => {
    if (stage !== "philosophy") return;

    const run = async () => {
      setLines([]);

      for (const line of philosophyLines) {
        await typeLine(line, 20);
        await delay(140);
      }

      await delay(400);
      onComplete?.();
    };

    run();
  }, [stage]);

  const renderBar = () => {
    const total = 24;
    const filled = Math.round((progress / 100) * total);
    return "█".repeat(filled) + "░".repeat(total - filled);
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* glow background */}
      <div className="absolute inset-0 bg-purple-500/5 blur-3xl" />

      <div
        ref={containerRef}
        className="
          relative w-full max-w-3xl 
          bg-black/80 backdrop-blur-xl
          border border-purple-500/30
          shadow-[0_0_60px_rgba(168,85,247,0.35)]
          rounded-xl
          p-8
          font-mono text-lg
          text-purple-300
          animate-pulse
        "
      >
        {/* header */}
        <div className="flex items-center gap-2 mb-6 opacity-50">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-sm tracking-wider">
            memesh_runtime v3.1
          </span>
        </div>

        {/* terminal text */}
        <div className="space-y-1 tracking-wide">
          {lines.map((line, idx) => (
            <div key={idx} className="opacity-80">
              {line}
            </div>
          ))}

          {stage === "intro" && (
            <div className="mt-4 flex">
              <span className="text-purple-500 mr-2">&gt;</span>
              <span className="text-purple-200">{input}</span>
              <span className="animate-pulse text-purple-400">█</span>
            </div>
          )}

          {stage === "progress" && (
            <div className="mt-6 text-purple-400">
              system upgrade progress
              <div>
                [{renderBar()}] {progress.toFixed(0)}%
              </div>
            </div>
          )}
        </div>

        {/* scanlines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_bottom,white,transparent_2px)] bg-[length:100%_4px]" />
      </div>
    </div>
  );
}
