import {
  saveContinueWatching
} from "../utils/continueWatching";

import chapter285 from "../assets/chapters/chapter_285.jpg";
import chapter286 from "../assets/chapters/chapter_286.jpg";
import chapter287 from "../assets/chapters/chapter_287.jpg";
import chapter288 from "../assets/chapters/chapter_288.jpg";

import { useEffect, useState } from "react";

import BackgroundVideo from "../components/BackgroundVideo";
import SubtitleOverlay from "../components/SubtitleOverlay";
import Controls from "../components/Controls";
import Sidebar from "../components/Sidebar";
import { useGlobalAudio }
from "../components/AudioProvider";


export default function Player() {

  const [chapter, setChapter] =
    useState(285);

  const [status, setStatus] =
    useState({

      playing: false,

      paused: false,

      current_time: 0,

      duration: 0,

      volume: 100,

      speed: 1,

    });

  const [search, setSearch] =
    useState("");

    
  const {

    muted,
    toggleMute,
    startAudio

  } = useGlobalAudio();


  const API = "http://127.0.0.1:8000";    


const chapterImages = {

  285: chapter285,
  286: chapter286,
  287: chapter287,
  288: chapter288,

};


  // ========================================
  // FETCH STATUS
  // ========================================

  async function fetchStatus() {

    try {

      const res = await fetch(
        `${API}/status`
      );

      const data = await res.json();

      setStatus(data);

    } catch (err) {

      console.log(err);

    }

  }

  // ========================================
  // PLAY / PAUSE TOGGLE
  // ========================================

  async function togglePlayback() {

    // ====================================
    // PAUSE
    // ====================================

    if (

      status.playing

      &&

      !status.paused

    ) {

      await fetch(

        `${API}/pause`,

        {
          method: "POST"
        }

      );

    }

    // ====================================
    // PLAY / RESUME
    // ====================================

    else {

      await fetch(

        `${API}/play/${chapter}`,

        {
          method: "POST"
        }

      );

    }

    // ====================================
    // REFRESH
    // ====================================

    setTimeout(
      fetchStatus,
      200
    );

  }

  // ========================================
  // SEEK
  // ========================================

  async function seekAudio(value) {

    await fetch(

      `${API}/seek/${value}`,

      {
        method: "POST"
      }

    );

  }

  // ========================================
  // VOLUME
  // ========================================

  async function changeVolume(value) {

    await fetch(

      `${API}/volume/${value}`,

      {
        method: "POST"
      }

    );

  }

  // ========================================
  // SPEED
  // ========================================

  async function changeSpeed(value) {

    await fetch(

      `${API}/speed/${value}`,

      {
        method: "POST"
      }

    );

  }

  // ========================================
  // AUTO REFRESH
  // ========================================

  useEffect(() => {

    fetchStatus();

    const interval = setInterval(

      fetchStatus,

      500

    );

    return () =>
      clearInterval(interval);

  }, []);


  //AUTO SAVE PROGRESS
useEffect(() => {

  if (!status.duration)
    return;

  const interval = setInterval(() => {

    const progress = Math.floor(

      (
        status.current_time
        /
        status.duration
      ) * 100

    );

    saveContinueWatching({

      chapter,

      title:
        "Mount Hua Return",

      image:
        chapterImages[chapter],

      progress,

      currentTime:
        status.current_time,

      duration:
        status.duration

    });

  }, 5000);

  return () =>
    clearInterval(interval);

}, [

  status.current_time,
  status.duration,
  chapter

]);


  return (

    <div className="
      w-screen
      h-screen
      flex
      bg-black
      text-white
      overflow-hidden
    ">

      
    <button

      onClick={toggleMute}

      className="
        absolute
        top-6
        right-6
        z-50
        w-14
        h-14
        rounded-full
        bg-black/50
        backdrop-blur-xl
        text-2xl
        hover:scale-110
        transition-all
      "

    >

      {

        muted

        ?

        "🔇"

        :

        "🎵"

      }

    </button>


      {/* SIDEBAR */}

      <Sidebar

        chapter={chapter}

        setChapter={setChapter}

        search={search}

        setSearch={setSearch}

      />

      {/* PLAYER */}

      <div className="
        flex-1
        relative
        overflow-hidden
      ">

        <BackgroundVideo  />

        <div className="
          absolute
          inset-0
          bg-black/30
        " />

        <div className="
          relative
          z-10
          w-full
          h-full
          flex
          flex-col
        ">

          {/* HEADER */}

          <div className="p-8">

            <h1 className="
              text-5xl
              font-bold
            ">

              Return of the Mount Hua Sect

            </h1>

            <p className="
              text-zinc-300
              mt-3
              text-lg
            ">

              Chapter {chapter}

            </p>

          </div>

          {/* SUBTITLE */}

          <div className="
            flex-1
            flex
            items-center
            justify-center
          ">

            <SubtitleOverlay />

          </div>

          {/* CONTROLS */}

          <Controls

            status={status}

            togglePlayback={togglePlayback}

            seekAudio={seekAudio}

            changeVolume={changeVolume}

            changeSpeed={changeSpeed}

          />

        </div>

      </div>

    </div>

  );

}