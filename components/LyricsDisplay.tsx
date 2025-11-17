import React, { useRef, useEffect, useState } from 'react';
// Fix: Import `MicrophoneIcon` to resolve reference error.
import { PlayIcon, PauseIcon, BackIcon, VolumeIcon, SpeedIcon, TextSizeIcon, MicrophoneIcon, MicrophoneOffIcon } from './icons';
import { Song } from '../types';

interface LyricsDisplayProps {
  lyrics: string;
  fontSize: number;
  scrollSpeed: number;
  bpm: number;
  micThreshold: number;
  onBack: () => void;
  onSettingsChange: (settings: Partial<Pick<Song, 'fontSize' | 'scrollSpeed' | 'bpm' | 'micThreshold'>>) => void;
}

const FONT_SIZE_STEP = 2;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 128;

const SCROLL_SPEED_STEP = 0.1;
const MIN_SCROLL_SPEED = 0.1;
const MAX_SCROLL_SPEED = 10.0;

const MIC_THRESHOLD_STEP = 1;
const MIN_MIC_THRESHOLD = 0;
const MAX_MIC_THRESHOLD = 250;

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({
  lyrics,
  fontSize,
  scrollSpeed,
  bpm,
  micThreshold,
  onBack,
  onSettingsChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  const [isScrolling, setIsScrolling] = useState(false);
  const [isListening, setIsListening] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Smooth scrolling loop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isScrolling) {
        cancelAnimationFrame(animationFrameRef.current);
        return;
    };
    
    const pixelsPerBeat = 60; // Adjust this to make scrolling feel right
    const beatsPerSecond = bpm / 60.0;
    const baseSpeed = pixelsPerBeat * beatsPerSecond;
    const finalSpeed = baseSpeed * scrollSpeed;

    const scrollLoop = () => {
      if (scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        scrollContainer.scrollTop += finalSpeed / 60; // divided by 60 for smooth per-frame scrolling
        animationFrameRef.current = requestAnimationFrame(scrollLoop);
      } else {
        setIsScrolling(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isScrolling, scrollSpeed, bpm]);


  // Audio Listener for Volume Start
  useEffect(() => {
    if (!isListening) {
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (audioContextRef.current?.state !== 'closed') {
           audioContextRef.current?.close();
        }
        audioContextRef.current = null;
        return;
    }

    let analyser: AnalyserNode | null = null;

    const setupAudio = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                alert('Microphone access is not supported by your browser.');
                return false;
            }
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            const source = audioContext.createMediaStreamSource(streamRef.current);
            source.connect(analyser);
            audioContextRef.current = audioContext;
            return true;
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please allow microphone permissions in your browser settings.');
            setIsListening(false);
            return false;
        }
    };
    
    const detectionLoop = () => {
        if (!analyser || !isListening) return;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        const avgVolume = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;

        if (avgVolume > micThreshold) {
            setIsScrolling(true);
            setIsListening(false);
        } else {
            animationFrameRef.current = requestAnimationFrame(detectionLoop);
        }
    };
    
    setupAudio().then(success => {
        if (success) {
            animationFrameRef.current = requestAnimationFrame(detectionLoop);
        }
    });

    return () => {
        cancelAnimationFrame(animationFrameRef.current);
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (audioContextRef.current?.state !== 'closed') {
           audioContextRef.current?.close();
        }
    };
  }, [isListening, micThreshold]);

  const handleResetScroll = () => {
      if(scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
      }
      setIsScrolling(false);
      setIsListening(true);
  }
  
  const handleTogglePlay = () => {
      if (!isScrolling) {
          setIsListening(false); // Manual start overrides listener
      }
      setIsScrolling(prev => !prev);
  }

  const handleToggleListening = () => {
    setIsScrolling(false); // Always stop scrolling when toggling listening mode
    setIsListening(prev => !prev);
  };

  return (
    <div 
        className="relative h-screen w-screen overflow-hidden"
    >
      <div 
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-auto scroll-smooth hide-scrollbar"
      >
        <div 
            className="text-center text-gray-100 whitespace-pre-wrap leading-tight p-8 md:p-12 lg:p-16 transition-all duration-300"
            style={{ 
                fontSize: `${fontSize}px`,
                paddingTop: '50vh',
                paddingBottom: '50vh',
                lineHeight: 1.5,
            }}
        >
          {lyrics}
        </div>
      </div>
      
      <div className="fixed top-4 left-4">
        <button onClick={onBack} className="p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-white/20 transition-colors" title="Back to Library">
            <BackIcon className="w-7 h-7" />
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-4 text-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="w-full sm:w-80 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-3 w-full">
              <TextSizeIcon className="w-6 h-6 text-cyan-300 flex-shrink-0" />
              <input
                type="range" min={MIN_FONT_SIZE} max={MAX_FONT_SIZE} step={FONT_SIZE_STEP}
                value={fontSize}
                onChange={(e) => onSettingsChange({ fontSize: parseInt(e.target.value, 10)})}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                aria-label="Font size"
              />
              <span className="w-16 text-right font-mono text-sm">{fontSize}px</span>
            </div>
            <div className={`flex items-center gap-3 w-full transition-opacity`}>
              <SpeedIcon className="w-6 h-6 text-cyan-300 flex-shrink-0" />
              <input
                type="range" min={MIN_SCROLL_SPEED} max={MAX_SCROLL_SPEED} step={SCROLL_SPEED_STEP}
                value={scrollSpeed}
                onChange={(e) => onSettingsChange({ scrollSpeed: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                aria-label="Scroll speed multiplier"
              />
              <span className="w-16 text-right font-mono text-sm">{scrollSpeed.toFixed(1)}x</span>
            </div>
             <div className="flex items-center gap-3 w-full" title="Auto-start volume threshold">
                <VolumeIcon className="w-6 h-6 text-cyan-300 flex-shrink-0" />
                <input
                    type="range"
                    min={MIN_MIC_THRESHOLD}
                    max={MAX_MIC_THRESHOLD}
                    step={MIC_THRESHOLD_STEP}
                    value={micThreshold}
                    onChange={(e) => onSettingsChange({ micThreshold: parseInt(e.target.value, 10) })}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                    aria-label="Start threshold"
                />
                <span className="w-16 text-right font-mono text-sm">{micThreshold}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={handleResetScroll} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" title="Restart Scroll & Re-enable Mic">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a8 8 0 0113.52-5.96M20 15a8 8 0 01-13.52 5.96" />
                </svg>
            </button>
            <button 
                onClick={handleTogglePlay} 
                className="p-4 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors transform active:scale-90"
            >
              {isScrolling ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
            </button>
            <button
              onClick={handleToggleListening}
              className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 hover:bg-red-400' : 'bg-white/10 hover:bg-white/20'}`}
              title={isListening ? "Stop Listening" : "Enable Mic Listening"}
            >
              {isListening ? <MicrophoneIcon className="w-7 h-7" /> : <MicrophoneOffIcon className="w-7 h-7" />}
            </button>
          </div>

          <div className="w-full sm:w-80 flex sm:justify-end items-center">
             {isListening && (
              <div className="text-center p-3 rounded-lg bg-black/30 flex items-center gap-3 animate-pulse">
                <MicrophoneIcon className="w-6 h-6 text-red-400" />
                <div className="font-semibold text-gray-300">Listening...</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .slider-thumb { transition: background-color 0.2s; }
        .slider-thumb:disabled { background-color: #4b5563; }
        .slider-thumb:disabled::-webkit-slider-thumb { background: #6b7280; }
        .slider-thumb:disabled::-moz-range-thumb { background: #6b7280; }
        .slider-thumb::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 20px; height: 20px; background: #22d3ee;
            cursor: pointer; border-radius: 50%; border: 2px solid #f8fafc;
            margin-top: -8px;
        }
        .slider-thumb::-moz-range-thumb {
            width: 16px; height: 16px; background: #22d3ee;
            cursor: pointer; border-radius: 50%; border: 2px solid #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default LyricsDisplay;