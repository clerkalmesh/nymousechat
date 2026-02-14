
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import TerminalAnimation from "../components/TerminalAnimation";

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    signup,
    signupData,
    clearSignupData,
    updateDisplayName,
    checkAuth,
  } = useAuthStore();

  const [step, setStep] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = () => {
    setError("");
    setShowAnimation(true);
    setIsGenerating(true);
  };

  const handleAnimationComplete = async () => {
    setShowAnimation(false);

    try {
      const data = await signup();
      setDisplayNameInput(data.displayName || "Anonymous");
      setStep(2);
    } catch {
      setError("Gagal membuat identitas.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(signupData.secretKey);
    alert("Secret key disalin");
  };

  const handleUpdateDisplayName = async (e) => {
    e.preventDefault();

    if (!displayNameInput.trim()) {
      setError("Display name tidak boleh kosong");
      return;
    }

    setError("");
    setIsUpdating(true);

    try {
      await updateDisplayName(displayNameInput);
      setStep(3);
    } catch {
      setError("Gagal update display name");
    } finally {
      setIsUpdating(false);
    }
  };

  const enterSystem = async () => {
    await checkAuth();
    clearSignupData();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center relative overflow-hidden">
      <div className="matrix-bg"></div>

      {showAnimation && (
        <TerminalAnimation onComplete={handleAnimationComplete} />
      )}

      <div className="card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-primary/20 relative z-10">
        <div className="card-body">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-primary">
              Identity Protocol
            </h2>
            <p className="text-xs opacity-60">
              Anonymous Key-Based Authentication
            </p>
          </div>

          {/* Steps */}
          <div className="flex justify-between mt-4 mb-6 text-xs">
            {["Generate", "Secure", "Activate"].map((label, idx) => (
              <div key={label} className="flex-1 text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border ${
                    step >= idx + 1
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-content/20 opacity-40"
                  }`}
                >
                  {idx + 1}
                </div>
                <p className="mt-1 opacity-70">{label}</p>
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn btn-primary w-full"
              >
                {isGenerating ? "Generating..." : "Generate Secret Identity"}
              </button>

              {error && <div className="alert alert-error">{error}</div>}

              <Link to="/login" className="btn btn-outline w-full">
                Access Existing Identity
              </Link>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && signupData && (
            <div className="space-y-4">
              <div className="bg-base-300 p-3 rounded-lg font-mono text-xs break-all">
                {signupData.secretKey}
              </div>

              <button onClick={copyToClipboard} className="btn btn-xs">
                Copy Key
              </button>

              <form onSubmit={handleUpdateDisplayName} className="space-y-2">
                <input
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className="input input-bordered w-full"
                  maxLength={20}
                />
                <button className="btn btn-primary w-full">
                  {isUpdating ? "Updating..." : "Continue"}
                </button>
              </form>

              {error && <div className="alert alert-error">{error}</div>}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && signupData && (
            <div className="text-center space-y-3">
              <p className="text-success font-bold">Identity Activated</p>
              <p className="text-xl font-bold text-primary">
                {signupData.anonymousId}
              </p>

              <button onClick={enterSystem} className="btn btn-primary w-full">
                Enter System
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
