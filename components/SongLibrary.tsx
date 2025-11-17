import React from 'react';
import { Song } from '../types';
import { PlayIcon, EditIcon, TrashIcon, PlusIcon } from './icons';

interface SongLibraryProps {
  songs: Song[];
  onStart: (songId: string) => void;
  onEdit: (songId: string) => void;
  onDelete: (songId: string) => void;
  onCreate: () => void;
  onImportClick: () => void;
}

const SongLibrary: React.FC<SongLibraryProps> = ({ songs, onStart, onEdit, onDelete, onCreate, onImportClick }) => {

    const handleExport = () => {
        if (songs.length === 0) {
            alert("Your library is empty. Nothing to export.");
            return;
        }
        try {
            const dataStr = JSON.stringify(songs, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `lyric-teleprompter-library-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export library:", error);
            alert("An error occurred while exporting the library.");
        }
    };
    
    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Song Library</h1>
                    <p className="text-lg text-gray-400 mt-1">Manage your songs and settings.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onImportClick} className="py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200">
                        Import
                    </button>
                    <button onClick={handleExport} className="py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200">
                        Export
                    </button>
                    <button onClick={onCreate} className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 active:bg-cyan-700 transition-colors duration-200 flex items-center gap-2">
                        <PlusIcon className="w-5 h-5"/> New Song
                    </button>
                </div>
            </header>

            <main>
                {songs.length > 0 ? (
                    <ul className="space-y-3">
                        {songs.map(song => (
                            <li key={song.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
                                <div className="flex-grow overflow-hidden mr-4">
                                    <h2 className="text-xl font-semibold truncate text-gray-100">{song.title}</h2>
                                    <p className="text-sm text-gray-400 font-mono">
                                        BPM: {song.bpm}, Spd: {song.scrollSpeed.toFixed(1)}x, Font: {song.fontSize}px, Thresh: {song.micThreshold}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => onEdit(song.id)} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Edit Song"><EditIcon className="w-5 h-5"/></button>
                                    <button onClick={() => onDelete(song.id)} className="p-2 rounded-full text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Song"><TrashIcon className="w-5 h-5"/></button>
                                    <button onClick={() => onStart(song.id)} className="p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors" title="Start Scrolling"><PlayIcon className="w-6 h-6"/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-400">Your library is empty.</h2>
                        <p className="text-gray-500 mt-2">Click "New Song" to get started.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SongLibrary;