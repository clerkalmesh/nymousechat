
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

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
~/chatapp $ cat src/components/MatrixRain.jsx
// components/MatrixRain.jsx
import React, { useRef, useEffect } from 'react';

const MatrixRain = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width, height;
    const setCanvasDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasDimensions();

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const fontSize = 18;
    const columns = width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);

    const draw = () => {
      // Background gelap dengan opacity rendah untuk efek trail (matrix khas)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Warna huruf pink terang, tanpa opacity agar jelas
      ctx.fillStyle = '#ff44aa';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 30);
    window.addEventListener('resize', setCanvasDimensions);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />;
};

export default MatrixRain;
