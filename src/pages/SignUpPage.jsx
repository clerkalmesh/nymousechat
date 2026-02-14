import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import TerminalAnimation from "../components/TerminalAnimation";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, updateDisplayName, clearSignupData } = useAuthStore();

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
    } catch (err) {
      console.error(err);
      setError("Gagal membuat identitas.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!signupData?.secretKey) return;
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
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-base-300 flex items-center justify-center">
      {showAnimation && <TerminalAnimation onComplete={handleAnimationComplete} />}

      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-xl font-bold text-center">Identity Protocol</h2>

          {step === 1 && (
            <>
              <button onClick={handleGenerate} className="btn btn-primary w-full">
                {isGenerating ? "Generating..." : "Generate Identity"}
              </button>

              {error && <div className="alert alert-error">{error}</div>}

              <Link to="/login" className="btn btn-outline w-full">
                Login Existing Identity
              </Link>
            </>
          )}

          {step === 2 && signupData && (
            <>
              <div className="bg-base-300 p-2 rounded text-xs break-all">
                {signupData.secretKey}
              </div>

              <button onClick={copyToClipboard} className="btn btn-xs">
                Copy Key
              </button>

              <form onSubmit={handleUpdateDisplayName}>
                <input
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className="input input-bordered w-full"
                  maxLength={20}
                />

                <button className="btn btn-primary w-full mt-2">
                  {isUpdating ? "Saving..." : "Activate"}
                </button>
              </form>

              {error && <div className="alert alert-error">{error}</div>}
            </>
          )}

          {step === 3 && signupData && (
            <>
              <p className="text-success text-center">Identity Activated</p>
              <p className="text-center font-bold">{signupData.anonymousId}</p>

              <button onClick={enterSystem} className="btn btn-primary w-full">
                Enter System
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
