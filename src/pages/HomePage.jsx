import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const HomePage = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-success">
        <div className="card-body text-center">
          <h2 className="card-title text-3xl justify-center text-success">✓ ACCESS GRANTED</h2>
          <div className="space-y-2">
            <p>Anonymous ID: <span className="font-bold text-primary">{authUser?.anonymousId}</span></p>
            <p>Display Name: <span className="text-secondary">{authUser?.displayName}</span></p>
          </div>
          <div className="card-actions justify-center mt-4">
            <button onClick={handleLogout} className="btn btn-outline btn-warning">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;