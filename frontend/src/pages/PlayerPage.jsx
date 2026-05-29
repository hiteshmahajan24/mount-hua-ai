import {
  saveContinueWatching
} from "../utils/continueWatching";
import { useRef } from "react";

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

  const narrationRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] =
  useState(true);

  const [chapter, setChapter] =
    useState(285);

  const [status, setStatus] = useState({
  playing: false,
  paused: true,
  current_time: 0,
  duration: 0,
  volume: 300,
  speed: 1
});

  const [search, setSearch] =
    useState("");

  const [subtitlesEnabled, setSubtitlesEnabled] =
  useState(false);

  const [timestamps, setTimestamps] =
  useState([]);

const [currentSubtitle, setCurrentSubtitle] =
  useState(null);

  const [currentSubtitleIndex, setCurrentSubtitleIndex] =
  useState(-1);

    
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

useEffect(() => {

  const audio = narrationRef.current;

  if (!audio) return;

  const interval = setInterval(() => {

    setStatus(prev => ({

      ...prev,

      current_time:
        audio.currentTime || 0,

      duration:
        audio.duration || 0,

      paused:
        audio.paused,

      playing:
        !audio.paused

    }));

  }, 300);

  return () =>
    clearInterval(interval);

}, []);



///SUBTITLE TRACKER
useEffect(() => {

  const audio =
    narrationRef.current;

  if (!audio)
    return;

  const interval =
    setInterval(() => {

      const currentTime =
        audio.currentTime;

      const index =
        timestamps.findIndex(

          segment =>

            currentTime >= segment.start

            &&

            currentTime <= segment.end

        );

      setCurrentSubtitleIndex(
        index
      );

      if (index >= 0) {

        setCurrentSubtitle(
          timestamps[index]
        );

      } else {

        setCurrentSubtitle(
          null
        );

      }

    }, 100);

  return () =>
    clearInterval(interval);

}, [timestamps]);

  // ========================================
  // PLAY / PAUSE TOGGLE
  // ========================================
async function togglePlayback() {

  const audio = narrationRef.current;

  if (!audio)
    return;

  const currentChapterUrl =
    `${API}/audio/${chapter}`;

  // Same chapter already loaded

  if (
    audio.src.includes(
      `/audio/${chapter}`
    )
  ) {

    if (audio.paused)
      await audio.play();
    else
      audio.pause();

    return;

  }

  // New chapter selected

  const res = await fetch(
    `${API}/prepare/${chapter}`,
    {
      method: "POST"
    }
  );

  const data =
    await res.json();

        const subtitleRes =
      await fetch(
        API + data.timestamps_url
      );

    const subtitleData =
      await subtitleRes.json();

    setTimestamps(
      subtitleData
    );

  audio.src =
    API + data.audio_url;

  await audio.play();

}
  // ========================================
  // SEEK
  // ========================================

function seekAudio(value) {

  if (

    narrationRef.current

  ) {

    narrationRef.current.currentTime =
      value;

  }

}

  // ========================================
  // VOLUME
  // ========================================

function changeVolume(value) {

  if (narrationRef.current) {

    narrationRef.current.volume =
      value / 300;

  }

  setStatus(prev => ({

    ...prev,

    volume: Number(value)

  }));

}

  // ========================================
  // SPEED
  // ========================================
function changeSpeed(value) {

  if (

    narrationRef.current

  ) {

    narrationRef.current.playbackRate =
      value;

  }

}


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

    <button

  onClick={() =>

    setSubtitlesEnabled(
      prev => !prev
    )

  }

  className="
    absolute
    top-6
    right-24
    z-50
    px-4
    py-3
    rounded-xl
    bg-black/50
    backdrop-blur-xl
  "

>

  {

    subtitlesEnabled

    ?

    "📖 ON"

    :

    "📖 OFF"

  }

</button>
<button

  onClick={() =>

    setSidebarOpen(
      prev => !prev
    )

  }

  className="
    absolute
    top-6
    left-6
    z-50

    w-12
    h-12

    rounded-xl

    bg-black/50

    backdrop-blur-xl
  "

>

  ☰

</button>


      {/* SIDEBAR */}

      {

  sidebarOpen && (

    <Sidebar

      chapter={chapter}

      setChapter={setChapter}

      search={search}

      setSearch={setSearch}

    />

  )

}

      {/* PLAYER */}

      <div className="
        flex-1
        relative
        overflow-hidden
      ">

        <BackgroundVideo  />

        <div

          className={`
            absolute
            inset-0
            transition-all
            duration-500
            ${
              subtitlesEnabled
                ? "bg-black/55"
                : "bg-black/30"
            }
          `}

        />

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

            min-h-0

            px-8
          ">

            <SubtitleOverlay

            enabled={
              subtitlesEnabled
            }

            previousSubtitle={

              currentSubtitleIndex > 0

                ?

                timestamps[
                  currentSubtitleIndex - 1
                ]

                :

                null

            }

            subtitle={
              currentSubtitle
            }

            nextSubtitle={

              currentSubtitleIndex <
              timestamps.length - 1

                ?

                timestamps[
                  currentSubtitleIndex + 1
                ]

                :

                null

            }

          />
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
      <audio
  ref={narrationRef}
/>

    </div>

  );

}