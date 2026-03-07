// components/AudioControls.jsx
import React from "react";
import { useAudioStore } from "../store/useAudioStore";
import { Play, Pause, Volume2, VolumeX, StopCircle } from "lucide-react";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AudioControls = () => {
  const { isPlaying, isMuted, togglePlay, toggleMute, stop } = useAudioStore();

  return (
    <TooltipProvider>
      <div className="flex gap-1.5 bg-gray-800/80 backdrop-blur-sm border border-pink-500/30 rounded-lg p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="h-8 w-8 text-pink-300 hover:text-pink-200 hover:bg-purple-800/70"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 border-pink-500/30 text-pink-300">
            <p>{isPlaying ? "Jeda" : "Putar"} musik</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8 text-pink-300 hover:text-pink-200 hover:bg-purple-800/70"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 border-pink-500/30 text-pink-300">
            <p>{isMuted ? "Suarakan" : "Bisukan"} musik</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={stop}
              className="h-8 w-8 text-pink-300 hover:text-pink-200 hover:bg-purple-800/70"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 border-pink-500/30 text-pink-300">
            <p>Hentikan musik</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default AudioControls;