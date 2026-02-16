import { MessageSquare, Menu } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import AudioControls from "../components/AudioControls";

const NoChatSelected = ({ setSidebarOpen }) => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900 relative">
      {/* Tombol buka sidebar di mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 lg:hidden btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
      >
        <Menu size={20} />
      </button>

      {/* Kontrol musik hanya muncul jika user sudah login */}
      {authUser && (
        <div className="absolute bottom-4 right-4 z-10">
          <AudioControls />
        </div>
      )}

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
          &gt; MEMESH NETWORK YEEY
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
  );
};

export default NoChatSelected;
