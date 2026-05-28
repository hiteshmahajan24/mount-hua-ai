
import {

  useNavigate

} from "react-router-dom";

import {

  useGlobalAudio

} from "../components/AudioProvider";

import AnimeCard from "../components/AnimeCard";

import {

  Flame,
  Clock3

} from "lucide-react";

export default function HomePage() {

  const navigate = useNavigate();

  const {

    muted,
    toggleMute,
    startAudio

  } = useGlobalAudio();

  return (

    <div

      onMouseEnter={() => {

        startAudio();

      }}

      className="
        w-screen
        h-screen
        bg-black
        text-white
        overflow-hidden
        relative
      "

    >

      {/* BACKGROUND VIDEO */}

      <video

        autoPlay
        muted
        loop

        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          scale-105
        "

        style={{

          filter:
            "brightness(0.55) contrast(1.1) saturate(1.1)"

        }}

      >

        <source
          src="/mounthua.mp4"
          type="video/mp4"
        />

      </video>

      {/* CINEMATIC OVERLAY */}

      <div className="
        absolute
        inset-0
        bg-gradient-to-b
        from-black/50
        via-black/20
        to-black/90
      " />

      {/* TOP BAR */}

      <div className="
        absolute
        top-0
        left-0
        w-full
        z-50
        flex
        justify-between
        items-center
        px-10
        py-6
      ">

        {/* LOGO */}

        <h1 className="
          text-3xl
          font-black
          tracking-wide
          text-cyan-300
        ">

          Mount Hua AI

        </h1>

        {/* MUSIC BUTTON */}

        <button

          onClick={toggleMute}

          className="
            w-14
            h-14
            rounded-full
            bg-black/40
            backdrop-blur-xl
            border
            border-white/10
            text-2xl
            hover:scale-110
            hover:bg-cyan-400/20
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

      </div>

      {/* HERO CONTENT */}

      <div className="
        relative
        z-20
        h-full
        flex
        flex-col
        justify-center
        px-24
        pb-40
      ">

        <h1 className="
          text-8xl
          font-black
          max-w-[950px]
          leading-[0.95]
          floaty
          drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]
        ">

          Return of the
          Mount Hua Sect

        </h1>

        <p className="
          mt-8
          text-zinc-300
          text-2xl
          max-w-[750px]
          leading-relaxed
        ">

          Cinematic AI-powered
          audiobook experience with
          immersive narration,
          emotional character voices,
          subtitles and anime-style playback.

        </p>

        {/* BUTTONS */}

        <div className="
          flex
          gap-6
          mt-12
        ">

          <button

            onClick={async () => {

              await startAudio();

              navigate("/player");

            }}

            className="
              px-12
              py-5
              rounded-2xl
              bg-cyan-400
              text-black
              text-2xl
              font-bold
              hover:scale-105
              hover:bg-cyan-300
              transition-all
              shadow-[0_0_35px_rgba(34,211,238,0.45)]
            "

          >

            ▶ Start Watching

          </button>

          <button

            className="
              px-12
              py-5
              rounded-2xl
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              text-2xl
              hover:bg-white/20
              transition-all
            "

          >

            ✨ Continue Journey

          </button>

        </div>

      </div>

      {/* BOTTOM SECTIONS */}

      <div className="
        absolute
        bottom-0
        left-0
        w-full
        z-30
        px-10
        pb-10
        space-y-10
      ">

        {/* CONTINUE */}

        <div>

          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">

            <Clock3
              className="
                text-cyan-300
              "
            />

            <h2 className="
              text-2xl
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
              image="/mount_hua_card.jpg"
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

            <Flame
              className="
                text-orange-400
              "
            />

            <h2 className="
              text-2xl
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
              image="/mount_hua_card.jpg"
            />

            <AnimeCard
              title="Sword Saint Legacy"
              chapter="287"
              image="/mount_hua_card.jpg"
            />

            <AnimeCard
              title="Mount Hua Awakens"
              chapter="288"
              image="/mount_hua_card.jpg"
            />

          </div>

        </div>

      </div>

    </div>

  );

}
