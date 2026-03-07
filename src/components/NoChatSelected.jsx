import useAuthStore from "../store/useAuthStore";
import AudioControls from "./AudioControls";

const NoChatSelected = ({ setSidebarOpen }) => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {/* Header dengan tombol menu mobile */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-pink-500/30 px-4 py-2 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <AudioControls />
            <button
              onClick={() => window.location.href = '/profile'}
              className="btn btn-circle btn-sm bg-purple-900/50 border-purple-500 text-purple-300 hover:bg-purple-800/70"
              title="Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          
          {/* Visual Identity */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                <img 
                  src="/avatar.png" 
                  alt="Avatar" 
                  className="w-10 h-10 object-cover rounded-full opacity-80"
                />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            MEMESH NETWORK
          </h2>

          {/* The Psychology of Anonymity - Morgan Housel Style */}
          <div className="space-y-6 text-left bg-purple-950/20 p-6 rounded-2xl border border-pink-500/20 shadow-2xl">
            
            {/* Paradoks Identitas */}
            <div className="space-y-2">
              <p className="text-pink-400 text-[10px] tracking-[0.2em] font-bold uppercase">Logika Privasi</p>
              <p className="text-purple-200/90 text-sm leading-relaxed">
                Dunia modern terobsesi dengan data. Semakin banyak identitas yang kita bagikan, semakin mudah bagi sistem untuk memprediksi kita. Di sini, nilai tertinggi kami adalah **ketidaktahuan**. Kami memilih untuk tidak mengenal siapa pun, karena itulah satu-satunya cara agar kebebasan kita tetap utuh.
              </p>
            </div>

            {/* Reputasi adalah Beban */}
            <div className="space-y-2">
              <p className="text-pink-400 text-[10px] tracking-[0.2em] font-bold uppercase">Beban Nama</p>
              <p className="text-purple-200/90 text-sm leading-relaxed border-l-2 border-pink-500/40 pl-4">
                Kita seringkali lebih jujur pada orang asing daripada pada diri sendiri. Mengapa? Karena tanpa nama, tidak ada reputasi yang perlu kita jaga. Kebenaran seringkali muncul justru saat tidak ada mata yang menilai siapa kita.
              </p>
            </div>

            {/* Keamanan melalui ketiadaan */}
            <div className="space-y-2">
              <p className="text-pink-400 text-[10px] tracking-[0.2em] font-bold uppercase">Efisiensi Sistem</p>
              <p className="text-purple-200/90 text-sm leading-relaxed">
                Kebanyakan sistem menjanjikan perlindungan data. Kami menawarkan sesuatu yang lebih radikal: **ketiadaan data**. Jika data itu tidak pernah kami miliki sejak awal, ia tidak akan pernah bisa digunakan untuk mengontrol kita.
              </p>
            </div>

            {/* Aturan Main */}
            <div className="pt-4 border-t border-pink-500/20">
              <div className="space-y-3 text-[13px] text-purple-300/70 italic">
                <p>
                  "Privasi bukan tentang menyembunyikan kesalahan. Privasi adalah tentang memastikan hal-hal yang benar tetap menjadi milik kita."
                </p>
                <p className="text-pink-400/80 not-italic font-medium">
                  Secret key adalah satu-satunya jembatan kita. Jika hilang, kita menjadi asing bagi satu sama lain—sebagaimana seharusnya.
                </p>
              </div>
            </div>

            {/* Social Metrics */}
            <div className="grid grid-cols-2 gap-4 bg-purple-900/30 p-4 rounded-xl border border-purple-500/10">
              <div className="text-center">
                <p className="text-pink-400 text-[9px] uppercase font-bold tracking-widest mb-1">Pengamat</p>
                <p className="text-purple-100 text-lg font-mono">13.7k</p>
              </div>
              <div className="text-center border-l border-purple-500/20">
                <p className="text-pink-400 text-[9px] uppercase font-bold tracking-widest mb-1">Suara</p>
                <p className="text-purple-100 text-lg font-mono">4.2M</p>
              </div>
            </div>

            <div className="text-center text-[11px] text-purple-400/50 font-light tracking-wide">
              "Di sini, kita bebas. Termasuk bebas dari satu sama lain."
            </div>
          </div>

          {/* Footer minimalis */}
          <div className="text-center space-y-1">
            <p className="text-[10px] text-gray-600 tracking-tighter uppercase">
              © 2026 • Tanpa Jejak • Tanpa Penyesalan
            </p>
            <div className="w-1 h-1 bg-pink-500/40 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
