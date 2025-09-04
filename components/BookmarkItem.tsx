
import React, { useState, useRef, useEffect } from 'react';
import { Bookmark } from '../types';
import { formatTime } from '../utils/youtube';
import { PlayIcon, EditIcon, TrashIcon } from './icons';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onJump: (time: number) => void;
  onUpdate: (id: number, newNote: string) => void;
  onDelete: (id: number) => void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onJump, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(bookmark.note);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    if (note !== bookmark.note) {
        onUpdate(bookmark.id, note);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNote(bookmark.note);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ease-in-out">
      <button 
        onClick={() => onJump(bookmark.time)}
        className="flex-shrink-0 flex items-center justify-center w-20 text-sm font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-gray-700 rounded-md py-1 mr-4 hover:bg-indigo-200 dark:hover:bg-gray-600 transition-colors"
      >
        <PlayIcon className="w-4 h-4 mr-1" />
        {formatTime(bookmark.time)}
      </button>
      <div className="flex-grow min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full bg-transparent p-1 border-b-2 border-indigo-500 focus:outline-none text-gray-800 dark:text-gray-200"
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300 truncate cursor-pointer" onClick={() => setIsEditing(true)} title={bookmark.note || "Click to add a note"}>
            {bookmark.note || <span className="text-gray-400 dark:text-gray-500 italic">Click to add a note...</span>}
          </p>
        )}
      </div>
      <div className="flex items-center ml-4 space-x-1 flex-shrink-0">
        <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Edit note">
          <EditIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(bookmark.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" aria-label="Delete bookmark">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BookmarkItem;
