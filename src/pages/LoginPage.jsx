import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [secretKey, setSecretKey] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [error, setError] = useState("");

  // Utility to delay execution
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Typing effect for a single line
  const typeLine = async (line, speed = 40) => {
    let currentText = "";
    for (let i = 0; i < line.length; i++) {
      currentText += line[i];
      setExecutionLogs((prev) => [...prev.slice(0, -1), currentText]); // replace last line
      await delay(speed);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) return;

    setIsExecuting(true);
    setExecutionLogs([]);
    setError("");

    // Start terminal sequence
    setExecutionLogs(["$"]); // initial prompt

    // Type the command
    await typeLine("$ auth --verify", 60);
    await delay(200);

    // Output lines
    setExecutionLogs((prev) => [...prev, "> validating credentials..."]);
    await delay(600);
    setExecutionLogs((prev) => [...prev, "> comparing secure hash..."]);
    await delay(600);

    try {
      await login(secretKey);

      setExecutionLogs((prev) => [...prev, "> identity verified..."]);
      await delay(400);
      setExecutionLogs((prev) => [...prev, "> access granted."]);
      await delay(900);
      navigate("/");
    } catch {
      setExecutionLogs((prev) => [...prev, "> access denied."]);
      await delay(400);
      setExecutionLogs((prev) => [...prev, "> invalid secret key."]);
      setError("Secret key tidak valid");
      setIsExecuting(false);
    }
  };

  // ======================
  // EXECUTION SCREEN (Terminal)
  // ======================
  if (isExecuting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <MatrixRain className="opacity-30" /> {/* Pink rain in background */}
        <div className="relative w-full max-w-2xl mx-4">
          <div className="absolute inset-0 bg-pink-500/5 blur-3xl" />
          <div className="relative bg-black border border-pink-500/30 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/20">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/10 bg-pink-500/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-pink-500/70" />
              <div className="ml-2 text-xs text-pink-400/60 font-mono">
                bash:mesh-authentication
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

        {/* Extra styles for scanlines and cursor */}
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
  // LOGIN FORM (Normal UI)
  // ======================
  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center relative overflow-hidden">
      <MatrixRain className="opacity-20" /> {/* Pink matrix behind form */}

      <div className="card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-pink-500/30 relative z-10 shadow-pink-500/10">
        <div className="card-body">
          {/* Header */}
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-2xl font-bold text-pink-500">
              Mesh Protocols Chat
            </h2>
            <p className="text-xs opacity-60">Access via Secret Key</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs opacity-60">Secret Key</label>
              <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="input input-bordered w-full font-mono focus:border-pink-500 focus:ring-pink-500/30"
                placeholder="Enter your secret key"
                autoFocus
              />
            </div>

            {error && (
              <div className="alert alert-error text-sm bg-red-500/10 border-red-500/30 text-red-400">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-pink w-full bg-pink-600 hover:bg-pink-700 border-pink-500 text-white"
            >
              Run Authenticate
            </button>
          </form>

          <div className="divider text-xs opacity-40">OR</div>

          <Link
            to="/signup"
            className="btn btn-outline btn-pink w-full border-pink-500 text-pink-500 hover:bg-pink-500/10"
          >
            Generate New Identity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
