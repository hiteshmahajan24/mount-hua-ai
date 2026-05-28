
import {

  createContext,
  useContext,
  useEffect,
  useRef,
  useState

} from "react";

const AudioContext = createContext();

export function AudioProvider({

  children

}) {

  const audioRef = useRef(null);

  const [muted, setMuted] =
    useState(false);

  const [started, setStarted] =
    useState(false);

  const [volume, setVolume] =
    useState(0.35);

  // ========================================
  // INIT AUDIO
  // ========================================

  useEffect(() => {

    const audio = new Audio(
      "/mounthua.mp4"
    );

    audio.loop = true;

    audio.volume = volume;

    audioRef.current = audio;

  }, []);

  // ========================================
  // START AUDIO
  // ========================================

  async function startAudio() {

    if (
      audioRef.current
      &&
      !started
    ) {

      try {

        await audioRef.current.play();

        setStarted(true);

        console.log(
          "Background audio started"
        );

      } catch (err) {

        console.log(
          "Audio failed:",
          err
        );

      }

    }

  }

  // ========================================
  // UPDATE VOLUME
  // ========================================

  useEffect(() => {

    if (audioRef.current) {

      audioRef.current.volume = muted
        ? 0
        : volume;

    }

  }, [muted, volume]);

  // ========================================
  // TOGGLE MUTE
  // ========================================

  function toggleMute() {

    setMuted(prev => !prev);

  }

  return (

    <AudioContext.Provider

      value={{

        muted,
        toggleMute,

        volume,
        setVolume,

        startAudio

      }}

    >

      {children}

    </AudioContext.Provider>

  );

}

export function useGlobalAudio() {

  return useContext(AudioContext);

}
