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
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

          <button

            onClick={
              togglePlayback
            }

            className="
              w-12
              h-12

              rounded-full

              bg-white

              text-black

              text-lg

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

        <div className="
          flex
          items-center

          gap-2

          w-[180px]
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

            className="w-full"

          />

        </div>

      </div>

    </div>

  );

}