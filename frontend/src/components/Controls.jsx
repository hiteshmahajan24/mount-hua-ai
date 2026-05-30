export default function Controls({

  status,

  togglePlayback,

  seekAudio,

  changeVolume,

  changeSpeed,

  previousChapter,

  nextChapter,

  autoNext,

  toggleAutoNext,

  toggleFullscreen

}){

  function formatTime(seconds) {

    if (!seconds)
      return "0:00";

    const mins =
      Math.floor(seconds / 60);

    const secs =
      Math.floor(seconds % 60);

    return (
      `${mins}:` +
      `${secs.toString().padStart(2, "0")}`
    );

  }

  return (

    <div className="
      px-6
      py-3

      flex
      flex-col

      gap-2

      bg-black/20
      backdrop-blur-md
    ">

      <div className="
        flex
        justify-between

        text-zinc-300
        text-sm
      ">

        <span>

          {formatTime(
            status.current_time
          )}

        </span>

        <span>

          {formatTime(
            status.duration
          )}

        </span>

      </div>

      <input

        type="range"

        min="0"

        max={
          status.duration || 0
        }

        value={
          status.current_time || 0
        }

        onChange={(e) =>

          seekAudio(
            e.target.value
          )

        }

        className="w-full"

      />

      <div className="
        flex
        items-center
        justify-between
          gap-6

      ">

        <div className="
  flex
  items-center
  gap-3
">

  <button

    onClick={
      previousChapter
    }

    className="
      w-12
      h-12

      rounded-full

      bg-zinc-900

      hover:bg-zinc-800

      transition-all
    "
  >

    ⏮

  </button>

  <button

    onClick={
      togglePlayback
    }

    className="
      w-14
      h-14

      rounded-full

      bg-white

      text-black

      text-xl

      hover:scale-105

      transition-all
    "
  >

    {

      status.playing

      &&

      !status.paused

      ?

      "⏸"

      :

      "▶"

    }

  </button>

  <button

    onClick={
      nextChapter
    }

    className="
      w-12
      h-12

      rounded-full

      bg-zinc-900

      hover:bg-zinc-800

      transition-all
    "
  >

    ⏭

  </button>

  <select

    onChange={(e) =>
      changeSpeed(
        e.target.value
      )
    }

    defaultValue="1"

    className="
      bg-zinc-900
      px-3
      py-2
      rounded-xl
    "

  >

    <option value="0.9">
      0.9x
    </option>

    <option value="1">
      1x
    </option>

    <option value="1.25">
      1.25x
    </option>

    <option value="1.5">
      1.5x
    </option>

    <option value="2">
      2x
    </option>

  </select>

  <button

    onClick={
      toggleAutoNext
    }

    className={`

      px-4
      py-2

      rounded-xl

      transition-all

      ${

        autoNext

        ?

        "bg-cyan-500 text-black"

        :

        "bg-zinc-900 text-white"

      }

    `}
  >

    ⟳ Auto

  </button>

</div>

  <div className="
  flex
  items-center
  gap-4
">

  <span>

    🔊

  </span>

  <input

    type="range"

    min="0"

    max="300"

    value={
      status.volume
    }

    onChange={(e) =>
      changeVolume(
        e.target.value
      )
    }

    className="
      w-[180px]
    "

  />

  <button

    onClick={
      toggleFullscreen
    }

    className="
      w-10
      h-10

      rounded-lg

      bg-zinc-900

      hover:bg-zinc-800

      transition-all
    "

  >

    ⛶

  </button>

</div>

      </div>

    </div>

  );

}