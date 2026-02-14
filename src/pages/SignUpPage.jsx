import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// ======================
// Matrix Rain Canvas – Satu untuk seluruh halaman
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

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
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
  const [copySuccess, setCopySuccess] = useState("");

  // Typing effect utilities
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const typeLine = async (line, speed = 40) => {
    let currentText = "";
    for (let i = 0; i < line.length; i++) {
      currentText += line[i];
      setExecutionLogs((prev) => [...prev.slice(0, -1), currentText]);
      await delay(speed);
    }
  };

  const handleGenerate = () => {
    setError("");
    setShowTerminal(true);
    setIsGenerating(true);
    setExecutionLogs(["$"]);
  };

  useEffect(() => {
    if (!showTerminal) return;

    const runTerminal = async () => {
      await typeLine("$ generate-identity --secure", 60);
      await delay(300);

      setExecutionLogs((prev) => [...prev, "> initializing identity protocol..."]);
      await delay(1200);
      setExecutionLogs((prev) => [...prev, "> gathering entropy..."]);
      await delay(1000);
      setExecutionLogs((prev) => [...prev, "> generating cryptographic salts..."]);
      await delay(1300);
      setExecutionLogs((prev) => [...prev, "> deriving key pairs (4096-bit RSA)..."]);
      await delay(1800);
      setExecutionLogs((prev) => [...prev, "> encrypting identity bundle..."]);
      await delay(1500);
      setExecutionLogs((prev) => [...prev, "> hashing with PBKDF2..."]);
      await delay(1400);
      setExecutionLogs((prev) => [...prev, "> signing identity certificate..."]);
      await delay(1600);
      setExecutionLogs((prev) => [...prev, "> validating signature..."]);
      await delay(1200);
      setExecutionLogs((prev) => [...prev, "> persisting to secure store..."]);
      await delay(1300);

      try {
        const data = await signup();
        setExecutionLogs((prev) => [...prev, "> secret key generated."]);
        await delay(600);
        setExecutionLogs((prev) => [...prev, "> identity created successfully."]);
        await delay(800);

        if (data?.secretKey) {
          await navigator.clipboard.writeText(data.secretKey);
          setCopySuccess("Secret key copied to clipboard!");
          setTimeout(() => setCopySuccess(""), 3000);
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

  const copySecretKey = async () => {
    if (!signupData?.secretKey) return;
    try {
      await navigator.clipboard.writeText(signupData.secretKey);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  const continueToSystem = () => {
    clearSignupData();
    navigate("/");
  };

  // ======================
  // Render konten berdasarkan state
  // ======================
  let content;
  if (showTerminal) {
    content = (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-2xl mx-4">
          <div className="absolute inset-0 bg-pink-500/5 blur-3xl" />
          <div className="relative bg-black border border-pink-500/30 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/20">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/10 bg-pink-500/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-pink-500/70" />
              <div className="ml-2 text-xs text-pink-400/60 font-mono">
                bash:identity-generation (15s simulation)
              </div>
            </div>

            {/* Terminal content */}
            <div className="relative p-6 font-mono text-pink-400 text-lg min-h-[350px]">
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
  } else if (step === 2 && signupData) {
    content = (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl border border-pink-500/30 relative z-10 shadow-pink-500/10">
          <div className="card-body space-y-4">
            <h2 className="text-xl font-bold text-center text-pink-500">
              Identity Mesh-Protocol
            </h2>
            <p className="text-pink-400 text-center font-mono">ACCESS GRANTED</p>

            <div className="bg-black/50 p-3 rounded border border-pink-500 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-pink-300 text-xs">Anonymous ID</span>
                <span className="text-pink-400 font-mono text-sm">{signupData.anonymousId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-pink-300 text-xs">Display Name</span>
                <span className="text-pink-400 font-mono text-sm">{signupData.displayName}</span>
              </div>
            </div>

            <div className="bg-black/50 p-3 rounded border border-pink-500">
              <div className="flex justify-between items-center mb-1">
                <span className="text-pink-300 text-xs">Secret Key</span>
                <button
                  onClick={copySecretKey}
                  className="text-pink-400 hover:text-pink-300 text-xs flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {copySuccess ? copySuccess : "Copy"}
                </button>
              </div>
              <div className="font-mono text-sm text-pink-400 break-all bg-black p-2 rounded border border-pink-500/30">
                {signupData.secretKey}
              </div>
            </div>

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

            <p className="text-xs text-center text-pink-300">
              Secret key was automatically copied to clipboard during generation.
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
  } else {
    content = (
      <div className="flex items-center justify-center min-h-screen">
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
  }

  return (
    <div className="relative min-h-screen bg-black font-mono text-pink-500 overflow-hidden">
      {/* Matrix background – satu untuk seluruh halaman */}
      <MatrixRain className="opacity-20" />
      {/* Konten di atas matrix */}
      {content}
    </div>
  );
};

export default SignUpPage;
