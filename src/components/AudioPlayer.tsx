import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  exhibitId: string;
}

export default function AudioPlayer({ exhibitId }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSrc = `./audio/${exhibitId}.mp3`;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };
  
  const handleError = () => {
    setHasError(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  if (hasError) {
    return (
      <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl p-4 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 transition-colors">
        <VolumeX className="w-5 h-5 opacity-50" />
        <div>
          <p className="font-medium text-neutral-600 dark:text-neutral-300">Аудио не найдено</p>
          <p className="text-xs">Загрузите файл <b>{exhibitId}.mp3</b> в папку <b>public/audio/</b></p>
        </div>
      </div>
    );
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4 transition-colors">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />
      
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0"
      >
        {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-1" fill="currentColor" />}
      </button>

      <div className="flex-1 flex flex-col gap-1.5 group">
        <div className="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 font-medium font-mono">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative h-2 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={isNaN(progress) ? 0 : progress}
            onChange={handleSeek}
            className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden pointer-events-none transition-colors">
            <div 
              className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <button 
        onClick={toggleMute}
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors flex-shrink-0"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
