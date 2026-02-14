import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import TerminalAnimation from "../components/TerminalAnimation";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData } = useAuthStore();

  const [step, setStep] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = () => {
    setError("");
    setShowAnimation(true);
    setIsGenerating(true);
  };

  const handleAnimationComplete = async () => {
    setShowAnimation(false);

    try {
      await signup();
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Identity generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyKey = () => {
    if (!signupData?.secretKey) return;
    navigator.clipboard.writeText(signupData.secretKey);
  };

  const downloadKey = () => {
    if (!signupData?.secretKey) return;

    const blob = new Blob([signupData.secretKey], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "secret-key.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const continueToApp = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center relative overflow-hidden">
      
      {/* Background matrix effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.15),transparent_70%)]" />

      {showAnimation && (
        <TerminalAnimation onComplete={handleAnimationComplete} />
      )}

      <div className="w-full max-w-md border border-green-500/30 bg-black/80 backdrop-blur-xl shadow-2xl rounded-lg">
        <div className="p-6 space-y-4">

          <h1 className="text-center text-xl font-bold tracking-widest">
            IDENTITY PROTOCOL
          </h1>

          {step === 1 && (
            <>
              <div className="text-xs opacity-60 text-center">
                Initialize anonymous identity
              </div>

              <button
                onClick={handleGenerate}
                className="w-full border border-green-500/40 hover:bg-green-500/10 transition-all py-2 rounded"
              >
                {isGenerating ? "GENERATING..." : "GENERATE IDENTITY"}
              </button>

              {error && (
                <div className="text-red-500 text-xs text-center">
                  {error}
                </div>
              )}
            </>
          )}

          {step === 2 && signupData && (
            <>
              <div className="text-xs opacity-60">
                Secret Key (store safely)
              </div>

              <div className="border border-green-500/30 bg-black p-3 text-xs break-all rounded">
                {signupData.secretKey}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyKey}
                  className="flex-1 border border-green-500/40 hover:bg-green-500/10 py-2 rounded text-xs"
                >
                  COPY
                </button>

                <button
                  onClick={downloadKey}
                  className="flex-1 border border-green-500/40 hover:bg-green-500/10 py-2 rounded text-xs"
                >
                  DOWNLOAD
                </button>
              </div>

              <button
                onClick={continueToApp}
                className="w-full mt-2 bg-green-500/10 border border-green-500/40 hover:bg-green-500/20 py-2 rounded"
              >
                CONTINUE
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
