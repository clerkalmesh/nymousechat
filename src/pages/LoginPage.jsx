// pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import MatrixRain from '../components/MatrixRain';
import { useAudioStore } from '../store/useAudioStore'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [secretKey, setSecretKey] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [error, setError] = useState('');

  const { play } = useAudioStore();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const typeLine = async (line, speed = 30) => {
    let currentText = '';
    for (let i = 0; i < line.length; i++) {
      currentText += line[i];
      setExecutionLogs((prev) => [...prev.slice(0, -1), currentText]);
      await delay(speed);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) return;

    setIsExecuting(true);
    setExecutionLogs([]);
    setError('');
    
    play();

    setExecutionLogs(['$']);
    await typeLine('$ auth --verify', 50);
    await delay(300);

    const steps = [
      { text: '> establishing secure channel...', color: 'text-cyan-400' },
      { text: '> requesting authentication challenge...', color: 'text-yellow-400' },
      { text: '> processing challenge response...', color: 'text-orange-400' },
      { text: '> verifying cryptographic signature...', color: 'text-purple-400' },
      { text: '> checking certificate revocation list...', color: 'text-blue-400' },
      { text: '> validating identity permissions...', color: 'text-indigo-400' },
      { text: '> comparing secure hash...', color: 'text-pink-400' },
      { text: '> validating credentials...', color: 'text-green-400' },
      { text: '> decrypting identity token...', color: 'text-red-400' },
      { text: '> finalizing authentication...', color: 'text-teal-400' },
    ];

    for (const step of steps) {
      setExecutionLogs((prev) => [...prev, step.text]);
      await delay(1000);
    }

    try {
      await login(secretKey);
      setExecutionLogs((prev) => [...prev, '> identity verified...']);
      await delay(600);
      setExecutionLogs((prev) => [...prev, '> access granted.']);
      await delay(900);
      navigate('/');
    } catch {
      setExecutionLogs((prev) => [...prev, '> access denied.']);
      await delay(400);
      setExecutionLogs((prev) => [...prev, '> invalid secret key.']);
      setError('Secret key tidak valid');
      setIsExecuting(false);
    }
  };

  let content;

  if (isExecuting) {
    const lines = executionLogs.map((line, idx) => {
      let colorClass = 'text-green-400';
      if (line.startsWith('$')) colorClass = 'text-yellow-300';
      else if (line.includes('secure channel')) colorClass = 'text-cyan-400';
      else if (line.includes('authentication challenge')) colorClass = 'text-yellow-400';
      else if (line.includes('challenge response')) colorClass = 'text-orange-400';
      else if (line.includes('cryptographic signature')) colorClass = 'text-purple-400';
      else if (line.includes('certificate revocation')) colorClass = 'text-blue-400';
      else if (line.includes('identity permissions')) colorClass = 'text-indigo-400';
      else if (line.includes('secure hash')) colorClass = 'text-pink-400';
      else if (line.includes('validating credentials')) colorClass = 'text-green-400';
      else if (line.includes('decrypting identity')) colorClass = 'text-red-400';
      else if (line.includes('finalizing')) colorClass = 'text-teal-400';
      else if (line.includes('identity verified')) colorClass = 'text-green-300';
      else if (line.includes('access granted')) colorClass = 'text-green-300 font-bold';
      else if (line.includes('access denied')) colorClass = 'text-red-500 font-bold';
      else if (line.includes('invalid secret')) colorClass = 'text-red-500';

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
                memesh@login:~ decrypted_secret_key.py
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
  } else {
    content = (
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-md mx-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="relative bg-gray-900/90 backdrop-blur-sm border border-pink-500/40 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/30 p-8">
            <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Memesh Protocols
            </h2>
            <p className="text-center text-pink-300/70 text-sm mb-6">Access via Secret Key</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-purple-300/80">Secret Key</label>
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="input input-bordered w-full font-mono bg-gray-800/80 border-purple-500/50 text-pink-300 placeholder-purple-700 focus:border-pink-400 focus:ring-pink-400/30"
                  placeholder="Enter your secret key"
                  autoFocus
                />
              </div>

              {error && (
                <div className="alert text-sm bg-red-500/10 border-red-500/30 text-red-400">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white font-mono"
              >
                authenticate
              </button>
            </form>

            <div className="divider text-xs text-purple-400/50">OR</div>

            <Link
              to="/signup"
              className="btn btn-outline w-full border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            >
              generate new identity
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MatrixRain />
      {content}
      {/* Global styles sudah didefinisikan di SignUpPage, bisa diletakkan di root atau di sini juga */}
    </>
  );
};

export default LoginPage;
