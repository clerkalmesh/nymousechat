import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900">
      <div className="max-w-md text-center space-y-6 p-8">
        {/* Ikon dengan efek glow */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl blur-xl bg-pink-500/30 -z-10" />
          </div>
        </div>

        {/* Teks selamat datang gaya terminal */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
          &gt; MEMESH NETWORK
        </h2>
        
        <div className="space-y-2 text-base">
          <p className="text-pink-300/80 font-mono">
            $ echo "Selamat datang di jaringan anonim"
          </p>
          <p className="text-purple-300/70 font-mono text-sm">
            Pilih percakapan dari sidebar untuk memulai
          </p>
        </div>

        {/* Pesan peringatan sistem */}
        <div className="mt-6 p-4 border border-pink-500/30 rounded-lg bg-purple-900/20">
          <p className="text-sm text-pink-400 font-mono">
            ⚠️ PERINGATAN SISTEM ⚠️
          </p>
          <p className="text-xs text-purple-300/70 mt-2 leading-relaxed">
            Jangan percaya pada siapapun di sini. Setiap identitas adalah anonim.
            Lindungi secret key-mu. Jika ragu, logout segera.
          </p>
          <p className="text-xs text-green-400/70 mt-2 font-mono">
            $ cat /etc/memesh/warning
          </p>
        </div>

        {/* Efek scanlines (opsional, untuk nuansa terminal) */}
        <div className="absolute inset-0 pointer-events-none scanlines opacity-10" />
      </div>

      {/* Style untuk scanlines */}
      <style jsx>{`
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03) 0px,
            rgba(255, 255, 255, 0) 2px,
            transparent 3px
          );
        }
      `}</style>
    </div>
  );
};

export default NoChatSelected;