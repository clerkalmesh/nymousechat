import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import TerminalAnimation from '../components/TerminalAnimation';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, clearSignupData, updateDisplayName, authUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = async () => {
    setShowAnimation(false);
    try {
      await signup();
      setDisplayNameInput(authUser?.displayName || 'Anonymous');
      setStep(2);
    } catch (err) {
      setError('Gagal membuat identitas');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(signupData.secretKey);
    // Bisa gunakan toast, tapi untuk sederhana pakai alert
    alert('Secret key disalin!');
  };

  const handleUpdateDisplayName = async (e) => {
    e.preventDefault();
    if (!displayNameInput.trim()) {
      setError('Display name tidak boleh kosong');
      return;
    }
    setIsUpdating(true);
    setError('');
    try {
      await updateDisplayName(displayNameInput);
      setStep(3);
    } catch (err) {
      setError('Gagal mengupdate display name');
    } finally {
      setIsUpdating(false);
    }
  };

  const enterSystem = () => {
    clearSignupData();
    navigate('/');
  };

  // Menentukan step yang aktif untuk komponen Steps
  const steps = [
    { title: 'Generate', description: 'Buat kunci' },
    { title: 'Simpan & Nama', description: 'Simpan key & nama' },
    { title: 'Aktif', description: 'Selesai' }
  ];

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      {showAnimation && <TerminalAnimation onComplete={handleAnimationComplete} />}

      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-primary">
        <div className="card-body">
          {/* Steps */}
          <ul className="steps steps-vertical lg:steps-horizontal w-full mb-6">
            {steps.map((s, idx) => (
              <li key={idx} className={`step ${idx + 1 <= step ? 'step-primary' : ''}`}>
                {s.title}
                <span className="step-description text-xs">{s.description}</span>
              </li>
            ))}
          </ul>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="card-title text-2xl justify-center text-primary">INITIALIZE IDENTITY PROTOCOL</h2>
              <div className="card-actions justify-center mt-4">
                <button
                  onClick={handleGenerate}
                  className="btn btn-primary btn-wide"
                >
                  Generate Secret Identity
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && signupData && (
            <>
              <h2 className="card-title text-2xl justify-center text-warning">⚠ STORE YOUR SECRET KEY ⚠</h2>
              <div className="bg-base-300 p-4 rounded-lg font-mono text-sm break-all border border-warning">
                {signupData.secretKey}
              </div>
              <button
                onClick={copyToClipboard}
                className="btn btn-outline btn-secondary btn-sm mt-2"
              >
                Copy Secret Key
              </button>

              <form onSubmit={handleUpdateDisplayName} className="mt-4 space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Display Name (opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="Anonymous"
                    className="input input-bordered w-full"
                    maxLength={20}
                  />
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary w-full"
                >
                  {isUpdating ? 'Updating...' : 'Continue'}
                </button>
              </form>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && signupData && (
            <>
              <h2 className="card-title text-2xl justify-center text-success">✓ IDENTITY ACTIVATED</h2>
              <div className="text-center space-y-2">
                <p>Anonymous ID:</p>
                <p className="text-3xl font-bold text-primary">{signupData.anonymousId}</p>
                <p>Display Name: {authUser?.displayName}</p>
              </div>
              <div className="card-actions justify-center mt-4">
                <button
                  onClick={enterSystem}
                  className="btn btn-primary btn-wide"
                >
                  Enter System
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;