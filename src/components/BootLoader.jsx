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
  const inputRef = useRef(null);

  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("intro");
  const [progress, setProgress] = useState(0);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ================= MUSIC CONTROL
  useEffect(() => {
    audioManager.playBgm("boot", { volume: 1 }); // FULL VOLUME

    return () => audioManager.stopBgm();
  }, []);

  // ================= AUTOFOCUS (CRITICAL FOR MOBILE)
  useEffect(() => {
    if (stage === "intro") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [stage]);

  // ================= REALISTIC TYPING
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
        await delay(140);
      }
    };

    run();
  }, [stage]);

  // ================= INPUT HANDLER (WORKS EVERYWHERE)
  const handleKeyDown = (e) => {
    if (stage !== "intro") return;

    if (e.key === "Enter") {
      if (input.trim().toUpperCase() === "ENTER") {
        audioManager.play("enter");
        setStage("update");
        setInput("");
      }
    }
  };

  // ================= UPDATE
  useEffect(() => {
    if (stage !== "update") return;

    const run = async () => {
      setLines([]);
      for (const line of updateLines) {
        await typeLine(line, 10);
        await delay(50);
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
        setProgress((p) => Math.min(p + Math.random() * 5, 100));
      }, 90);

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
        await typeLine(line, 20);
        await delay(160);
      }

      await delay(700);
      navigate("/login");
    };

    run();
  }, [stage]);

  const renderBar = () => {
    const total = 26;
    const filled = Math.round((progress / 100) * total);
    return "█".repeat(filled) + "░".repeat(total - filled);
  };

  return (
    <div className="h-screen bg-black text-purple-300 font-mono">
      <div className="h-full w-full flex items-center justify-center">

        <div
          className="
            w-full max-w-4xl
            mx-3 sm:mx-6
            p-5 sm:p-8
            text-base sm:text-lg
            bg-black/80 backdrop-blur-xl
            border border-purple-500/30
            shadow-[0_0_80px_rgba(168,85,247,0.35)]
            rounded-xl
            relative
          "
        >
          {/* HEADER */}
          <div className="flex items-center gap-2 mb-6 opacity-40 text-xs sm:text-sm">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2 tracking-widest">
              memesh_runtime v3.1
            </span>
          </div>

          {/* TERMINAL */}
          <div className="space-y-2 leading-relaxed">
            {lines.map((line, idx) => (
              <div key={idx} className="opacity-80">
                {line}
              </div>
            ))}

            {stage === "intro" && (
              <div className="mt-4 flex items-center">
                <span className="text-purple-500 mr-2">&gt;</span>

                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="
                    bg-transparent
                    outline-none
                    w-full
                    text-purple-200
                    caret-purple-400
                  "
                />

                <span className="animate-pulse text-purple-400">█</span>
              </div>
            )}

            {stage === "progress" && (
              <div className="mt-4 text-purple-400">
                system upgrade progress
                <div>[{renderBar()}] {progress.toFixed(0)}%</div>
              </div>
            )}
          </div>

          {/* SCANLINES */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]
            bg-[linear-gradient(to_bottom,white,transparent_2px)]
            bg-[length:100%_4px]" />
        </div>

      </div>
    </div>
  );
}
