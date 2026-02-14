import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import TerminalAnimation from "../components/TerminalAnimation";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, clearSignupData } = useAuthStore();

  const [step, setStep] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [executionLogs, setExecutionLogs] = useState([]);

  const handleGenerate = () => {
    setError("");
    setShowAnimation(true);
    setIsGenerating(true);
    setExecutionLogs(["> initializing identity protocol..."]);
  };

  const handleAnimationComplete = async () => {
    setShowAnimation(false);
    setExecutionLogs((prev) => [...prev, "> generating secret key..."]);

    try {
      const data = await signup();

      setExecutionLogs((prev) => [
        ...prev,
        "> secret key generated.",
        "> identity created successfully."
      ]);

      setStep(2);

      // Copy otomatis
      if (data?.secretKey) {
        navigator.clipboard.writeText(data.secretKey);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate identity");
      setExecutionLogs((prev) => [...prev, "> generation failed."]);
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Optional: auto continue 3 detik
  useEffect(() => {
    if (step === 2 && signupData?.secretKey) {
      const timer = setTimeout(() => continueToSystem(), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, signupData]);

  /* EXECUTION SCREEN */
  if (isGenerating) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center font-mono text-green-400">
        <div className="relative w-full max-w-2xl mx-4">
          <div className="absolute inset-0 bg-green-500/5 blur-3xl"></div>
          <div className="relative bg-black border border-green-500/30 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-green-500/10 bg-green-500/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
              <div className="ml-2 text-xs text-green-400/60">identity-terminal</div>
            </div>
            <div className="relative p-6">
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
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center font-mono relative overflow-hidden">
      <div className="matrix-bg absolute inset-0"></div>

      <div className="card w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl border border-green-500/30 relative z-10">
        <div className="card-body">
          <h2 className="text-xl font-bold text-center mb-4">Identity Protocol</h2>

          {step === 1 && (
            <>
              <button
                onClick={handleGenerate}
                className="btn btn-outline btn-success w-full mb-2"
              >
                {isGenerating ? "Generating..." : "Generate Identity"}
              </button>
              {error && <div className="alert alert-error">{error}</div>}
            </>
          )}

          {step === 2 && signupData && (
            <>
              <p className="text-green-400 text-center mb-2">ACCESS GRANTED</p>
              <p className="text-sm break-all bg-black p-2 rounded border border-green-500 mb-2">
                Anonymous ID: {signupData.anonymousId}<br />
                Display Name: {signupData.displayName}
              </p>

              <div className="flex gap-2">
                <button onClick={downloadSecretKey} className="btn btn-xs btn-success">
                  Download Key
                </button>
                <button onClick={continueToSystem} className="btn btn-xs btn-success">
                  Continue
                </button>
              </div>

              <p className="text-xs mt-2 text-green-300">
                SecretKey copied to clipboard automatically
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
