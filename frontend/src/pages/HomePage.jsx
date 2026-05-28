
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Play,
  Flame,
  Clock3,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Image,
  Film
} from "lucide-react";

import AnimeCard from "../components/AnimeCard";
import { useGlobalAudio } from "../components/AudioProvider";

import heroBg1 from "../assets/hero/hero_bg_1.jpg";
import heroBg2 from "../assets/hero/hero_bg_2.jpg";
import heroBg3 from "../assets/hero/hero_bg_3.jpg";

import logo from "../assets/logos/logo_primary.png";

import petal1 from "../assets/ui/petal_1.png";
import petal2 from "../assets/ui/petal_2.png";
import petal3 from "../assets/ui/petal_3.png";

import chapter285 from "../assets/chapters/chapter_285.jpg";
import chapter286 from "../assets/chapters/chapter_286.jpg";
import chapter287 from "../assets/chapters/chapter_287.jpg";
import chapter288 from "../assets/chapters/chapter_288.jpg";
import remaining from "../assets/chapters/remaining_chapters.jpg";

export default function HomePage() {

  const navigate = useNavigate();

  const {
    muted,
    toggleMute,
    startAudio
  } = useGlobalAudio();

  const wallpapers = [
    heroBg1,
    heroBg2,
    heroBg3
  ];

  const [bgIndex, setBgIndex] = useState(0);

  const [videoMode, setVideoMode] = useState(true);

  async function handleStart() {

    await startAudio();

    navigate("/player");

  }

  function nextBg() {

    setBgIndex(

      (prev) =>

        (prev + 1)
        % wallpapers.length

    );

  }

  function prevBg() {

    setBgIndex(

      (prev) =>

        prev === 0

        ?

        wallpapers.length - 1

        :

        prev - 1

    );

  }

  return (

    <div className="
      relative
      min-h-screen
      overflow-x-hidden
      bg-black
      text-white
    ">

      {/* BACKGROUND */}

      <div className="
        fixed
        inset-0
        z-0
        overflow-hidden
      ">

        {

          videoMode

          ?

          <video
            autoPlay
            muted
            loop
            playsInline
            className="
              absolute
              inset-0

              w-full
              h-full
              
              object-cover
              object-center
            "
            style={{
              filter:
                "brightness(0.45) contrast(1.05)"
            }}
          >

            <source
              src="/mounthua.mp4"
              type="video/mp4"
            />

          </video>

          :

          <div
            className="
              absolute
              inset-0
              bg-cover
              bg-center
              transition-all
              duration-700
              scale-105
            "
            style={{
              backgroundImage:
                `url(${wallpapers[bgIndex]})`,
              filter:
                "brightness(0.45)"
            }}
          />

        }

        {/* OVERLAYS */}

        <div className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/50
          via-black/20
          to-black
        " />

        <div className="
          absolute
          top-0
          right-0
          w-[700px]
          h-[700px]
          rounded-full
          bg-cyan-400/10
          blur-[140px]
        " />

      </div>

      {/* PETALS */}

      <img
        src={petal1}
        className="
          absolute
          top-[22%]
          left-[12%]
          w-8
          opacity-70
          z-20
          pointer-events-none
        "
      />

      <img
        src={petal2}
        className="
          absolute
          top-[35%]
          right-[20%]
          w-6
          opacity-60
          z-20
          pointer-events-none
        "
      />

      <img
        src={petal3}
        className="
          absolute
          bottom-[30%]
          left-[40%]
          w-5
          opacity-50
          z-20
          pointer-events-none
        "
      />

      {/* NAVBAR */}

      <nav className="
        relative
        z-40

        flex
        justify-between
        items-center

        px-8
        xl:px-14

        pt-8
      ">

        <img
          src={logo}
          alt="logo"
          className="
            h-16
            xl:h-20
            object-contain
          "
        />

        {/* RIGHT CONTROLS */}

        <div className="
          flex
          items-center
          gap-3
        ">

          {/* MODE */}

          <button

            onClick={() =>

              setVideoMode(
                !videoMode
              )

            }

            className="
              w-12
              h-12

              rounded-full

              bg-black/40
              backdrop-blur-xl

              border
              border-white/10

              flex
              items-center
              justify-center

              hover:scale-110
              hover:bg-cyan-400/20

              transition-all
            "

          >

            {

              videoMode

              ?

              <Film size={18} />

              :

              <Image size={18} />

            }

          </button>

          {/* LEFT */}

          <button

            onClick={prevBg}

            className="
              w-12
              h-12

              rounded-full

              bg-black/40
              backdrop-blur-xl

              border
              border-white/10

              flex
              items-center
              justify-center

              hover:scale-110
              hover:bg-cyan-400/20

              transition-all
            "

          >

            <ChevronLeft size={18} />

          </button>

          {/* RIGHT */}

          <button

            onClick={nextBg}

            className="
              w-12
              h-12

              rounded-full

              bg-black/40
              backdrop-blur-xl

              border
              border-white/10

              flex
              items-center
              justify-center

              hover:scale-110
              hover:bg-cyan-400/20

              transition-all
            "

          >

            <ChevronRight size={18} />

          </button>

          {/* AUDIO */}

          <button

            onClick={toggleMute}

            className="
              w-12
              h-12

              rounded-full

              bg-black/40
              backdrop-blur-xl

              border
              border-white/10

              flex
              items-center
              justify-center

              hover:scale-110
              hover:bg-cyan-400/20

              transition-all
            "

          >

            {

              muted

              ?

              <VolumeX size={20} />

              :

              <Volume2 size={20} />

            }

          </button>

        </div>

      </nav>

      {/* HERO */}

      <section className="
        relative
        z-30

        px-8
        xl:px-14

        pt-16

        min-h-[85vh]

        flex
        items-center
      ">

        <div className="
          max-w-[820px]
        ">

          {/* BADGE */}

          <div className="
            inline-flex
            items-center
            gap-2

            px-5
            py-3

            rounded-full

            bg-white/10
            backdrop-blur-md

            border
            border-white/10

            text-sm
            text-zinc-200

            mb-8
          ">

            <Sparkles size={15} />

            Cinematic AI Audiobook Experience

          </div>

          {/* TITLE */}

          <h1 className="
            text-[3.8rem]
            md:text-[5rem]
            xl:text-[6.2rem]

            leading-[0.88]

            font-black

            tracking-[-4px]

            drop-shadow-[0_5px_25px_rgba(0,0,0,0.8)]
          ">

            Return of the
            <br />
            Mount Hua Sect

          </h1>

          {/* DESCRIPTION */}

          <p className="
            mt-8

            text-zinc-300

            text-[1.1rem]

            leading-[1.9]

            max-w-[620px]
          ">

            Experience Mount Hua like never before
            with immersive AI narration,
            emotional character voices,
            subtitles and cinematic storytelling.

          </p>

          {/* BUTTONS */}

          <div className="
            flex
            gap-5
            mt-10
            flex-wrap
          ">

            <button

              onClick={handleStart}

              className="
                flex
                items-center
                gap-3

                px-10
                py-5

                rounded-2xl

                bg-cyan-400

                text-black
                font-bold
                text-xl

                hover:scale-105
                hover:bg-cyan-300

                transition-all

                shadow-[0_0_35px_rgba(34,211,238,0.35)]
              "

            >

              <Play
                size={20}
                fill="black"
              />

              Start Watching

            </button>

            <button

              onClick={() =>

                navigate("/player")

              }

              className="
                px-10
                py-5

                rounded-2xl

                bg-white/10
                backdrop-blur-md

                border
                border-white/10

                text-xl

                hover:bg-white/20

                transition-all
              "

            >

              ✨ Continue Journey

            </button>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="
        relative
        z-30

        px-8
        xl:px-14

        pb-20

        space-y-20

        mt-6
      ">

        {/* CONTINUE */}

        <div>

          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">

            <Clock3 className="text-cyan-300" />

            <h2 className="
              text-3xl
              font-bold
            ">

              Continue Watching

            </h2>

          </div>

          <div className="
            flex
            gap-6
            overflow-x-auto
            pb-2
          ">

            <AnimeCard
              title="Mount Hua Return"
              chapter="285"
              image={chapter285}
            />

          </div>

        </div>

        {/* TRENDING */}

        <div>

          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">

            <Flame className="text-orange-400" />

            <h2 className="
              text-3xl
              font-bold
            ">

              Trending Chapters

            </h2>

          </div>

          <div className="
            flex
            gap-6
            overflow-x-auto
            pb-2
          ">

            <AnimeCard
              title="The Heavenly Battle"
              chapter="286"
              image={chapter286}
            />

            <AnimeCard
              title="Sword Saint Legacy"
              chapter="287"
              image={chapter287}
            />

            <AnimeCard
              title="Mount Hua Awakens"
              chapter="288"
              image={chapter288}
            />

          </div>

        </div>

        {/* MORE */}

        <div>

          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">

            <Sparkles className="text-pink-300" />

            <h2 className="
              text-3xl
              font-bold
            ">

              More Chapters

            </h2>

          </div>

          <div className="
            flex
            gap-6
            overflow-x-auto
            pb-2
          ">

            <AnimeCard
              title="Future Chaos"
              chapter="290+"
              image={remaining}
            />

            <AnimeCard
              title="Peak Chung Myung"
              chapter="300+"
              image={remaining}
            />

            <AnimeCard
              title="Legendary Sect"
              chapter="310+"
              image={remaining}
            />

          </div>

        </div>

      </section>

    </div>

  );

}
