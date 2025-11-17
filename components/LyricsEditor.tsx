import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { BackIcon, TextSizeIcon, SpeedIcon } from './icons';

interface LyricsEditorProps {
  song: Song;
  onSave: (song: Song) => void;
  onStart: () => void;
  onBack: () => void;
}

const FONT_SIZE_STEP = 2;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 128;

const SCROLL_SPEED_STEP = 0.1;
const MIN_SCROLL_SPEED = 0.1;
const MAX_SCROLL_SPEED = 20.0;

const LyricsEditor: React.FC<LyricsEditorProps> = ({ song, onSave, onStart, onBack }) => {
  const [title, setTitle] = useState(song.title);
  const [lyrics, setLyrics] = useState(song.lyrics);
  const [bpm, setBpm] = useState(song.bpm);
  const [fontSize, setFontSize] = useState(song.fontSize);
  const [scrollSpeed, setScrollSpeed] = useState(song.scrollSpeed);
  const [isDirty, setIsDirty] = useState(false);

  const previewScrollRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    setTitle(song.title);
    setLyrics(song.lyrics);
    setBpm(song.bpm);
    setFontSize(song.fontSize);
    setScrollSpeed(song.scrollSpeed);
    setIsDirty(false);
  }, [song]);

  useEffect(() => {
    if (song.title !== title || song.lyrics !== lyrics || song.bpm !== bpm || song.fontSize !== fontSize || song.scrollSpeed !== scrollSpeed) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [title, lyrics, bpm, fontSize, scrollSpeed, song]);

  useEffect(() => {
    const scrollContainer = previewScrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollTop = 0;

    const pixelsPerBeat = 20; // A smaller value for the preview panel
    const beatsPerSecond = bpm / 60.0;
    const baseSpeed = pixelsPerBeat * beatsPerSecond;
    const finalSpeed = baseSpeed * scrollSpeed;

    const scrollLoop = () => {
      if (scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        scrollContainer.scrollTop += finalSpeed / 60; // divided by 60 for smooth per-frame scrolling
      } else {
        scrollContainer.scrollTop = 0; // Loop back to the top
      }
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    };

    if (lyrics.trim().length > 0) {
      animationFrameRef.current = requestAnimationFrame(scrollLoop);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }


    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [lyrics, scrollSpeed, bpm, fontSize]);


  const handleSave = () => {
    onSave({ ...song, title, lyrics, bpm, fontSize, scrollSpeed });
    setIsDirty(false);
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.innerText = "Saved!";
        setTimeout(() => { saveButton.innerText = "Save Changes" }, 2000);
    }
  };

  const handleStart = () => {
    if (isDirty) {
      onSave({ ...song, title, lyrics, bpm, fontSize, scrollSpeed });
    }
    onStart();
  };

  return (
    <div className="flex flex-col h-screen p-4 sm:p-6 md:p-8">
      <header className="flex-shrink-0 flex flex-col xl:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="Back to Library">
                <BackIcon className="w-6 h-6" />
            </button>
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Edit Song</h1>
                <p className="text-lg text-gray-400 mt-1">Modify the title, lyrics and settings below.</p>
            </div>
        </div>
        <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg">
             <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="bpm-input" className="font-semibold text-gray-300">BPM:</label>
                    <input 
                        id="bpm-input"
                        type="number"
                        value={bpm}
                        onChange={e => setBpm(parseInt(e.target.value, 10) || 0)}
                        className="w-24 bg-gray-700 border border-gray-600 rounded-lg p-2 text-lg text-center text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                    />
                </div>
                <button
                id="save-button"
                onClick={handleSave}
                disabled={!isDirty}
                className="py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 active:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Save Changes
                </button>
            </div>
            <div className="flex items-center gap-3">
              <TextSizeIcon className="w-6 h-6 text-cyan-300 flex-shrink-0" />
              <input type="range" min={MIN_FONT_SIZE} max={MAX_FONT_SIZE} step={FONT_SIZE_STEP} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb" aria-label="Font size" />
              <span className="w-16 text-right font-mono text-sm">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <SpeedIcon className="w-6 h-6 text-cyan-300 flex-shrink-0" />
              <input type="range" min={MIN_SCROLL_SPEED} max={MAX_SCROLL_SPEED} step={SCROLL_SPEED_STEP} value={scrollSpeed} onChange={(e) => setScrollSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb" aria-label="Scroll speed multiplier" />
              <span className="w-16 text-right font-mono text-sm">{scrollSpeed.toFixed(1)}x</span>
            </div>
        </div>
      </header>
      <div className="flex-grow grid md:grid-cols-2 gap-6 py-4 overflow-hidden">
        <div className="flex flex-col gap-4 h-full">
            <input 
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Song Title"
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
            <textarea
            className="w-full h-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 text-lg text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            placeholder="Paste your lyrics here..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            spellCheck="false"
            />
        </div>
        <div className="hidden md:flex flex-col gap-2 h-full">
            <h3 className="text-lg font-semibold text-gray-400">Live Preview</h3>
            <div className="flex-grow bg-black rounded-lg border-2 border-gray-700 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                <div ref={previewScrollRef} className="h-full w-full overflow-y-auto hide-scrollbar">
                    <div className="text-center text-gray-100 whitespace-pre-wrap transition-all duration-300"
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: 1.5,
                            paddingTop: '50%',
                            paddingBottom: '100vh',
                        }}
                    >
                        {lyrics || "Your text will appear here..."}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
      </div>
      <footer className="flex-shrink-0 pt-4">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 bg-cyan-600 text-white text-xl font-bold rounded-lg hover:bg-cyan-500 active:bg-cyan-700 transition-all duration-200 transform active:scale-95 shadow-lg shadow-cyan-600/30 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
          disabled={!lyrics.trim()}
        >
          Start Scrolling
        </button>
      </footer>
       <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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

export default LyricsEditor;