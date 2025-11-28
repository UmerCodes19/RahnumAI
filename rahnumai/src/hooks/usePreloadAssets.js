import { useEffect } from 'react';


const usePreloadAssets = (images = [], audioFiles = []) => {
  useEffect(() => {
    // Preload images
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Preload audio
    audioFiles.forEach(src => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = 'auto';
    });
  }, [images, audioFiles]);
};

export default usePreloadAssets;