
import { useEffect, useState } from "react";

import BackgroundVideo from "./BackgroundVideo";
import SubtitleOverlay from "./SubtitleOverlay";
import Controls from "./Controls";
import Sidebar from "./Sidebar";

const API = "http://127.0.0.1:8000";

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

  return (

    <div className="
      w-screen
      h-screen
      flex
      bg-black
      text-white
      overflow-hidden
    ">

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

        <BackgroundVideo />

        <div className="
          absolute
          inset-0
          bg-black/50
          backdrop-blur-[2px]
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