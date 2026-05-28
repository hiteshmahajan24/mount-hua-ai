
export default function Controls({

  status,

  togglePlayback,

  seekAudio,

  changeVolume,

  changeSpeed

}) {

  function formatTime(seconds) {

    if (!seconds)
      return "0:00";

    const mins = Math.floor(
      seconds / 60
    );

    const secs = Math.floor(
      seconds % 60
    );

    return (
      `${mins}:` +
      `${secs.toString().padStart(2, "0")}`
    );

  }

  return (

    <div className="
      p-8
      flex
      flex-col
      gap-5
      bg-black/30
      backdrop-blur-xl
    ">

      {/* TIME */}

      <div className="
        flex
        justify-between
        text-zinc-300
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

      {/* SEEK */}

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

      {/* CONTROLS */}

      <div className="
        flex
        items-center
        justify-between
      ">

        {/* LEFT */}

        <div className="
          flex
          items-center
          gap-5
        ">

          {/* PLAY BUTTON */}

          <button

            onClick={togglePlayback}

            className="
              w-20
              h-20
              rounded-full
              bg-white
              text-black
              text-3xl
              hover:scale-105
              transition-all
              shadow-2xl
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

          {/* SPEED */}

          <select

            onChange={(e) =>

              changeSpeed(
                e.target.value
              )

            }

            defaultValue="1"

            className="
              bg-zinc-900
              px-4
              py-3
              rounded-xl
            "

          >

            <option value="0.75">
              0.75x
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

        </div>

        {/* VOLUME */}

        <div className="
          flex
          items-center
          gap-4
          w-[300px]
        ">

          <span className="text-2xl">

            🔊

          </span>

          <input

            type="range"

            min="0"

            max="300"

            value={status.volume}

            onChange={(e) =>

              changeVolume(
                e.target.value
              )

            }

            className="w-full"

          />

        </div>

      </div>

    </div>

  );

}
