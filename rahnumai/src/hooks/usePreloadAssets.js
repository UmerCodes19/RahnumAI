import { useEffect, useState } from 'react';

const usePreloadAssets = (images = [], audioFiles = []) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalCount = images.length + audioFiles.length;

    if (totalCount === 0) {
      setLoaded(true);
      return;
    }

    const checkLoaded = () => {
      loadedCount += 1;
      if (loadedCount >= totalCount) setLoaded(true);
    };

    // Preload images
    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = checkLoaded;
      img.onerror = checkLoaded; // still count errors
    });

    // Preload audio
    audioFiles.forEach(src => {
      const audio = new Audio();
      audio.src = src;
      audio.preload = 'auto';
      audio.oncanplaythrough = checkLoaded;
      audio.onerror = checkLoaded;
    });
  }, [images, audioFiles]);

  return loaded; // boolean: all assets loaded
};

export default usePreloadAssets;
