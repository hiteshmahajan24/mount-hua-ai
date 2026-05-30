import {

  saveProgress,
  getChapterProgress

}

from "../utils/progress";
import { useRef } from "react";
import {
  useSearchParams
}
from "react-router-dom";

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


import { loadChapters }
from "../utils/chapters";

export default function Player() {

  const [searchParams] =
  useSearchParams();

  const autoPlayFromUrl =

  searchParams.get(
    "autoplay"
  ) === "1";

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

  const [autoNext, setAutoNext] =
useState(

  localStorage.getItem(
    "mount_hua_autonext"
  ) === "true"

);

 const [chapter, setChapter] =
  useState(

    Number(

      searchParams.get(
        "chapter"
      )

    )

    || 285

  );
  const [status, setStatus] = useState({
  playing: false,
  paused: true,
  current_time: 0,
  duration: 0,
  volume: 300,
  speed: 1
});



const [chaptersMap, setChaptersMap] =
  useState({});

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



  const API =
  `http://${window.location.hostname}:8000`;
  //const API = "http://127.0.0.1:8000";  
  
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

const firstLoadRef =
  useRef(true);

const shouldAutoPlayRef =
  useRef(false);

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


useEffect(() => {

  const audio =
    narrationRef.current;

  if (!audio)
    return;

  audio.onended = () => {

    saveCurrentProgress();

    if (autoNext) {

      shouldAutoPlayRef.current =
      true;

      setChapter(
        prev => prev + 1
      );

    }

  };

}, [autoNext]);


useEffect(() => {

  async function fetchChapters() {

    const chapters =
      await loadChapters();

    const map = {};

    chapters.forEach(chapter => {

      map[
        chapter.chapter
      ] = chapter;

    });

    setChaptersMap(map);

  }

  fetchChapters();

}, []);

useEffect(() => {

  const audio =
    narrationRef.current;

  if (!audio)
    return;

  audio.pause();

  audio.removeAttribute("src");

  audio.load();

  setStatus(prev => ({

    ...prev,

    current_time: 0,
    duration: 0,

    playing: false,
    paused: true

  }));

  setCurrentSubtitle(null);

  setCurrentSubtitleIndex(-1);

  setTimestamps([]);

}, [chapter]);

useEffect(() => {

  if (

    shouldAutoPlayRef.current

  ) {

    shouldAutoPlayRef.current =
      false;

    setTimeout(() => {

      togglePlayback();

    }, 200);

  }

}, [chapter]);


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

function changeChapter(newChapter) {

  const audio =
    narrationRef.current;

  if (

    audio

    &&

    audio.duration > 0

  ) {

   const duration =
  narrationRef.current
    ?.duration || 0;

if (!duration)
  return;

const progress =
  Math.floor(

    (
      narrationRef.current
        .currentTime

      /

      duration

    ) * 100

  );
   saveProgress(

  chapter,

  narrationRef.current
    ?.currentTime || 0,

  narrationRef.current
    ?.duration || 0

);

  }

  shouldAutoPlayRef.current =
  true;

  setChapter(
    newChapter
  );

}

function previousChapter() {

  if (chapter <= 285)
    return;

  shouldAutoPlayRef.current =
    true;

  setChapter(
    chapter - 1
  );

}
function nextChapter() {

  shouldAutoPlayRef.current =
    true;

  setChapter(
    chapter + 1
  );

}
function toggleAutoNext() {

  const next =
    !autoNext;

  setAutoNext(next);

  localStorage.setItem(

    "mount_hua_autonext",

    next

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
  saveCurrentProgress();

  const audio = narrationRef.current;

  if (!audio)
    return;

  // Same chapter already loaded

  if (

  audio.src.endsWith(
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

audio.onloadedmetadata =
async () => {

  let savedTime = 0;

  if (

    firstLoadRef.current

  ) {

    savedTime =
      Number(

        searchParams.get(
          "time"
        )

      ) || 0;

    firstLoadRef.current =
      false;

  }

  if (!savedTime) {

    const saved =
      getChapterProgress(
        chapter
      );

    savedTime =
      saved?.time || 0;

    console.log(
      "RESTORE:",
      saved
    );

  }

  if (

    savedTime > 0

    &&

    savedTime < audio.duration

  ) {

    audio.currentTime =
      savedTime;

      console.log(
        "AFTER SEEK:",
        audio.currentTime
      );

  }

  if (

  autoPlayFromUrl

) {

  shouldAutoPlayRef.current =
    true;

} {

  await audio.play();

}

};
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


function saveCurrentProgress() {

  const audio =
    narrationRef.current;

  if (!audio)
    return;

  if (!audio.duration)
    return;

  saveProgress(

    chapter,

    audio.currentTime,

    audio.duration

  );

}

  //AUTO SAVE PROGRESS
useEffect(() => {

  if (!status.duration)
    return;

  const interval =
    setInterval(() => {

      const progress =
        Math.floor(

          (
            narrationRef.current
              ?.currentTime

            /

            narrationRef.current
              ?.duration

          ) * 100

        );

      saveProgress(

  chapter,

  narrationRef.current
    ?.currentTime || 0,

  narrationRef.current
    ?.duration || 0

);
    }, 5000);

  return () =>
    clearInterval(
      interval
    );

}, [

  chapter,
  chaptersMap
]);


useEffect(() => {

  const handler = () => {

    saveCurrentProgress();

  };

  window.addEventListener(
    "beforeunload",
    handler
  );

  return () =>

    window.removeEventListener(
      "beforeunload",
      handler
    );

}, [

  chapter,
  chaptersMap
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
        setChapter={
          changeChapter
        }

        search={search}
        setSearch={setSearch}

        chaptersMap={
          chaptersMap
        }

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

        


         <div className="
            absolute
            top-6
            left-8
            z-40
            ">

              <h1 className="
                text-4xl
                font-bold
              ">
                {chaptersMap[chapter]?.title}
              </h1>

              <p className="
                text-zinc-300
                mt-1
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

          chapter={chapter}

          previousChapter={
            previousChapter
          }

          nextChapter={
            nextChapter
          }

          autoNext={
            autoNext
          }

          toggleAutoNext={
            toggleAutoNext
          }
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