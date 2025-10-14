import { useState, useEffect, useRef } from 'react';
import Sound from 'react-native-sound';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

const useSound = () => {
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const soundRefs = useRef({});

  // Preload sound files
  useEffect(() => {
    if (soundsEnabled) {
      preloadSounds();
    }

    return () => {
      // Release all sounds on unmount
      Object.values(soundRefs.current).forEach((sound) => {
        if (sound) {
          sound.release();
        }
      });
    };
  }, [soundsEnabled]);

  // Preload all sound files
  const preloadSounds = () => {
    const sounds = {
      correct: require('../assets/sounds/correct.mp3'),
      celebration: require('../assets/sounds/celebration.mp3'),
      encouragement: require('../assets/sounds/encouragement.mp3'),
      thumbsUp: require('../assets/sounds/thumbs-up.mp3'),
    };

    Object.keys(sounds).forEach((key) => {
      if (!soundRefs.current[key]) {
        soundRefs.current[key] = new Sound(sounds[key], (error) => {
          if (error) {
            console.error(`Failed to load sound ${key}:`, error);
          }
        });
      }
    });
  };

  // Play a specific sound
  const playSound = (soundName, callback = null) => {
    if (!soundsEnabled) {
      if (callback) callback();
      return;
    }

    const sound = soundRefs.current[soundName];

    if (sound) {
      sound.play((success) => {
        if (!success) {
          console.error(`Sound ${soundName} failed to play`);
        }
        if (callback) callback();
      });
    } else {
      console.warn(`Sound ${soundName} not found`);
      if (callback) callback();
    }
  };

  // Stop a specific sound
  const stopSound = (soundName) => {
    const sound = soundRefs.current[soundName];
    if (sound) {
      sound.stop();
    }
  };

  // Pause a specific sound
  const pauseSound = (soundName) => {
    const sound = soundRefs.current[soundName];
    if (sound) {
      sound.pause();
    }
  };

  // Resume a paused sound
  const resumeSound = (soundName) => {
    const sound = soundRefs.current[soundName];
    if (sound) {
      sound.play();
    }
  };

  // Set volume for a specific sound (0.0 to 1.0)
  const setVolume = (soundName, volume) => {
    const sound = soundRefs.current[soundName];
    if (sound) {
      sound.setVolume(Math.max(0, Math.min(1, volume)));
    }
  };

  // Set loop for a specific sound
  const setLoop = (soundName, loop) => {
    const sound = soundRefs.current[soundName];
    if (sound) {
      sound.setNumberOfLoops(loop ? -1 : 0);
    }
  };

  // Toggle sounds on/off
  const toggleSounds = () => {
    setSoundsEnabled(!soundsEnabled);
  };

  // Enable sounds
  const enableSounds = () => {
    setSoundsEnabled(true);
  };

  // Disable sounds
  const disableSounds = () => {
    setSoundsEnabled(false);
  };

  // Predefined sound effects
  const playCorrect = () => playSound('correct');
  const playCelebration = () => playSound('celebration');
  const playEncouragement = () => playSound('encouragement');
  const playThumbsUp = () => playSound('thumbsUp');

  // Play success sound (combination)
  const playSuccess = () => {
    playThumbsUp();
    setTimeout(() => {
      playCelebration();
    }, 200);
  };

  // Play error sound
  const playError = () => {
    // You can add error sound here
    console.log('Error sound');
  };

  return {
    // State
    soundsEnabled,

    // General methods
    playSound,
    stopSound,
    pauseSound,
    resumeSound,
    setVolume,
    setLoop,

    // Control methods
    toggleSounds,
    enableSounds,
    disableSounds,

    // Predefined sounds
    playCorrect,
    playCelebration,
    playEncouragement,
    playThumbsUp,
    playSuccess,
    playError,
  };
};

export default useSound;