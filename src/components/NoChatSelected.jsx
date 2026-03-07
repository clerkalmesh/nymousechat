// components/NoChatSelected.jsx
import React from "react";
import { MessageSquare } from "lucide-react";
import AudioControls from "./AudioControls"; // <-- Import AudioControls
import useAuthStore from "../store/useAuthStore";

// Shadcn components
import { Card, CardContent } from "@/components/ui/card";

const NoChatSelected = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900 p-4">
      <Card className="max-w-md w-full bg-gray-800/50 border-pink-500/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Audio Controls di dalam card - tengah */}
          {authUser && (
            <div className="flex justify-center">
              <AudioControls />
            </div>
          )}

          {/* Logo animasi */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl blur-xl bg-pink-500/30 -z-10" />
            </div>
          </div>

          {/* Judul */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
              &gt; MEMESH NETWORK
            </h1>
            <p className="text-pink-300/80 font-mono text-sm">
              $ echo "Selamat datang di jaringan anonim" &gt;&gt; welcome.md
            </p>
          </div>

          {/* Petunjuk */}
          <div className="text-center space-y-1">
            <p className="text-purple-300/70 font-mono text-sm">
              Pilih percakapan dari sidebar untuk memulai
            </p>
          </div>

          {/* Warning card */}
          <Card className="border-pink-500/30 bg-purple-900/20">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-pink-400 font-mono flex items-center gap-2">
                <span className="text-yellow-400">⚠️</span>
                PERINGATAN SISTEM
                <span className="text-yellow-400">⚠️</span>
              </p>
              <p className="text-xs text-purple-300/70 leading-relaxed">
                Jangan percaya pada siapapun di sini. Setiap identitas adalah anonim.
                Lindungi secret key-mu. Jika ragu, logout segera.
              </p>
              <p className="text-xs text-green-400/70 mt-2 font-mono">
                $ cat /etc/memesh/warning
              </p>
            </CardContent>
          </Card>

          {/* Audio Controls juga bisa di bawah (opsional) */}
          {authUser && (
            <div className="flex justify-center pt-2">
              <p className="text-xs text-pink-400/50 mr-2">Musik latar:</p>
              <AudioControls />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoChatSelected;