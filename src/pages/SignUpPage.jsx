// pages/SignUpPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import MatrixRain from '../components/MatrixRain';
import { audioManager } from "../lib/audioManager";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, clearSignupData } = useAuthStore();
  const [step, setStep] = useState(1);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
 
  useEffect(() => {
    audioManager.playBgm("boot");   // MUSIK START LOOP

    return () => {
      audioManager.stopBgm();       // STOP saat keluar page
    };
  }, []);

  const typeLine = async (line, speed = 40) => {
    let currentText = '';
    for (let i = 0; i < line.length; i++) {
      currentText += line[i];
      setExecutionLogs((prev) => [...prev.slice(0, -1), currentText]);
      await delay(speed);
    }
  };

  const handleGenerate = () => {
    setError('');
    setShowTerminal(true);
    setIsGenerating(true);
    setExecutionLogs(['$']);
  };

  useEffect(() => {
    if (!showTerminal) return;

    const runTerminal = async () => {
      await typeLine('$ generate-identity --secure', 50);
      await delay(300);

      const steps = [
        { text: '> initializing identity protocol...', color: 'text-cyan-400' },
        { text: '> gathering entropy...', color: 'text-yellow-400' },
        { text: '> generating cryptographic salts...', color: 'text-orange-400' },
        { text: '> deriving key pairs (4096-bit RSA)...', color: 'text-purple-400' },
        { text: '> encrypting identity bundle...', color: 'text-blue-400' },
        { text: '> hashing with PBKDF2...', color: 'text-indigo-400' },
        { text: '> signing identity certificate...', color: 'text-pink-400' },
        { text: '> validating signature...', color: 'text-green-400' },
        { text: '> persisting to secure store...', color: 'text-red-400' },
        { text: '> finalizing...', color: 'text-teal-400' },
      ];

      for (const step of steps) {
        setExecutionLogs((prev) => [...prev, step.text]);
        await delay(1200);
      }

      try {
        const data = await signup();
        setExecutionLogs((prev) => [...prev, '> secret key generated.']);
        await delay(600);
        setExecutionLogs((prev) => [...prev, '> identity created successfully.']);
        await delay(800);

        if (data?.secretKey) {
          await navigator.clipboard.writeText(data.secretKey);
          setCopySuccess('Secret key copied to clipboard!');
          setTimeout(() => setCopySuccess(''), 3000);
        }
        setStep(2);
      } catch (err) {
        console.error(err);
        setError('Failed to generate identity');
        setExecutionLogs((prev) => [...prev, '> generation failed.']);
        await delay(800);
      } finally {
        setIsGenerating(false);
        setShowTerminal(false);
      }
    };

    runTerminal();
  }, [showTerminal, signup]);

  const downloadSecretKey = () => {
    if (!signupData?.secretKey) return;
    const blob = new Blob([signupData.secretKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secretkey-${signupData.anonymousId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySecretKey = async () => {
    if (!signupData?.secretKey) return;
    try {
      await navigator.clipboard.writeText(signupData.secretKey);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const continueToSystem = () => {
    clearSignupData();
    navigate('/');
  };

  // Render konten berdasarkan state
  let content;

  if (showTerminal) {
    const lines = executionLogs.map((line, idx) => {
      let colorClass = 'text-green-400';
      if (line.startsWith('$')) colorClass = 'text-yellow-300';
      else if (line.includes('initializing')) colorClass = 'text-cyan-400';
      else if (line.includes('entropy')) colorClass = 'text-yellow-400';
      else if (line.includes('salts')) colorClass = 'text-orange-400';
      else if (line.includes('key pairs')) colorClass = 'text-purple-400';
      else if (line.includes('encrypting')) colorClass = 'text-blue-400';
      else if (line.includes('hashing')) colorClass = 'text-indigo-400';
      else if (line.includes('signing')) colorClass = 'text-pink-400';
      else if (line.includes('validating signature')) colorClass = 'text-green-400';
      else if (line.includes('persisting')) colorClass = 'text-red-400';
      else if (line.includes('finalizing')) colorClass = 'text-teal-400';
      else if (line.includes('secret key generated')) colorClass = 'text-green-300';
      else if (line.includes('identity created')) colorClass = 'text-green-300 font-bold';
      else if (line.includes('generation failed')) colorClass = 'text-red-500';

      return (
        <div key={idx} className={colorClass}>
          {line}
        </div>
      );
    });

    content = (
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-2xl mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="relative bg-gray-900/90 backdrop-blur-sm border border-pink-500/40 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/30">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-2 text-xs text-pink-300/80 font-mono">
                memesh@identity:~ generated_user_anonymouse.py
              </div>
            </div>
            <div className="relative p-6 font-mono text-lg min-h-[350px] max-h-[500px] overflow-y-auto">
              <div className="scanlines absolute inset-0 pointer-events-none" />
              <div className="noise absolute inset-0 pointer-events-none" />
              <pre className="whitespace-pre-wrap leading-relaxed">
                {lines}
                <span className="terminal-cursor animate-pulse">█</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (step === 2 && signupData) {
    content = (
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-md mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="relative bg-gray-900/90 backdrop-blur-sm border border-pink-500/40 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/30 p-8">
            <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Identity_Generated.sh
            </h2>
            <p className="text-center text-pink-300/70 text-sm mb-6">
              ACCESS MEMESH PROTOCOLS
            </p>

            <div className="bg-gray-800/80 p-3 rounded border border-purple-500/50 space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-300 text-xs">Anonymous ID</span>
                <span className="text-pink-300 font-mono text-sm">{signupData.anonymousId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 text-xs">Display Name</span>
                <span className="text-pink-300 font-mono text-sm">{signupData.displayName}</span>
              </div>
            </div>

            <div className="bg-gray-800/80 p-3 rounded border border-purple-500/50 mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-purple-300 text-xs">Secret Key</span>
                <button
                  onClick={copySecretKey}
                  className="text-pink-400 hover:text-pink-300 text-xs flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  {copySuccess ? copySuccess : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-sm text-pink-300 break-all bg-gray-900 p-2 rounded border border-purple-500/30">
                {signupData.secretKey}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={downloadSecretKey}
                className="btn btn-outline flex-1 border-purple-500 text-purple-300 hover:bg-purple-500/10"
              >
                Download Key
              </button>
              <button
                onClick={continueToSystem}
                className="btn flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white"
              >
                Continue
              </button>
            </div>

            <p className="text-xs text-center text-purple-300/70 mt-4">
              Secret key was automatically copied to clipboard during generation.
            </p>

            {error && (
              <div className="alert alert-error mt-2 bg-red-500/10 border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* CTA Login */}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-pink-400 hover:text-pink-300 text-sm underline underline-offset-2">
                Already have an identity? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-md mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="relative bg-gray-900/90 backdrop-blur-sm border border-pink-500/40 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/30 p-8">
            <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Identity Mesh-Protocol
            </h2>
            <p className="text-center text-pink-300/70 text-sm mb-6">Generate a new anonymous identity</p>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white font-mono mb-4"
            >
              {isGenerating ? 'Generating...' : 'Generate Identity'}
            </button>

            {error && (
              <div className="alert alert-error mt-2 bg-red-500/10 border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* CTA Login */}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-pink-400 hover:text-pink-300 text-sm underline underline-offset-2">
                Already have an identity? Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MatrixRain />
      {content}

      {/* Global styles untuk efek terminal (scanlines, noise, cursor) */}
      <style jsx global>{`
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(255, 255, 255, 0) 2px,
            transparent 3px
          );
          pointer-events: none;
        }
        .noise {
          background-image: radial-gradient(rgba(255, 200, 255, 0.15) 1px, transparent 1px);
          background-size: 4px 4px;
          opacity: 0.2;
        }
        .terminal-cursor {
          display: inline-block;
          width: 0.6em;
          height: 1.2em;
          background-color: #ff88cc;
          vertical-align: middle;
          margin-left: 4px;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default SignUpPage;