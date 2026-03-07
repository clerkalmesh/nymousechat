import { MessageSquare } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const NoChatSelected = ({ setSidebarOpen }) => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {/* Header dengan tombol menu mobile */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-pink-500/30 px-4 py-2 flex items-center lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Konten utama */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md text-center space-y-6 p-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl blur-xl bg-pink-500/30 -z-10" />
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
            &gt; MEMESH NETWORK
          </h2>

          <div className="space-y-2 text-base">
            <p className="text-pink-300/80 font-mono">
              $ echo "Selamat datang di jaringan anonim" {">>"} welcome.md
            </p>
            <p className="text-purple-300/70 font-mono text-sm">
              Pilih percakapan dari sidebar untuk memulai
            </p>
          </div>

          <div className="mt-6 p-4 border border-pink-500/30 rounded-lg bg-purple-900/20">
            <p className="text-sm text-pink-400 font-mono">⚠️ PERINGATAN SISTEM ⚠️</p>
            <p className="text-xs text-purple-300/70 mt-2 leading-relaxed">
              Jangan percaya pada siapapun di sini. Setiap identitas adalah anonim.
              Lindungi secret key-mu. Jika ragu, logout segera.
            </p>
            <p className="text-xs text-green-400/70 mt-2 font-mono">$ cat /etc/memesh/warning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;