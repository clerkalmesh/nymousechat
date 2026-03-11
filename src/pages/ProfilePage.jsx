import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import MatrixRain from '../components/MatrixRain';
import { Camera, User, Mail, Calendar, Shield, Info, LogOut, ArrowLeft, Edit2, X, Check } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(authUser?.displayName || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.error('Upload gagal', error);
      }
    };
  };

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim() || newDisplayName === authUser?.displayName) {
      setIsEditingName(false);
      return;
    }
    try {
      await updateProfile({ displayName: newDisplayName.trim() });
      setIsEditingName(false);
    } catch (error) {
      console.error('Gagal update display name', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <MatrixRain />
      
      {/* Header profil */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-pink-500/30 px-4 py-2 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
          title="Kembali ke Chat"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="ml-4 text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          IDENTITAS ANONIM
        </h1>
      </div>

      {/* Konten profil */}
      <div className="pt-16 min-h-screen bg-gray-900 relative">
        <div className="flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl my-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />

            <div className="relative bg-gray-900/90 backdrop-blur-sm border border-pink-500/40 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/30">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-2 text-xs text-pink-300/80 font-mono">
                  memesh@network:~ whoami --verbose
                </div>
              </div>

              <div className="p-4 sm:p-6 font-mono space-y-6">
                {/* Avatar dengan upload */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-pink-500/70 shadow-lg shadow-pink-500/30">
                      <img
                        src={selectedImg || authUser?.profilePic || '/avatar.png'}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className={`
                        absolute bottom-0 right-0
                        bg-purple-600 hover:bg-purple-700 text-white
                        p-2 rounded-full cursor-pointer
                        transition-all duration-200 border border-pink-400
                        ${isUpdatingProfile ? 'animate-pulse pointer-events-none opacity-50' : ''}
                      `}
                    >
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUpdatingProfile}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-purple-300/70">
                    {isUpdatingProfile ? '> mengunggah avatar...' : '> klik kamera untuk ganti foto'}
                  </p>
                </div>

                {/* Info identitas */}
                <div className="space-y-3">
                  {/* Display Name dengan edit */}
                  <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between text-purple-300 text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>NAMA TAMPILAN</span>
                      </div>
                      {!isEditingName && (
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-pink-400 hover:text-pink-300"
                          title="Edit nama"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </div>

                    {isEditingName ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          className="flex-1 bg-black/60 border border-pink-500/50 rounded px-3 py-1 text-pink-300 text-sm focus:outline-none focus:border-pink-400"
                          placeholder="Nama baru..."
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateDisplayName();
                            if (e.key === 'Escape') {
                              setIsEditingName(false);
                              setNewDisplayName(authUser?.displayName || '');
                            }
                          }}
                        />
                        <button
                          onClick={handleUpdateDisplayName}
                          disabled={isUpdatingProfile}
                          className="text-green-400 hover:text-green-300 disabled:opacity-50"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingName(false);
                            setNewDisplayName(authUser?.displayName || '');
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-pink-300 font-mono text-sm sm:text-base pl-6 break-words">
                        {authUser?.displayName || 'Anonymous'}
                      </div>
                    )}
                  </div>

                  <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                      <Mail size={14} />
                      <span>ID ANONIM</span>
                    </div>
                    <div className="text-pink-300 font-mono text-sm sm:text-base pl-6 break-all">
                      {authUser?.anonymousId || 'MESH-XXXXXX'}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                      <Calendar size={14} />
                      <span>ANGGOTA SEJAK</span>
                    </div>
                    <div className="text-pink-300 font-mono text-sm sm:text-base pl-6">
                      {authUser?.createdAt
                        ? new Date(authUser.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '-- -- ----'}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                      <Shield size={14} />
                      <span>STATUS AKUN</span>
                    </div>
                    <div className="text-green-400 font-mono text-sm sm:text-base pl-6">
                      AKTIF
                    </div>
                  </div>
                </div>

                {/* Bagian Tentang */}
                <div className="bg-purple-900/20 border border-purple-500/40 rounded-lg p-4">
                  <button
                    onClick={() => setShowAbout(!showAbout)}
                    className="flex items-center gap-2 text-pink-400 hover:text-pink-300 w-full text-left text-sm sm:text-base"
                  >
                    <Info size={18} />
                    <span className="font-bold flex-1">TENTANG MEMESH NETWORK</span>
                    <span>{showAbout ? '▼' : '▶'}</span>
                  </button>

                  {showAbout && (
                    <div className="mt-3 text-xs sm:text-sm text-purple-200/80 space-y-3 leading-relaxed">
                      <p>
                        <span className="text-pink-400">Memesh Network</span> adalah platform komunikasi anonim yang
                        dirancang untuk melindungi privasi Anda.
                      </p>
                      <p>
                        <span className="text-yellow-400">❝ Tanpa data pribadi, tanpa risiko kebocoran. ❞</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Tombol aksi */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="flex-1 btn btn-outline border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 font-mono text-sm"
                  >
                    <Shield size={16} className="mr-2" />
                    kebijakan_privasi.sh
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white font-mono text-sm"
                  >
                    <LogOut size={16} className="mr-2" />
                    logout --session
                  </button>
                </div>

                <p className="text-center text-xs text-purple-300/50 mt-2">
                  &gt; identitas disimpan di enclave aman
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Privacy Policy */}
      <input
        type="checkbox"
        id="privacy-modal"
        className="modal-toggle"
        checked={showPrivacy}
        onChange={() => setShowPrivacy(!showPrivacy)}
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-gray-900 border border-pink-500/40 shadow-xl shadow-pink-500/30 font-mono">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="ml-2 text-xs text-pink-300/80 font-mono">
              memesh@policy:~ less kebijakan.md
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="ml-auto text-pink-300 hover:text-pink-200"
            >
              ✕
            </button>
          </div>

          <div className="p-4 text-sm space-y-3 max-h-96 overflow-y-auto text-purple-200/80">
            <h3 className="text-lg font-bold text-pink-400">KEBIJAKAN PRIVASI</h3>
            <p>
              <span className="text-pink-300">Memesh Network</span> berkomitmen melindungi privasi Anda.
            </p>
            {/* Tambahkan teks kebijakan lengkap di sini */}
          </div>

          <div className="modal-action">
            <button
              onClick={() => setShowPrivacy(false)}
              className="btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white font-mono"
            >
              $ tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
