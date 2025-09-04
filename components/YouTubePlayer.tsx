
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface YouTubePlayerProps {
  videoId: string | null;
  onPlayerReady: (player: any) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onPlayerReady }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const playerInstance = useRef<any>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    } else {
      setIsApiReady(true);
    }

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
        playerInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isApiReady && playerRef.current && videoId) {
      if (playerInstance.current) {
        playerInstance.current.destroy();
      }
      playerInstance.current = new window.YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          playsinline: 1,
        },
        events: {
          'onReady': (event: any) => {
            onPlayerReady(event.target);
          },
        },
      });
    }
  }, [isApiReady, videoId, onPlayerReady]);

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
      {videoId ? (
        <div id="yt-player" ref={playerRef} className="w-full h-full"></div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <p className="text-gray-400 text-lg">Enter a YouTube URL to begin</p>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
