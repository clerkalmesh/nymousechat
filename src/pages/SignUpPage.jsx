// pages/SignUpPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import MatrixRain from '../components/MatrixRain';
import { useAudioStore } from '../store/useAudioStore';
import { Terminal, Copy, Download, Check, AlertCircle } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, signupData, clearSignupData } = useAuthStore();
  const [step, setStep] = useState(1);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  
  // Progress state
  const [progress, setProgress] = useState(0);
  const [currentPackage, setCurrentPackage] = useState('');
  const [packagesDone, setPackagesDone] = useState(0);
  const [totalPackages] = useState(42); // Jumlah package palsu biar kaya apt
  
  const logContainerRef = useRef(null);
  const { play } = useAudioStore();

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const packages = [
    { name: 'libidentity-core', size: '1,234 kB', progress: 5 },
    { name: 'mesh-protocol', size: '2,567 kB', progress: 10 },
    { name: 'crypto-generator', size: '3,890 kB', progress: 15 },
    { name: 'entropy-pool', size: '456 kB', progress: 20 },
    { name: 'key-derivation', size: '1,789 kB', progress: 25 },
    { name: 'hash-factory', size: '2,123 kB', progress: 30 },
    { name: 'salt-generator', size: '89 kB', progress: 35 },
    { name: 'encryption-layer', size: '4,567 kB', progress: 40 },
    { name: 'signature-validator', size: '1,234 kB', progress: 45 },
    { name: 'secure-store', size: '2,890 kB', progress: 50 },
    { name: 'certificate-signer', size: '3,456 kB', progress: 55 },
    { name: 'rsa-4096', size: '2,345 kB', progress: 60 },
    { name: 'aes-256-gcm', size: '1,567 kB', progress: 65 },
    { name: 'pbkdf2-hmac', size: '890 kB', progress: 70 },
    { name: 'shamir-secret', size: '2,678 kB', progress: 75 },
    { name: 'identity-bundle', size: '3,901 kB', progress: 80 },
    { name: 'metadata-encoder', size: '1,234 kB', progress: 85 },
    { name: 'protocol-buffer', size: '2,456 kB', progress: 90 },
    { name: 'api-client', size: '3,789 kB', progress: 95 },
    { name: 'mesh-network', size: '4,012 kB', progress: 100 },
  ];

  const addLog = (text, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    setLogs(prev => [...prev, { text, timestamp, type }]);
  };

  const simulateAptUpgrade = async () => {
    addLog('Reading package lists... Done', 'system');
    await delay(400);
    addLog('Building dependency tree... Done', 'system');
    await delay(300);
    addLog('Reading state information... Done', 'system');
    await delay(400);
    addLog('Calculating upgrade... Done', 'system');
    await delay(500);
    addLog(`The following ${totalPackages} packages will be upgraded:`, 'info');
    
    // Daftar packages
    packages.slice(0, 10).forEach(pkg => {
      addLog(`  ${pkg.name} [${pkg.size}]`, 'package');
    });
    addLog('... and 32 more packages.', 'info');
    await delay(600);
    addLog('Need to get 45.7 MB of archives.', 'system');
    addLog('After this operation, 128 MB of additional disk space will be used.', 'system');
    await delay(500);
    addLog('Do you want to continue? [Y/n] y', 'input');
    await delay(800);
    
    // Mulai download dengan progress bar
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      setCurrentPackage(pkg.name);
      setPackagesDone(i + 1);
      setProgress(pkg.progress);
      
      addLog(`Get:${i + 1} http://archive.memesh.net ${pkg.name} [${pkg.size}]`, 'download');
      
      // Simulasi progress bar dalam log
      addLog(`Progress: [${'#'.repeat(Math.floor(pkg.progress / 5))}${'.'.repeat(20 - Math.floor(pkg.progress / 5))}] ${pkg.progress}%`, 'progress');
      
      await delay(600 + Math.random() * 400);
    }
    
    setProgress(100);
    addLog('Fetched 45.7 MB in 3s (15.2 MB/s)', 'system');
    await delay(500);
    
    addLog('Extracting templates from packages: 100%', 'progress');
    await delay(400);
    
    addLog('Preparing to unpack .../libidentity-core ...', 'extract');
    await delay(300);
    addLog('Unpacking libidentity-core (1.2.3) ...', 'extract');
    await delay(400);
    
    addLog('Setting up mesh-protocol (2.1.0) ...', 'setup');
    await delay(300);
    addLog('Generating entropy pool...', 'process');
    await delay(600);
    
    addLog('Created symlink /etc/memesh/identity → /var/lib/identity', 'system');
    await delay(300);
    
    // Generate actual identity
    addLog('Generating cryptographic keys...', 'process');
    setProgress(85);
    await delay(800);
    
    try {
      const data = await signup();
      setProgress(95);
      addLog('Keys generated successfully.', 'success');
      await delay(400);
      
      addLog('Encrypting identity bundle...', 'process');
      await delay(600);
      
      setProgress(100);
      addLog('Identity creation complete!', 'success');
      await delay(500);
      
      addLog(`Anonymous ID: ${data.anonymousId}`, 'output');
      addLog(`Display Name: ${data.displayName}`, 'output');
      await delay(300);
      
      addLog('', 'empty');
      addLog('⚠️  IMPORTANT: Your secret key is below. Save it NOW! ⚠️', 'warning');
      addLog('', 'empty');
      addLog(`Secret Key: ${data.secretKey}`, 'secret');
      addLog('', 'empty');
      
      if (data?.secretKey) {
        await navigator.clipboard.writeText(data.secretKey);
        setCopySuccess('Secret key copied!');
        setTimeout(() => setCopySuccess(''), 3000);
      }
      
      await delay(1000);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError('Failed to generate identity');
      addLog('ERROR: Identity generation failed!', 'error');
      addLog(`Reason: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsGenerating(false);
      setShowTerminal(false);
    }
  };

  const handleGenerate = () => {
    play();
    setError('');
    setShowTerminal(true);
    setIsGenerating(true);
    setLogs([]);
    setProgress(0);
    setPackagesDone(0);
    setCurrentPackage('');
    
    addLog('memesh@identity:~$ sudo apt update && sudo apt upgrade', 'command');
    addLog('[sudo] password for memesh: ********', 'input');
    simulateAptUpgrade();
  };

  const downloadSecretKey = () => {
    if (!signupData?.secretKey) return;
    const blob = new Blob([signupData.secretKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meshkey-${signupData.anonymousId}.txt`;
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

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Render konten berdasarkan state
  let content;

  if (showTerminal) {
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
                memesh@identity: ~/generator
              </span>
              <span className="text-xs text-pink-400/50">
                {packagesDone}/{totalPackages} packages
              </span>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-2 border-b border-pink-500/20 bg-purple-900/30">
              <div className="flex justify-between text-xs text-pink-300 mb-1">
                <span>Progress: [{currentPackage || 'initializing...'}]</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-pink-500/30">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out relative"
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
                else if (log.type === 'package') colorClass = 'text-purple-400';
                else if (log.type === 'download') colorClass = 'text-blue-400';
                else if (log.type === 'progress') colorClass = 'text-green-400';
                else if (log.type === 'extract') colorClass = 'text-orange-400';
                else if (log.type === 'setup') colorClass = 'text-indigo-400';
                else if (log.type === 'process') colorClass = 'text-yellow-400';
                else if (log.type === 'success') colorClass = 'text-green-300 font-bold';
                else if (log.type === 'error') colorClass = 'text-red-400 font-bold';
                else if (log.type === 'warning') colorClass = 'text-yellow-300 font-bold';
                else if (log.type === 'secret') colorClass = 'text-pink-400 font-bold bg-purple-900/30 p-1 rounded';
                else if (log.type === 'output') colorClass = 'text-cyan-300';
                else if (log.type === 'input') colorClass = 'text-purple-300';
                
                return (
                  <div key={idx} className={`font-mono text-sm ${colorClass} break-all`}>
                    <span className="text-gray-600 mr-2">[{log.timestamp}]</span>
                    <span>{log.text}</span>
                  </div>
                );
              })}
              
              {isGenerating && (
                <div className="flex items-center gap-1 text-pink-400">
                  <span>$</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="px-4 py-2 border-t border-pink-500/30 bg-purple-900/30 flex items-center gap-2 text-xs text-pink-400/70">
              <div className="flex-1">
                {isGenerating ? 'Processing...' : 'Done'}
              </div>
              {copySuccess && (
                <div className="text-green-400 animate-pulse">
                  ✓ {copySuccess}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (step === 2 && signupData) {
    content = (
      <div className="fixed inset-0 flex items-center justify-center z-10 p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
          
          <div className="relative bg-gray-900/95 backdrop-blur-sm border-2 border-pink-500/50 rounded-xl shadow-2xl shadow-pink-500/30 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/70 to-pink-900/70">
              <Check className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-bold text-pink-300 flex-1">
                Identity Generated
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-xs">ANONYMOUS ID</span>
                  <span className="text-pink-300 font-mono text-sm bg-gray-900 px-2 py-1 rounded">
                    {signupData.anonymousId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-xs">DISPLAY NAME</span>
                  <span className="text-pink-300 font-mono text-sm bg-gray-900 px-2 py-1 rounded">
                    {signupData.displayName}
                  </span>
                </div>
              </div>

              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-300 text-xs flex items-center gap-1">
                    <Terminal className="w-4 h-4" />
                    SECRET KEY
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={copySecretKey}
                      className="p-1.5 hover:bg-purple-800 rounded text-pink-400 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadSecretKey}
                      className="p-1.5 hover:bg-purple-800 rounded text-pink-400 transition-colors"
                      title="Download as file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="font-mono text-xs text-pink-300 break-all bg-gray-900 p-3 rounded border border-purple-500/30 max-h-32 overflow-y-auto">
                  {signupData.secretKey}
                </div>
                {copySuccess && (
                  <p className="text-xs text-green-400 mt-2 text-center animate-pulse">
                    ✓ {copySuccess}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={continueToSystem}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  Enter System
                </button>
              </div>

              <p className="text-xs text-center text-purple-300/70">
                ⚠️ Save this key. It will never be shown again!
              </p>

              <div className="text-center">
                <Link to="/login" className="text-pink-400 hover:text-pink-300 text-sm underline underline-offset-2">
                  Already have an identity? Log in
                </Link>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
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
              <Terminal className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-bold text-pink-300">
                Identity Generator
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-center text-purple-300/70 text-sm">
                Generate a new anonymous identity for Memesh Network
              </p>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate Identity'}
              </button>

              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              <div className="text-center">
                <Link to="/login" className="text-pink-400 hover:text-pink-300 text-sm underline underline-offset-2">
                  Already have an identity? Log in
                </Link>
              </div>
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

export default SignUpPage;
//npm install react-circular-progressbar
//# atau pake CSS progress bar biasa (gua kasih dua opsi)