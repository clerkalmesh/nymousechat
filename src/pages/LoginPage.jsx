// pages/LoginPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import MatrixRain from '../components/MatrixRain';
import { useAudioStore } from '../store/useAudioStore';
import { Terminal, Key, AlertCircle, Check, X, Lock, Unlock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [secretKey, setSecretKey] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [authStatus, setAuthStatus] = useState('idle'); // idle, processing, success, failed

  const logContainerRef = useRef(null);
  const { play } = useAudioStore();

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const addLog = (text, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    setLogs(prev => [...prev, { text, timestamp, type }]);
  };

  const simulateAuthProcess = async () => {
    setAuthStatus('processing');
    
    // Initial commands
    addLog('memesh@login:~$ auth --verify --key=' + '*'.repeat(secretKey.length), 'command');
    await delay(400);
    
    addLog('Loading authentication modules...', 'system');
    await delay(300);
    
    // Progress bar simulation
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      if (i === 20) addLog('[ 20%] Establishing secure channel...', 'progress');
      if (i === 30) addLog('[ 30%] Requesting authentication challenge...', 'progress');
      if (i === 40) addLog('[ 40%] Processing challenge response...', 'progress');
      if (i === 50) addLog('[ 50%] Verifying cryptographic signature...', 'progress');
      if (i === 60) addLog('[ 60%] Checking certificate revocation list...', 'progress');
      if (i === 70) addLog('[ 70%] Validating identity permissions...', 'progress');
      if (i === 80) addLog('[ 80%] Comparing secure hash...', 'progress');
      if (i === 90) addLog('[ 90%] Decrypting identity token...', 'progress');
      await delay(200);
    }
    
    setProgress(100);
    addLog('[100%] Authentication complete.', 'success');
    await delay(400);
    
    try {
      await login(secretKey);
      
      addLog('', 'empty');
      addLog('✓ Identity verified successfully!', 'success');
      addLog('✓ Access token generated.', 'success');
      addLog('✓ Session established.', 'success');
      addLog('', 'empty');
      addLog('Welcome to Memesh Network.', 'output');
      addLog('Redirecting to chat...', 'system');
      
      setAuthStatus('success');
      await delay(1500);
      navigate('/');
    } catch (err) {
      setAuthStatus('failed');
      
      addLog('', 'empty');
      addLog('✗ Authentication failed!', 'error');
      addLog(`✗ Error: Invalid secret key`, 'error');
      addLog('✗ Access denied.', 'error');
      addLog('', 'empty');
      addLog('Possible reasons:', 'warning');
      addLog('  - Secret key is incorrect', 'warning');
      addLog('  - Key has been revoked', 'warning');
      addLog('  - Cryptographic mismatch', 'warning');
      
      setError('Secret key tidak valid');
      setIsExecuting(false);
      setProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) return;

    setIsExecuting(true);
    setLogs([]);
    setError('');
    setProgress(0);
    setAuthStatus('processing');
    
    play();
    
    await simulateAuthProcess();
  };

  const resetForm = () => {
    setIsExecuting(false);
    setLogs([]);
    setError('');
    setProgress(0);
    setAuthStatus('idle');
  };

  let content;

  if (isExecuting) {
    const getStatusIcon = () => {
      if (authStatus === 'success') return <Check className="w-5 h-5 text-green-400" />;
      if (authStatus === 'failed') return <X className="w-5 h-5 text-red-400" />;
      return <Lock className="w-5 h-5 text-yellow-400 animate-pulse" />;
    };

    const getStatusText = () => {
      if (authStatus === 'success') return 'Authentication Successful';
      if (authStatus === 'failed') return 'Authentication Failed';
      return 'Authenticating...';
    };

    content = (
      <div className="fixed inset-0 flex items-center justify-center z-10 p-4">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
          
          <div className="relative bg-gray-900/95 backdrop-blur-sm border-2 border-pink-500/50 rounded-xl shadow-2xl shadow-pink-500/30 overflow-hidden font-mono">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/70 to-pink-900/70">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <Terminal className="w-4 h-4 text-pink-400 ml-2" />
              <span className="text-xs text-pink-300/80 flex-1">
                memesh@login: ~/.auth
              </span>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={`text-xs ${
                  authStatus === 'success' ? 'text-green-400' :
                  authStatus === 'failed' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {getStatusText()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-2 border-b border-pink-500/20 bg-purple-900/30">
              <div className="flex justify-between text-xs text-pink-300 mb-1">
                <span>Authentication Progress:</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-pink-500/30">
                <div 
                  className={`h-full transition-all duration-300 ease-out relative ${
                    authStatus === 'failed' ? 'bg-red-500' :
                    authStatus === 'success' ? 'bg-green-500' :
                    'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Log Terminal */}
            <div 
              ref={logContainerRef}
              className="p-4 h-96 overflow-y-auto bg-gray-950/90 text-sm space-y-1"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255, 0, 255, 0.05) 1px, transparent 1px)',
                backgroundSize: '4px 4px'
              }}
            >
              {logs.map((log, idx) => {
                let colorClass = 'text-gray-400';
                if (log.type === 'command') colorClass = 'text-yellow-300';
                else if (log.type === 'system') colorClass = 'text-cyan-400';
                else if (log.type === 'progress') colorClass = 'text-purple-400';
                else if (log.type === 'success') colorClass = 'text-green-400 font-bold';
                else if (log.type === 'error') colorClass = 'text-red-400 font-bold';
                else if (log.type === 'warning') colorClass = 'text-yellow-400';
                else if (log.type === 'output') colorClass = 'text-pink-300';
                
                return (
                  <div key={idx} className={`font-mono text-sm ${colorClass} break-all`}>
                    <span className="text-gray-600 mr-2">[{log.timestamp}]</span>
                    <span>{log.text}</span>
                  </div>
                );
              })}
              
              {authStatus === 'processing' && (
                <div className="flex items-center gap-1 text-pink-400">
                  <span>$</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="px-4 py-2 border-t border-pink-500/30 bg-purple-900/30 flex items-center gap-2 text-xs">
              {authStatus === 'failed' ? (
                <>
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 flex-1">Authentication failed. Try again?</span>
                  <button
                    onClick={resetForm}
                    className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-pink-300 rounded text-xs transition-colors"
                  >
                    Retry
                  </button>
                </>
              ) : authStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 flex-1">Authentication successful! Redirecting...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-yellow-400 flex-1">Processing authentication request...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="fixed inset-0 flex items-center justify-center z-10 p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
          
          <div className="relative bg-gray-900/95 backdrop-blur-sm border-2 border-pink-500/50 rounded-xl shadow-2xl shadow-pink-500/30 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/70 to-pink-900/70">
              <Key className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-bold text-pink-300 flex-1">
                Authentication Required
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-purple-300/70 text-sm">
                  Enter your secret key to access the network
                </p>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                  <code className="text-xs text-pink-300">
                    memesh@network:~$ auth --login
                  </code>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-purple-300/80 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    SECRET KEY
                  </label>
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full bg-gray-800 border-2 border-purple-500/50 rounded-lg px-4 py-3 text-pink-300 font-mono text-sm focus:border-pink-400 focus:outline-none transition-colors"
                    placeholder="••••••••••••••••"
                    autoFocus
                  />
                  <p className="text-xs text-purple-300/50">
                    Enter the 64-character key you received during registration
                  </p>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!secretKey.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Authenticate
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/30"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-900 text-purple-400/50">OR</span>
                </div>
              </div>

              <Link
                to="/signup"
                className="w-full border-2 border-purple-500/50 hover:border-pink-500/50 text-purple-300 hover:text-pink-300 font-mono py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                Generate New Identity
              </Link>

              <p className="text-center text-xs text-purple-300/50">
                ⚠️ Never share your secret key with anyone
              </p>
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
    </>
  );
};

export default LoginPage;