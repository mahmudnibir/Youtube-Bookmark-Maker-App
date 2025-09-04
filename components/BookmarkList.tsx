
import React from 'react';
import { Bookmark } from '../types';
import BookmarkItem from './BookmarkItem';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onJump: (time: number) => void;
  onUpdate: (id: number, newNote: string) => void;
  onDelete: (id: number) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, onJump, onUpdate, onDelete }) => {
  if (bookmarks.length === 0) {
    return (
        <div className="text-center py-10 px-4">
            <p className="text-gray-500 dark:text-gray-400">No bookmarks yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Play the video and click "Add Bookmark" to start.</p>
        </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks
        .slice()
        .sort((a, b) => a.time - b.time)
        .map(bookmark => (
          <BookmarkItem 
            key={bookmark.id}
            bookmark={bookmark}
            onJump={onJump}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
};

export default BookmarkList;
