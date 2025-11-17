import React, { useState, useEffect, useRef } from 'react';
import LyricsEditor from './components/LyricsEditor';
import LyricsDisplay from './components/LyricsDisplay';
import SongLibrary from './components/SongLibrary';
import Modal from './components/Modal';
import { Song } from './types';

const SONG_LIBRARY_STORAGE_key = 'teleprompter-songLibrary';

const PRESET_LYRICS = `(Verse 1)
In the glow of the screen, a new world takes flight
With lines of bright code in the pale moonlight
A silent creator, a digital sage
Turning a blank canvas to a brand new page

(Chorus)
Oh, Teleprompter, guide my view
With words that are steady and true
Adjust the speed, make the letters grow
In the rhythm of the virtual flow

(Verse 2)
From a simple idea, a structure will rise
Building components before my own eyes
State and the props in a delicate dance
Giving this application a fighting chance

(Chorus)
Oh, Teleprompter, guide my view
With words that are steady and true
Adjust the speed, make the letters grow
In the rhythm of the virtual flow

(Bridge)
Tailwind classes for a perfect design
Making the interface beautifully shine
Responsive and clean on any device
A user experience that's truly precise

(Chorus)
Oh, Teleprompter, guide my view
With words that are steady and true
Adjust the speed, make the letters grow
In the rhythm of the virtual flow

(Outro)
So scroll on, dear lyrics, across the dark screen
A PWA vision, a developer's dream
Functional, elegant, ready to show
The magic that happens when you let the code go.
`;

const App: React.FC = () => {
  const [mode, setMode] = useState<'library' | 'edit' | 'display'>('library');
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const savedSongs = localStorage.getItem(SONG_LIBRARY_STORAGE_key);
      if (savedSongs) {
        return JSON.parse(savedSongs);
      }
    } catch (error) {
      console.error("Could not read song library from local storage", error);
    }
    return [{
      id: `${Date.now()}`,
      title: "Ein Entwicklertraum",
      lyrics: PRESET_LYRICS,
      fontSize: 48,
      scrollSpeed: 1,
      bpm: 120,
      micThreshold: 50,
    }];
  });
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  
  const importInputRef = useRef<HTMLInputElement>(null);

  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
    cancelText?: string;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SONG_LIBRARY_STORAGE_key, JSON.stringify(songs));
    } catch (error) {
      console.error('Failed to save song library:', error);
    }
  }, [songs]);

  const currentSong = songs.find(song => song.id === currentSongId);

  const handleStartDisplay = (songId: string) => {
    setCurrentSongId(songId);
    setMode('display');
    // isScrolling is managed by LyricsDisplay component now
  };

  const handleEdit = (songId: string) => {
    setCurrentSongId(songId);
    setMode('edit');
  };

  const handleBackToLibrary = () => {
    setMode('library');
    setCurrentSongId(null);
    setIsScrolling(false);
  };
  
  const handleCreateNewSong = () => {
    const newSong: Song = {
        id: `${Date.now()}`,
        title: "Neues Lied",
        lyrics: "Schreibe hier deinen Liedtext...",
        fontSize: 48,
        scrollSpeed: 1,
        bpm: 120,
        micThreshold: 50,
    };
    setSongs(prev => [...prev, newSong]);
    setCurrentSongId(newSong.id);
    setMode('edit');
  }

  const handleSaveSong = (updatedSong: Song) => {
    setSongs(prevSongs => prevSongs.map(song => song.id === updatedSong.id ? updatedSong : song));
  }
  
  const handleDeleteSong = (songId: string) => {
    setModalConfig({
        title: "Lied löschen",
        message: "Möchtest du dieses Lied wirklich endgültig löschen?",
        confirmText: "Löschen",
        cancelText: "Abbrechen",
        onConfirm: () => {
            if (currentSongId === songId) {
                setCurrentSongId(null);
            }
            setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
            setModalConfig(null);
        }
    });
  }

  const handleUpdateSongSettings = (songId: string, settings: Partial<Pick<Song, 'fontSize' | 'scrollSpeed' | 'bpm' | 'micThreshold'>>) => {
      setSongs(prevSongs => prevSongs.map(song => {
          if (song.id === songId) {
              return { ...song, ...settings };
          }
          return song;
      }));
  };
  
  const handleImportClick = () => {
    importInputRef.current?.click();
  };
  
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const result = event.target?.result;
            if (typeof result !== 'string') {
                throw new Error('Datei konnte nicht als Text gelesen werden.');
            }
            const potentialSongs = JSON.parse(result);

            if (!Array.isArray(potentialSongs)) {
                throw new Error('Ungültiges Dateiformat. Ein Array von Liedern wurde erwartet.');
            }

            const defaultSongValues = {
                fontSize: 48,
                scrollSpeed: 1,
                bpm: 120,
                micThreshold: 50,
            };

            const importedSongs: Song[] = potentialSongs.map((s: any, index: number) => {
                if (typeof s !== 'object' || s === null || !s.title || !s.lyrics) {
                    throw new Error(`Ungültige Lieddaten bei Index ${index}. Titel oder Text fehlt.`);
                }
                return {
                    id: s.id || `${Date.now()}-${index}`,
                    title: String(s.title),
                    lyrics: String(s.lyrics),
                    fontSize: typeof s.fontSize === 'number' ? s.fontSize : defaultSongValues.fontSize,
                    scrollSpeed: typeof s.scrollSpeed === 'number' ? s.scrollSpeed : defaultSongValues.scrollSpeed,
                    bpm: typeof s.bpm === 'number' ? s.bpm : defaultSongValues.bpm,
                    micThreshold: typeof s.micThreshold === 'number' ? s.micThreshold : defaultSongValues.micThreshold,
                };
            });
            
            setModalConfig({
                title: "Import bestätigen",
                message: `Dies wird deine aktuelle Bibliothek vollständig durch ${importedSongs.length} Lied(er) aus der Datei ersetzen. Diese Aktion kann nicht rückgängig gemacht werden.`,
                confirmText: "Bibliothek ersetzen",
                cancelText: "Abbrechen",
                onConfirm: () => {
                  setSongs(importedSongs);
                  setModalConfig({
                      title: "Import erfolgreich",
                      message: `Bibliothek ersetzt! ${importedSongs.length} Lied(er) wurden importiert.`,
                      confirmText: "OK",
                      onConfirm: () => setModalConfig(null),
                  });
                }
            });

        } catch (error) {
            console.error('Failed to import library:', error);
            const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
            setModalConfig({
                title: "Import fehlgeschlagen",
                message: `Die Bibliothek konnte nicht importiert werden. Bitte stelle sicher, dass es sich um eine gültige JSON-Datei handelt, die von dieser App exportiert wurde. \n\nFehler: ${errorMessage}`,
                confirmText: "OK",
                onConfirm: () => setModalConfig(null)
            });
        } finally {
            if (e.target) {
                e.target.value = '';
            }
        }
    };
    reader.onerror = () => {
        setModalConfig({
            title: "Dateifehler",
            message: "Beim Lesen der Datei ist ein Fehler aufgetreten.",
            confirmText: "OK",
            onConfirm: () => setModalConfig(null),
        });
    }
    reader.readAsText(file);
  };

  const handleReorderSongs = (reorderedSongs: Song[]) => {
    setSongs(reorderedSongs);
  };

  const renderContent = () => {
    if (mode === 'display' && currentSong) {
      return (
        <LyricsDisplay
          lyrics={currentSong.lyrics}
          fontSize={currentSong.fontSize}
          scrollSpeed={currentSong.scrollSpeed}
          bpm={currentSong.bpm}
          micThreshold={currentSong.micThreshold}
          onBack={handleBackToLibrary}
          onSettingsChange={(settings) => handleUpdateSongSettings(currentSong.id, settings)}
        />
      );
    }

    if (mode === 'edit' && currentSong) {
      return (
        <LyricsEditor
          song={currentSong}
          onSave={handleSaveSong}
          onStart={() => handleStartDisplay(currentSong.id)}
          onBack={handleBackToLibrary}
        />
      );
    }

    return (
      <SongLibrary
        songs={songs}
        onStart={handleStartDisplay}
        onEdit={handleEdit}
        onDelete={handleDeleteSong}
        onCreate={handleCreateNewSong}
        onImportClick={handleImportClick}
        onReorder={handleReorderSongs}
      />
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans antialiased">
      <input 
        type="file" 
        ref={importInputRef} 
        onChange={handleFileSelected} 
        style={{display: 'none'}} 
        accept=".json" 
      />
      {renderContent()}
      {modalConfig && (
        <Modal
          title={modalConfig.title}
          onClose={() => setModalConfig(null)}
          footer={
            <>
              {modalConfig.cancelText && (
                <button
                  onClick={() => setModalConfig(null)}
                  className="py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  {modalConfig.cancelText}
                </button>
              )}
               {modalConfig.onConfirm && (
                <button
                  onClick={modalConfig.onConfirm}
                  className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors duration-200"
                >
                  {modalConfig.confirmText || 'OK'}
                </button>
              )}
            </>
          }
        >
          <p className="whitespace-pre-wrap">{modalConfig.message}</p>
        </Modal>
      )}
    </div>
  );
};

export default App;