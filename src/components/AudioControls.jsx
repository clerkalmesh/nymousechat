import React from "react";
import { useAudioStore } from "../store/useAudioStore";
import { Play, Pause, Volume2, VolumeX, StopCircle } from "lucide-react";

const AudioControls = () => {
  const { isPlaying, isMuted, togglePlay, toggleMute, stop } = useAudioStore();

  return (
    <div className="flex gap-2">
      <button
        onClick={togglePlay}
        className="btn btn-circle btn-sm bg-purple-900/50 border-pink-500 text-pink-300 hover:bg-purple-800/70"
        title={isPlaying ? "Jeda" : "Putar"}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button
        onClick={toggleMute}
        className="btn btn-circle btn-sm bg-purple-900/50 border-pink-500 text-pink-300 hover:bg-purple-800/70"
        title={isMuted ? "Suarakan" : "Bisu"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <button
        onClick={stop}
        className="btn btn-circle btn-sm bg-purple-900/50 border-pink-500 text-pink-300 hover:bg-purple-800/70"
        title="Hentikan musik"
      >
        <StopCircle size={16} />
      </button>
    </div>
  );
};

export default AudioControls;
