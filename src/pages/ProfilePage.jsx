// pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import MatrixRain from '../components/MatrixRain';
import { Camera, User, Mail, Calendar, Shield, Info, LogOut, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile, updateProfilePic, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfilePic(base64Image);
      } catch (error) {
        console.error('Upload gagal', error);
      }
    };
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <MatrixRain />

      {/* Tombol kembali ke chat */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
        title="Kembali ke Chat"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="fixed inset-0 flex items-center justify-center z-10 p-4 overflow-y-auto">
        <div className="relative w-full max-w-3xl my-8">
          {/* Efek glow latar */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />

          {/* Card utama */}
          <div className="relative bg-gray-900/90 backdrop-blur-sm border border-pink-500/40 rounded-xl shadow-2xl overflow-hidden shadow-pink-500/30">
            {/* Header terminal */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-2 text-xs text-pink-300/80 font-mono">
                memesh@network:~ whoami --verbose
              </div>
            </div>

            {/* Konten profil */}
            <div className="p-6 font-mono space-y-6">
              {/* Judul */}
              <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  IDENTITAS ANONIM
                </h1>
                <p className="text-pink-300/70 text-sm mt-1">
                  $ cat /etc/memesh/identity
                </p>
              </div>

              {/* Avatar dengan upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-pink-500/70 shadow-lg shadow-pink-500/30">
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

              {/* Info identitas dalam kotak terminal */}
              <div className="space-y-3">
                <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                    <User size={14} />
                    <span>NAMA TAMPILAN</span>
                  </div>
                  <div className="text-pink-300 font-mono text-base pl-6">
                    {authUser?.displayName || 'Anonymous'}
                  </div>
                </div>

                <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                    <Mail size={14} />
                    <span>ID ANONIM</span>
                  </div>
                  <div className="text-pink-300 font-mono text-base pl-6 break-all">
                    {authUser?.anonymousId || 'MX-XXXXXX'}
                  </div>
                </div>

                <div className="bg-black/40 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                    <Calendar size={14} />
                    <span>ANGGOTA SEJAK</span>
                  </div>
                  <div className="text-pink-300 font-mono text-base pl-6">
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
                  <div className="text-green-400 font-mono text-base pl-6">
                    AKTIF
                  </div>
                </div>
              </div>

              {/* Bagian Tentang Memesh Network */}
              <div className="bg-purple-900/20 border border-purple-500/40 rounded-lg p-4">
                <button
                  onClick={() => setShowAbout(!showAbout)}
                  className="flex items-center gap-2 text-pink-400 hover:text-pink-300 w-full text-left"
                >
                  <Info size={18} />
                  <span className="font-bold">TENTANG MEMESH NETWORK</span>
                  <span className="ml-auto">{showAbout ? '▼' : '▶'}</span>
                </button>
                
                {showAbout && (
                  <div className="mt-3 text-sm text-purple-200/80 space-y-3 leading-relaxed">
                    <p>
                      <span className="text-pink-400">Memesh Network</span> adalah platform komunikasi anonim yang 
                      dirancang untuk melindungi privasi Anda. Tidak seperti aplikasi chat pada umumnya (WhatsApp, 
                      Telegram, dll.) yang membutuhkan nomor telepon atau email, Memesh Network menggunakan sistem 
                      <span className="text-green-400"> Secret Key</span> yang dihasilkan secara acak.
                    </p>
                    <p>
                      <span className="text-yellow-400">❝ Tanpa data pribadi, tanpa risiko kebocoran. ❞</span>
                    </p>
                    <p>
                      <strong className="text-pink-400">Apa itu Secret Key?</strong> Ini adalah kunci rahasia sepanjang 
                      64 karakter heksadesimal yang hanya ditampilkan SATU KALI saat Anda membuat identitas. Kunci ini 
                      tidak pernah disimpan di server (hanya hash-nya), sehingga hanya Anda yang tahu. Login dilakukan 
                      dengan mencocokkan hash, bukan kunci asli.
                    </p>
                    <p>
                      <strong className="text-pink-400">Perbedaan dengan WhatsApp / Telegram:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-purple-200/70">
                      <li><span className="text-green-400">✓</span> Tanpa nomor telepon atau email – anonimitas total.</li>
                      <li><span className="text-green-400">✓</span> Tidak ada profil publik – hanya ID anonim dan nama tampilan.</li>
                      <li><span className="text-green-400">✓</span> Secret Key Anda adalah satu-satunya akses – tidak ada kata sandi yang bisa diretas.</li>
                      <li><span className="text-green-400">✓</span> Riwayat chat tersimpan di server, tapi tidak terkait dengan identitas asli.</li>
                      <li><span className="text-green-400">✓</span> Fitur global chat memungkinkan semua user online berkomunikasi tanpa batas.</li>
                    </ul>
                    <p>
                      <strong className="text-pink-400">Mengapa ada Global Chat?</strong> Untuk menciptakan ruang 
                      bersama di mana semua pengguna dapat berinteraksi secara anonim, berbagi ide, atau sekadar 
                      bersosialisasi tanpa batasan. Ini seperti ruang publik digital yang aman.
                    </p>
                    <p>
                      <strong className="text-pink-400">Filosofi kami:</strong> Privasi adalah hak asasi. Anda 
                      berhak berkomunikasi tanpa diawasi, tanpa data dijual ke pihak ketiga. Memesh Network hadir 
                      sebagai alternatif bagi mereka yang menghargai kebebasan dan anonimitas.
                    </p>
                  </div>
                )}
              </div>

              {/* Tombol aksi */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="flex-1 btn btn-outline border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 font-mono"
                >
                  <Shield size={16} className="mr-2" />
                  kebijakan_privasi.sh
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white font-mono"
                >
                  <LogOut size={16} className="mr-2" />
                  logout --session
                </button>
              </div>

              {/* Catatan terminal */}
              <p className="text-center text-xs text-purple-300/50 mt-2">
                &gt; identitas disimpan di enclave aman
              </p>
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
          {/* Header modal */}
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

          {/* Isi kebijakan privasi */}
          <div className="p-4 text-sm space-y-3 max-h-96 overflow-y-auto text-purple-200/80">
            <h3 className="text-lg font-bold text-pink-400">KEBIJAKAN PRIVASI</h3>
            <p>
              <span className="text-pink-300">Memesh Network</span> berkomitmen melindungi privasi Anda. 
              Berikut adalah praktik pengumpulan dan penggunaan data:
            </p>

            <h4 className="text-pink-300 font-bold mt-3">1. Data yang Dikumpulkan</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>ID anonim (contoh: MX-3FA92B) – dihasilkan acak, tidak bisa dilacak ke Anda.</li>
              <li>Hash dari secret key – kunci Anda tidak pernah disimpan mentah.</li>
              <li>Nama tampilan (display name) – opsional, bisa diubah kapan saja.</li>
              <li>Pesan dan gambar – hanya untuk pengiriman real-time; kami tidak membaca konten.</li>
            </ul>

            <h4 className="text-pink-300 font-bold mt-3">2. Penggunaan Data</h4>
            <p>
              Data hanya digunakan untuk operasional chat. Tidak ada data yang dijual atau dibagikan 
              kepada pihak ketiga. Pesan hanya dapat diakses oleh pengirim dan penerima yang dituju.
            </p>

            <h4 className="text-pink-300 font-bold mt-3">3. Keamanan Secret Key</h4>
            <p>
              Secret key Anda hanya ditampilkan sekali saat pembuatan akun. Jika hilang, tidak ada cara 
              untuk memulihkan akun. Simpan di tempat aman (password manager, catatan offline). 
              Jangan pernah bagikan secret key Anda.
            </p>

            <h4 className="text-pink-300 font-bold mt-3">4. Cookie</h4>
            <p>
              Kami menggunakan cookie httpOnly untuk token autentikasi. Cookie ini tidak bisa diakses 
              oleh JavaScript dan hanya dikirim melalui HTTPS.
            </p>

            <h4 className="text-pink-300 font-bold mt-3">5. Hak Anda</h4>
            <p>
              Anda dapat menghapus akun kapan saja melalui fitur dukungan (dalam pengembangan). 
              Semua data terkait akan dihapus permanen.
            </p>

            <p className="text-xs text-purple-300/50 mt-4">
              Terakhir diperbarui: 16 Februari 2026
            </p>
          </div>

          {/* Footer modal */}
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
