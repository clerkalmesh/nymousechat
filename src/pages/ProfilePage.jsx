// pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import MatrixRain from '../components/MatrixRain';
import { Camera, User, Mail, Calendar, Shield, Info, LogOut, ArrowLeft, X } from 'lucide-react';

// Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      
      {/* Container utama dengan padding top untuk header */}
      <div className="min-h-screen bg-gray-900 pt-20 pb-8 px-4 relative">
        {/* Tombol kembali - absolute */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="fixed top-20 left-4 z-10 bg-purple-900/50 text-pink-300 hover:bg-purple-800/70 border border-pink-500/30"
          title="Kembali ke Chat"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="max-w-3xl mx-auto">
          {/* Efek glow latar */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl -z-10" />

          {/* Card utama dengan shadcn */}
          <Card className="bg-gray-900/90 backdrop-blur-sm border-pink-500/40 shadow-2xl shadow-pink-500/30 font-mono">
            {/* Header terminal ala Matrix */}
            <CardHeader className="border-b border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <CardTitle className="text-xs text-pink-300/80 ml-2">
                  memesh@network:~ whoami --verbose
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Judul */}
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  IDENTITAS ANONIM
                </h1>
                <p className="text-pink-300/70 text-xs sm:text-sm mt-1">
                  $ cat /etc/memesh/identity
                </p>
              </div>

              {/* Avatar dengan upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-pink-500/70 shadow-lg shadow-pink-500/30">
                    <AvatarImage 
                      src={selectedImg || authUser?.profilePic || '/avatar.png'} 
                      alt="avatar"
                    />
                    <AvatarFallback className="bg-purple-800 text-pink-300 text-xl">
                      {authUser?.displayName?.[0] || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  
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
                
                <Badge variant="outline" className="text-purple-300/70 border-pink-500/30 text-xs">
                  {isUpdatingProfile ? '> mengunggah avatar...' : '> klik kamera untuk ganti foto'}
                </Badge>
              </div>

              {/* Info identitas dalam card terpisah */}
              <div className="grid gap-3">
                {/* Nama */}
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                      <User size={14} />
                      <span>NAMA TAMPILAN</span>
                    </div>
                    <div className="text-pink-300 font-mono text-sm sm:text-base pl-6 break-words">
                      {authUser?.displayName || 'Anonymous'}
                    </div>
                  </CardContent>
                </Card>

                {/* ID Anonim */}
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                      <Mail size={14} />
                      <span>ID ANONIM</span>
                    </div>
                    <div className="text-pink-300 font-mono text-sm sm:text-base pl-6 break-all">
                      {authUser?.anonymousId || 'MESH-XXXXXX'}
                    </div>
                  </CardContent>
                </Card>

                {/* Tanggal Bergabung */}
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-3">
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
                  </CardContent>
                </Card>

                {/* Status */}
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                      <Shield size={14} />
                      <span>STATUS AKUN</span>
                    </div>
                    <div className="text-green-400 font-mono text-sm sm:text-base pl-6">
                      AKTIF
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bagian Tentang Memesh - Accordion style */}
              <Card className="bg-purple-900/20 border-purple-500/40">
                <CardHeader className="p-4 pb-2">
                  <button
                    onClick={() => setShowAbout(!showAbout)}
                    className="flex items-center gap-2 text-pink-400 hover:text-pink-300 w-full text-left text-sm sm:text-base"
                  >
                    <Info size={18} />
                    <span className="font-bold flex-1">TENTANG MEMESH NETWORK</span>
                    <span className="text-pink-400">{showAbout ? '▼' : '▶'}</span>
                  </button>
                </CardHeader>

                {showAbout && (
                  <CardContent className="p-4 pt-0 text-xs sm:text-sm text-purple-200/80 space-y-3 leading-relaxed">
                    <p>
                      <span className="text-pink-400">Memesh Network</span> adalah platform komunikasi anonim yang
                      dirancang untuk melindungi privasi Anda. Tidak seperti aplikasi chat pada umumnya (WhatsApp,
                      Telegram, dll.) yang membutuhkan nomor telepon atau email, Memesh Network menggunakan sistem
                      <span className="text-green-400"> Secret Key</span> yang dihasilkan secara acak.
                    </p>
                    <p className="text-yellow-400 text-center">
                      ❝ Tanpa data pribadi, tanpa risiko kebocoran. ❞
                    </p>
                    
                    <Separator className="bg-pink-500/30" />
                    
                    <div>
                      <h4 className="text-pink-400 font-bold mb-2">Apa itu Secret Key?</h4>
                      <p>
                        Ini adalah kunci rahasia sepanjang 64 karakter heksadesimal yang hanya ditampilkan SATU KALI 
                        saat Anda membuat identitas. Kunci ini tidak pernah disimpan di server (hanya hash-nya), 
                        sehingga hanya Anda yang tahu.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-pink-400 font-bold mb-2">Perbedaan dengan WhatsApp / Telegram:</h4>
                      <ul className="list-disc list-inside space-y-1 text-purple-200/70">
                        <li><span className="text-green-400">✓</span> Tanpa nomor telepon atau email – anonimitas total.</li>
                        <li><span className="text-green-400">✓</span> Tidak ada profil publik – hanya ID anonim dan nama tampilan.</li>
                        <li><span className="text-green-400">✓</span> Secret Key Anda adalah satu-satunya akses.</li>
                        <li><span className="text-green-400">✓</span> Riwayat chat tersimpan di server, tapi tidak terkait identitas asli.</li>
                        <li><span className="text-green-400">✓</span> Fitur global chat untuk semua user online.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-pink-400 font-bold mb-2">Mengapa ada Global Chat?</h4>
                      <p>
                        Untuk menciptakan ruang bersama di mana semua pengguna dapat berinteraksi secara anonim, 
                        berbagi ide, atau sekadar bersosialisasi tanpa batasan.
                      </p>
                    </div>

                    <p className="text-pink-300 text-sm italic">
                      "Privasi adalah hak asasi. Anda berhak berkomunikasi tanpa diawasi."
                    </p>
                  </CardContent>
                )}
              </Card>

              {/* Tombol aksi */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 font-mono text-sm"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      kebijakan_privasi.sh
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="bg-gray-900 border-pink-500/40 text-purple-200 font-mono max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="text-pink-400 text-xl flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        KEBIJAKAN PRIVASI
                      </DialogTitle>
                      <DialogDescription className="text-purple-300/70">
                        memesh@policy:~ less kebijakan.md
                      </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="text-pink-300 font-bold mb-2">1. Data yang Dikumpulkan</h4>
                          <ul className="list-disc list-inside space-y-1 text-purple-200/80">
                            <li>ID anonim – dihasilkan acak, tidak bisa dilacak</li>
                            <li>Hash dari secret key – kunci Anda tidak pernah disimpan mentah</li>
                            <li>Nama tampilan (display name)</li>
                            <li>Pesan dan gambar – hanya untuk pengiriman real-time</li>
                          </ul>
                        </div>

                        <Separator className="bg-pink-500/30" />

                        <div>
                          <h4 className="text-pink-300 font-bold mb-2">2. Penggunaan Data</h4>
                          <p className="text-purple-200/80">
                            Data hanya digunakan untuk operasional chat. Tidak ada data yang dijual atau dibagikan
                            kepada pihak ketiga.
                          </p>
                        </div>

                        <Separator className="bg-pink-500/30" />

                        <div>
                          <h4 className="text-pink-300 font-bold mb-2">3. Keamanan Secret Key</h4>
                          <p className="text-purple-200/80">
                            Secret key Anda hanya ditampilkan sekali. Jika hilang, tidak ada cara untuk memulihkan akun. 
                            Simpan di tempat aman. Jangan pernah bagikan secret key Anda.
                          </p>
                        </div>

                        <Separator className="bg-pink-500/30" />

                        <div>
                          <h4 className="text-pink-300 font-bold mb-2">4. Cookie</h4>
                          <p className="text-purple-200/80">
                            Kami menggunakan cookie httpOnly untuk token autentikasi. Cookie ini tidak bisa diakses
                            oleh JavaScript dan hanya dikirim melalui HTTPS.
                          </p>
                        </div>

                        <Separator className="bg-pink-500/30" />

                        <div>
                          <h4 className="text-pink-300 font-bold mb-2">5. Hak Anda</h4>
                          <p className="text-purple-200/80">
                            Anda dapat menghapus akun kapan saja. Semua data terkait akan dihapus permanen.
                          </p>
                        </div>

                        <p className="text-xs text-purple-300/50 mt-4">
                          Terakhir diperbarui: 16 Februari 2026
                        </p>
                      </div>
                    </ScrollArea>

                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={() => setShowPrivacy(false)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        $ tutup
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleLogout}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-mono text-sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  logout --session
                </Button>
              </div>

              {/* Footer terminal */}
              <p className="text-center text-xs text-purple-300/50 mt-2">
                &gt; identitas disimpan di enclave aman
              </p>
            </CardContent>

            <CardFooter className="border-t border-pink-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-2">
              <p className="text-xs text-pink-300/50 w-full text-center">
                memesh@network:~ $ echo $SECRET_KEY | sha256sum
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;