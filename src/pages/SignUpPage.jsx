import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// ======================
// Matrix Rain Canvas (Pink Edition)
// ======================
const MatrixRain = ({ className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height;
    const setCanvasDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasDimensions();

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
      ""
    );
    const fontSize = 16;
    const columns = width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#f472b6"; // pink-400
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    window.addEventListener("resize", setCanvasDimensions);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />;
};

// ======================
// Main Component
// ======================
const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, clearSignupData } = useAuthStore();

  const [step, setStep] = useState(1);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [error, setError] = useState("");

  // Typing effect utilities
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const typeLine = async (line, speed = 40) => {
    let currentText = "";
    for (let i = 0; i < line.length; i++) {
      currentText += line[i];
      setExecutionLogs((prev) => [...prev.slice(0, -1), currentText]); // replace last line
      await delay(speed);
    }
  };

  const handleGenerate = () => {
    setError("");
    setShowTerminal(true);
    setIsGenerating(true);
    setExecutionLogs(["$"]); // initial prompt
  };

  // Run terminal animation when showTerminal becomes true
  useEffect(() => {
    if (!showTerminal) return;

    const runTerminal = async () => {
      // Type the command
      await typeLine("$ generate-identity", 60);
      await delay(200);

      // Output lines
      setExecutionLogs((prev) => [...prev, "> initializing identity protocol..."]);
      await delay(600);
      setExecutionLogs((prev) => [...prev, "> generating secret key..."]);
      await delay(800);

      try {
        const data = await signup();

        setExecutionLogs((prev) => [...prev, "> secret key generated."]);
        await delay(400);
        setExecutionLogs((prev) => [...prev, "> identity created successfully."]);
        await delay(600);

        // Auto-copy to clipboard
        if (data?.secretKey) {
          await navigator.clipboard.writeText(data.secretKey);
        }

        setStep(2);
      } catch (err) {
        console.error(err);
        setError("Failed to generate identity");
        setExecutionLogs((prev) => [...prev, "> generation failed."]);
        await delay(800);
      } finally {
        setIsGenerating(false);
        setShowTerminal(false);
      }
    };

    runTerminal();
  }, [showTerminal]); // eslint-disable-line react-hooks/exhaustive-deps

  const downloadSecretKey = () => {
    if (!signupData?.secretKey) return;
    const blob = new Blob([signupData.secretKey], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `secretkey-${signupData.anonymousId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const continueToSystem = () => {
    clearSignupData();
    navigate("/");
  };

  // ======================
  // TERMINAL SCREEN
  // ======================
  if (showTerminal) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <MatrixRain className="opacity-30" />
        <div className="relative w-full max-w-2xl mx-4">
          <div className="absolute inset-0 bg-pink-500/5 blur-3xl" />
          <div className="relative bg-black border border-pink-500/30 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/20">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/10 bg-pink-500/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-pink-500/70" />
              <div className="ml-2 text-xs text-pink-400/60 font-mono">
                bash:identity-generation
              </div>
            </div>

            {/* Terminal content */}
            <div className="relative p-6 font-mono text-pink-400 text-lg min-h-[300px]">
              <div className="scanlines absolute inset-0 pointer-events-none" />
              <div className="noise absolute inset-0 pointer-events-none" />

              <pre className="whitespace-pre-wrap leading-relaxed">
                {executionLogs.join("\n")}
                <span className="terminal-cursor animate-pulse">█</span>
              </pre>
            </div>
          </div>
        </div>

        <style jsx>{`
          .scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0) 2px,
              transparent 3px
            );
            pointer-events: none;
          }
          .noise {
            background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 4px 4px;
            opacity: 0.1;
          }
          .terminal-cursor {
            display: inline-block;
            width: 0.6em;
            height: 1.2em;
            background-color: #f472b6;
            vertical-align: middle;
            margin-left: 4px;
            animation: blink 1s infinite;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // ======================
  // STEP 2 UI - ACCESS GRANTED
  // ======================
  if (step === 2 && signupData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-pink-500 relative overflow-hidden">
        <MatrixRain className="opacity-20" />
        <div className="card w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl border border-pink-500/30 relative z-10 shadow-pink-500/10">
          <div className="card-body">
            <h2 className="text-xl font-bold text-center mb-4 text-pink-500">
              Identity Mesh-Protocol
            </h2>
            <p className="text-pink-400 text-center mb-2 font-mono">ACCESS GRANTED</p>
            <pre className="bg-black/50 p-2 rounded border border-pink-500 mb-2 break-all text-pink-400">
              Anonymous ID: {signupData.anonymousId}
              {"\n"}Display Name: {signupData.displayName}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={downloadSecretKey}
                className="btn btn-outline btn-pink flex-1 border-pink-500 text-pink-500 hover:bg-pink-500/10"
              >
                Download Key
              </button>
              <button
                onClick={continueToSystem}
                className="btn btn-pink flex-1 bg-pink-600 hover:bg-pink-700 border-pink-500 text-white"
              >
                Continue
              </button>
            </div>
            <p className="text-xs mt-2 text-pink-300">
              Secret key automatically copied to clipboard
            </p>
            {error && (
              <div className="alert alert-error mt-2 bg-red-500/10 border-red-500/30 text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ======================
  // STEP 1 UI - GENERATE
  // ======================
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-pink-500 relative overflow-hidden">
      <MatrixRain className="opacity-20" />
      <div className="card w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl border border-pink-500/30 relative z-10 shadow-pink-500/10">
        <div className="card-body">
          <h2 className="text-xl font-bold text-center mb-4 text-pink-500">
            Identity Mesh-Protocol
          </h2>
          <button
            onClick={handleGenerate}
            className="btn btn-outline btn-pink w-full border-pink-500 text-pink-500 hover:bg-pink-500/10"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Identity"}
          </button>
          {error && (
            <div className="alert alert-error mt-2 bg-red-500/10 border-red-500/30 text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
