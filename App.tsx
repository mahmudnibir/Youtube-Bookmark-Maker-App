
import React, { useState, useCallback } from 'react';
import { Bookmark } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { extractVideoId } from './utils/youtube';
import YouTubePlayer from './components/YouTubePlayer';
import BookmarkList from './components/BookmarkList';
import ThemeToggle from './components/ThemeToggle';
import { BookmarkIcon } from './components/icons';

type BookmarksStore = Record<string, Bookmark[]>;

const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [allBookmarks, setAllBookmarks] = useLocalStorage<BookmarksStore>('yt-bookmarks', {});

  const currentBookmarks = videoId ? allBookmarks[videoId] || [] : [];

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(urlInput);
    if (id) {
      setVideoId(id);
    } else {
      alert('Invalid YouTube URL');
    }
  };

  const addBookmark = () => {
    if (player && videoId) {
      const currentTime = player.getCurrentTime();
      const newBookmark: Bookmark = {
        id: Date.now(),
        time: currentTime,
        note: '',
      };
      const updatedBookmarks = [...currentBookmarks, newBookmark];
      setAllBookmarks({ ...allBookmarks, [videoId]: updatedBookmarks });
    }
  };

  const updateBookmark = (id: number, newNote: string) => {
    if (videoId) {
      const updatedBookmarks = currentBookmarks.map(b => 
        b.id === id ? { ...b, note: newNote } : b
      );
      setAllBookmarks({ ...allBookmarks, [videoId]: updatedBookmarks });
    }
  };

  const deleteBookmark = (id: number) => {
    if (videoId) {
      const updatedBookmarks = currentBookmarks.filter(b => b.id !== id);
      setAllBookmarks({ ...allBookmarks, [videoId]: updatedBookmarks });
    }
  };

  const jumpToTime = useCallback((time: number) => {
    if (player) {
      player.seekTo(time, true);
      player.playVideo();
    }
  }, [player]);

  const onPlayerReady = useCallback((playerInstance: any) => {
    setPlayer(playerInstance);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            YouTube NoteTaker
          </h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
              className="flex-grow w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              Load Video
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
             <YouTubePlayer videoId={videoId} onPlayerReady={onPlayerReady} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Bookmarks</h2>
                    <button
                        onClick={addBookmark}
                        disabled={!player}
                        className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                    >
                        <BookmarkIcon className="w-5 h-5 mr-2" />
                        Add Bookmark at Current Time
                    </button>
                </div>
                <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                    {videoId ? (
                        <BookmarkList
                            bookmarks={currentBookmarks}
                            onJump={jumpToTime}
                            onUpdate={updateBookmark}
                            onDelete={deleteBookmark}
                        />
                    ) : (
                        <div className="text-center py-10 px-4">
                            <p className="text-gray-500 dark:text-gray-400">Load a video to see bookmarks.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
