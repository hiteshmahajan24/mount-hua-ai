import {
  saveContinueWatching
} from "../utils/continueWatching";
import { useRef } from "react";

import chapter285 from "../assets/chapters/chapter_285.jpg";
import chapter286 from "../assets/chapters/chapter_286.jpg";
import chapter287 from "../assets/chapters/chapter_287.jpg";
import chapter288 from "../assets/chapters/chapter_288.jpg";


import bg1 from "../assets/player/player_bg_blossoms2.jpg";
import bg2 from "../assets/player/player_bg_skytemple.jpg";
import bg3 from "../assets/player/player_bg_night.jpg";
import bg4 from "../assets/player/player_bg_blossoms.jpg";
import bg5 from "../assets/player/player_bg_training.jpg";

import { useEffect, useState } from "react";

import BackgroundVideo from "../components/BackgroundVideo";
import SubtitleOverlay from "../components/SubtitleOverlay";
import Controls from "../components/Controls";
import Sidebar from "../components/Sidebar";
import { useGlobalAudio }
from "../components/AudioProvider";


export default function Player() {

  const backgrounds = [

  bg1,
  bg2,
  bg3,
  bg4,
  bg5

];

const [backgroundMode, setBackgroundMode] =
  useState("video");

const [backgroundIndex, setBackgroundIndex] =
  useState(0);

  const narrationRef = useRef(null);
  const playerRef = useRef(null);

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
  
 // const API =
  //"http://192.168.31.242:8000";

  // const API =
  // `http://${window.location.hostname}:8000`;


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


useEffect(() => {

  const savedMode =
    localStorage.getItem(
      "backgroundMode"
    );

  const savedIndex =
    localStorage.getItem(
      "backgroundIndex"
    );

  if (savedMode)
    setBackgroundMode(
      savedMode
    );

  if (savedIndex)
    setBackgroundIndex(
      Number(savedIndex)
    );

}, []);

useEffect(() => {

  localStorage.setItem(
    "backgroundMode",
    backgroundMode
  );

  localStorage.setItem(
    "backgroundIndex",
    backgroundIndex
  );

}, [

  backgroundMode,
  backgroundIndex

]);


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



function nextBackground() {

  setBackgroundIndex(

    prev =>

      (prev + 1)

      %

      backgrounds.length

  );

}

function previousBackground() {

  setBackgroundIndex(

    prev =>

      prev === 0

        ?

        backgrounds.length - 1

        :

        prev - 1

  );

}


function toggleFullscreen() {

  if (!document.fullscreenElement) {

    playerRef.current?.requestFullscreen();

  }

  else {

    document.exitFullscreen();

  }

}
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


//top right buttons 
const topButtonClass = `
  w-14
  h-14

  rounded-full

  bg-black/40

  backdrop-blur-xl

  border
  border-white/10

  flex
  items-center
  justify-center

  text-xl

  hover:scale-105
  hover:bg-white/10

  transition-all
  duration-300
`;


  return (

   <div

      ref={playerRef}

      className="
        w-screen
        h-screen
        flex
        bg-black
        text-white
        overflow-hidden
      "

    >

      <div

  className="
    absolute
    top-6
    right-6

    z-50

    flex
    items-center
    gap-3
  "

>

  {/* wallpaper */}
   <button

  onClick={() =>

    setBackgroundMode(

      prev =>

        prev === "video"

          ? "image"

          : "video"

    )

  }

  className={`
    ${topButtonClass}

    ${
      backgroundMode === "image"

        ? "bg-cyan-500/30 border-cyan-400"

        : ""
    }
  `}

>

  🖼

</button>
  {/* previous */}
  
   <button

  onClick={previousBackground}

  className={topButtonClass}

>

  ❮

</button>

  {/* next */}
  
     <button

  onClick={nextBackground}

  className={topButtonClass}

>

  ❯

</button>
  {/* subtitles */}
       <button

  onClick={() =>

    setSubtitlesEnabled(
      prev => !prev
    )

  }

  className={`
    ${topButtonClass}

    font-bold
    text-sm

    ${
      subtitlesEnabled

        ? "bg-cyan-500/30 border-cyan-400"

        : ""
    }
  `}

>

  CC

</button>


  {/* audio */}
  <button

  onClick={toggleMute}

  className={`
    ${topButtonClass}

    ${
      !muted

        ? "bg-cyan-500/30 border-cyan-400"

        : ""
    }
  `}

>

  {

    muted

      ? "🔇"

      : "🔊"

  }

</button>

</div>
    


     


   

      {/* SIDEBAR */}

      <div className="relative">

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

  <button

    onClick={() =>

      setSidebarOpen(
        prev => !prev
      )

    }

    className="
      absolute
      top-1/2
      -right-4

      -translate-y-1/2

      z-50

      w-8
      h-20

      rounded-r-xl

      bg-cyan-500

      text-black

      font-bold

      shadow-lg
    "

  >

    {

      sidebarOpen

        ? "◀"

        : "▶"

    }

  </button>

</div>

      {/* PLAYER */}

      <div className="
        flex-1
        relative
        overflow-hidden
      ">

        {

  backgroundMode === "video"

  ? (

      <BackgroundVideo />

    )

  : (

      <img

        src={
          backgrounds[
            backgroundIndex
          ]
        }

        alt="background"

        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "

      />

    )

}

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

            toggleFullscreen={
              toggleFullscreen
            }

          />

        </div>

      </div>
      <audio
  ref={narrationRef}
/>

    </div>

  );

}