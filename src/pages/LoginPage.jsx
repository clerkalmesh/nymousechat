import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [secretKey, setSecretKey] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) return;

    setIsExecuting(true);
    setExecutionLogs([]);
    setError("");

    const logs = [
      "> validating credentials...",
      "> comparing secure hash...",
    ];

    setExecutionLogs([logs[0]]);

    setTimeout(() => {
      setExecutionLogs([logs[0], logs[1]]);
    }, 600);

    setTimeout(async () => {
      try {
        await login(secretKey);

        setExecutionLogs((prev) => [
          ...prev,
          "> identity verified...",
          "> access granted.",
        ]);

        setTimeout(() => navigate("/"), 900);
      } catch {
        setExecutionLogs((prev) => [
          ...prev,
          "> access denied.",
          "> invalid secret key.",
        ]);

        setError("Secret key tidak valid");
        setIsExecuting(false);
      }
    }, 1300);
  };

  /* EXECUTION SCREEN */
  if (isExecuting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="relative w-full max-w-2xl mx-4">

          <div className="absolute inset-0 bg-green-500/5 blur-3xl"></div>

          <div className="relative bg-black border border-green-500/30 rounded-xl shadow-2xl overflow-hidden">

            <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/10 bg-green-500/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
              <div className="ml-2 text-xs text-green-400/60 font-mono">
                authentication-terminal
              </div>
            </div>

            <div className="relative p-6 font-mono text-green-400 text-lg">
              <div className="scanlines absolute inset-0"></div>
              <div className="noise absolute inset-0"></div>

              <pre className="whitespace-pre-wrap leading-relaxed">
                {executionLogs.join("\n")}
                <span className="terminal-cursor">█</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* NORMAL UI */
  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center relative overflow-hidden">

      <div className="matrix-bg"></div>

      <div className="card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-primary/30 relative z-10">

        <div className="card-body">

          {/* Header */}
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-2xl font-bold text-primary">
              Terminal Authentication
            </h2>
            <p className="text-xs opacity-60">
              Access via Secret Key
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">

            <div>
              <label className="text-xs opacity-60">Secret Key</label>
              <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="input input-bordered w-full font-mono"
                placeholder="Enter your secret key"
                autoFocus
              />
            </div>

            {error && (
              <div className="alert alert-error text-sm">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full">
              Authenticate
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-xs opacity-40">OR</div>

          {/* Bottom CTA */}
          <Link
            to="/signup"
            className="btn btn-outline btn-secondary w-full"
          >
            Generate New Identity
          </Link>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;