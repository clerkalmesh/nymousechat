import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [secretKey, setSecretKey] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) return;

    setIsExecuting(true);
    setExecutionLogs([]);
    setError('');

    const logs = [
      '> validating credentials...',
      '> comparing secure hash...',
    ];
    setExecutionLogs([logs[0]]);

    setTimeout(() => {
      setExecutionLogs([logs[0], logs[1]]);
    }, 800);

    setTimeout(async () => {
      try {
        await login(secretKey);
        setExecutionLogs(prev => [...prev, '> identity verified...', '> access granted.']);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (err) {
        setExecutionLogs(prev => [...prev, '> access denied.', '> invalid secret key.']);
        setError('Akses ditolak');
        setIsExecuting(false);
      }
    }, 1600);
  };

  if (isExecuting) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="card bg-gray-900 border border-green-500 shadow-xl max-w-2xl w-full">
          <div className="card-body font-mono text-green-400 text-lg">
            <pre className="whitespace-pre-wrap">
              {executionLogs.join('\n')}
              <span className="animate-pulse">_</span>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-primary">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center text-primary">TERMINAL AUTHENTICATION</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Secret Key</span>
              </label>
              <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="input input-bordered w-full font-mono"
                placeholder="Masukkan secret key Anda"
                autoFocus
              />
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Authenticate
              </button>
            </div>
          </form>
          <p className="text-center mt-4">
            Belum punya secret key?{' '}
            <Link to="/signup" className="link link-secondary">
              Buat identitas baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;