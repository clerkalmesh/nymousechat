import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import TerminalAnimation from "../components/TerminalAnimation";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, clearSignupData } = useAuthStore();

  const [step, setStep] = useState(1);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [error, setError] = useState("");

  const handleGenerate = () => {
    setError("");
    setShowTerminal(true);
    setIsGenerating(true);
    setExecutionLogs(["> initializing identity protocol..."]);
  };

  const handleAnimationComplete = async () => {
    setExecutionLogs((prev) => [...prev, "> generating secret key..."]);
    try {
      const data = await signup();
      setExecutionLogs((prev) => [
        ...prev,
        "> secret key generated.",
        "> identity created successfully."
      ]);
      setStep(2); // Step 2 muncul, **tidak auto redirect**
      if (data?.secretKey) navigator.clipboard.writeText(data.secretKey); // Auto copy
    } catch (err) {
      console.error(err);
      setError("Failed to generate identity");
      setExecutionLogs((prev) => [...prev, "> generation failed."]);
    } finally {
      setIsGenerating(false);
      setShowTerminal(false);
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
    navigate("/"); // Redirect hanya **klik Continue**
  };

  /* TERMINAL SCREEN */
  if (showTerminal) {
    return <TerminalAnimation onComplete={handleAnimationComplete} logs={executionLogs} />;
  }

  /* STEP 2 UI - ACCESS GRANTED */
  if (step === 2 && signupData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-500 relative">
        <div className="matrix-bg absolute inset-0"></div>
        <div className="card w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl border border-red-500/30 relative z-10">
          <div className="card-body">
            <h2 className="text-xl font-bold text-center mb-4">Identity Protocol</h2>
            <p className="text-red-400 text-center mb-2 font-mono">ACCESS GRANTED</p>
            <pre className="bg-black p-2 rounded border border-red-500 mb-2 break-all text-red-400">
              Anonymous ID: {signupData.anonymousId}
              {"\n"}Display Name: {signupData.displayName}
            </pre>
            <div className="flex gap-2">
              <button onClick={downloadSecretKey} className="btn btn-xs btn-error">
                Download Key
              </button>
              <button onClick={continueToSystem} className="btn btn-xs btn-error">
                Continue
              </button>
            </div>
            <p className="text-xs mt-2 text-red-300">
              SecretKey sudah otomatis disalin ke clipboard
            </p>
            {error && <div className="alert alert-error mt-2">{error}</div>}
          </div>
        </div>
      </div>
    );
  }

  /* STEP 1 UI - Generate */
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-500 relative">
      <div className="matrix-bg absolute inset-0"></div>
      <div className="card w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl border border-red-500/30 relative z-10">
        <div className="card-body">
          <h2 className="text-xl font-bold text-center mb-4">Identity Protocol</h2>
          <button
            onClick={handleGenerate}
            className="btn btn-outline btn-error w-full"
          >
            {isGenerating ? "Generating..." : "Generate Identity"}
          </button>
          {error && <div className="alert alert-error mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
