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
    authUser,
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
      await signup();
      setDisplayNameInput(authUser?.displayName || "Anonymous");
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

  const enterSystem = () => {
    clearSignupData();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center relative overflow-hidden">

      {/* Matrix Background */}
      <div className="matrix-bg"></div>

      {showAnimation && (
        <TerminalAnimation onComplete={handleAnimationComplete} />
      )}

      <div className="card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-primary/30 relative z-10">
        <div className="card-body">

          {/* Header */}
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
              <div key={label} className="flex-1 text-center relative">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border
                  ${
                    step >= idx + 1
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-content/20 opacity-40"
                  }`}
                >
                  {idx + 1}
                </div>

                <p className="mt-1 opacity-70">{label}</p>

                {idx !== 2 && (
                  <div className="absolute top-4 right-0 w-full h-px bg-base-content/10"></div>
                )}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm opacity-70 text-center">
                Generate your secure anonymous identity
              </p>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn btn-primary w-full"
              >
                {isGenerating ? "Generating..." : "Generate Secret Identity"}
              </button>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="divider text-xs opacity-40">
                ALREADY HAVE A KEY?
              </div>

              <Link
                to="/login"
                className="btn btn-outline btn-secondary w-full"
              >
                Access Existing Identity
              </Link>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && signupData && (
            <div className="space-y-4">

              <div>
                <p className="text-warning text-sm font-semibold">
                  Secret Key (SAVE THIS)
                </p>

                <div className="bg-base-300 p-3 rounded-lg font-mono text-xs break-all border border-warning/30">
                  {signupData.secretKey}
                </div>

                <button
                  onClick={copyToClipboard}
                  className="btn btn-xs btn-outline mt-2"
                >
                  Copy Key
                </button>
              </div>

              <form onSubmit={handleUpdateDisplayName} className="space-y-2">
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="Display name"
                  className="input input-bordered w-full"
                  maxLength={20}
                />

                <button
                  disabled={isUpdating}
                  className="btn btn-primary w-full"
                >
                  {isUpdating ? "Updating..." : "Continue"}
                </button>
              </form>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="divider text-xs opacity-30">OR</div>

              <Link
                to="/login"
                className="btn btn-ghost btn-sm w-full"
              >
                I already have an identity
              </Link>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && signupData && (
            <div className="text-center space-y-3">

              <h3 className="text-success font-bold">
                Identity Activated
              </h3>

              <div className="bg-base-300 rounded-lg p-3">
                <p className="text-xs opacity-60">Anonymous ID</p>
                <p className="text-xl font-bold text-primary">
                  {signupData.anonymousId}
                </p>
              </div>

              <button
                onClick={enterSystem}
                className="btn btn-primary w-full"
              >
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