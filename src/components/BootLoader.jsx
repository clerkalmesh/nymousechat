import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { audioManager } from "../lib/audioManager";

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

export default function ProtocolBootLoader() {
  const navigate = useNavigate();

  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("intro");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    audioManager.playBgm("boot");   // MUSIK START LOOP

    return () => {
      audioManager.stopBgm();       // STOP saat keluar page
    };
  }, []);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const typeLine = async (text, speed = 16) => {
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

  // ================= INTRO
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

  // ================= INPUT
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

  // ================= UPDATE
  useEffect(() => {
    if (stage !== "update") return;

    const run = async () => {
      setLines([]);

      for (const line of updateLines) {
        await typeLine(line, 10);
        await delay(40);
      }

      setStage("progress");
    };

    run();
  }, [stage]);

  // ================= PROGRESS
  useEffect(() => {
    if (stage !== "progress") return;

    if (progress < 100) {
      const t = setTimeout(() => {
        setProgress((p) => Math.min(p + Math.random() * 6, 100));
      }, 70);

      return () => clearTimeout(t);
    } else {
      setStage("philosophy");
    }
  }, [progress, stage]);

  // ================= PHILOSOPHY
  useEffect(() => {
    if (stage !== "philosophy") return;

    const run = async () => {
      setLines([]);

      for (const line of philosophyLines) {
        await typeLine(line, 18);
        await delay(120);
      }

      await delay(500);

      // FINAL → langsung login page
      navigate("/login");
    };

    run();
  }, [stage]);

  const renderBar = () => {
    const total = 22;
    const filled = Math.round((progress / 100) * total);
    return "█".repeat(filled) + "░".repeat(total - filled);
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-purple-500/5 blur-3xl" />

      <div
        className="
          relative w-full max-w-3xl
          mx-4 sm:mx-6
          bg-black/80 backdrop-blur-xl
          border border-purple-500/30
          shadow-[0_0_60px_rgba(168,85,247,0.35)]
          rounded-xl
          p-4 sm:p-6 md:p-8
          font-mono
          text-sm sm:text-base md:text-lg
          text-purple-300
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4 opacity-40 text-xs sm:text-sm">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-2 tracking-wider">memesh_runtime v3.1</span>
        </div>

        {/* TERMINAL */}
        <div className="space-y-1">
          {lines.map((line, idx) => (
            <div key={idx} className="opacity-80">
              {line}
            </div>
          ))}

          {stage === "intro" && (
            <div className="mt-3 flex">
              <span className="text-purple-500 mr-2">&gt;</span>
              <span>{input}</span>
              <span className="animate-pulse">█</span>
            </div>
          )}

          {stage === "progress" && (
            <div className="mt-4 text-purple-400">
              system upgrade progress
              <div>[{renderBar()}] {progress.toFixed(0)}%</div>
            </div>
          )}
        </div>

        {/* scanlines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_bottom,white,transparent_2px)] bg-[length:100%_4px]" />
      </div>
    </div>
  );
}