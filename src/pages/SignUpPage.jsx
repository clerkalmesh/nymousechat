import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import TerminalAnimation from "../components/TerminalAnimation";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, clearSignupData } = useAuthStore();

  const [showAnimation, setShowAnimation] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState("");

  const handleAnimationComplete = async () => {
    // Animation selesai, baru generate identity
    try {
      const data = await signup();
      setIsGenerating(false);
      // Copy otomatis
      if (data?.secretKey) navigator.clipboard.writeText(data.secretKey);
    } catch (err) {
      console.error(err);
      setError("Gagal membuat identitas.");
      setIsGenerating(false);
    }
    setShowAnimation(false);
  };

  const copyToClipboard = () => {
    if (!signupData?.secretKey) return;
    navigator.clipboard.writeText(signupData.secretKey);
    alert("Secret key disalin");
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

  const enterSystem = () => {
    clearSignupData();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono relative overflow-hidden">
      {/* Terminal Animation */}
      {showAnimation && <TerminalAnimation onComplete={handleAnimationComplete} />}

      {!showAnimation && signupData && (
        <div className="card w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl border border-red-500/30 relative z-10">
          <div className="card-body text-red-500">
            <h2 className="text-xl font-bold text-center mb-4">Identity Protocol</h2>

            <pre className="whitespace-pre-wrap leading-relaxed text-red-400 bg-black p-2 rounded border border-red-500 mb-2 break-all">
              Anonymous ID: {signupData.anonymousId}
              {"\n"}Secret Key: {signupData.secretKey}
            </pre>

            <div className="flex gap-2 mb-2">
              <button onClick={copyToClipboard} className="btn btn-xs btn-error">
                Copy Key
              </button>
              <button onClick={downloadSecretKey} className="btn btn-xs btn-error">
                Download Key
              </button>
              <button onClick={enterSystem} className="btn btn-xs btn-error">
                Continue
              </button>
            </div>

            <p className="text-xs text-red-300">
              SecretKey sudah otomatis disalin ke clipboard
            </p>

            {error && <div className="alert alert-error mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
