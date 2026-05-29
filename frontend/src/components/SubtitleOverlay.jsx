export default function SubtitleOverlay({

  enabled,

  previousSubtitle,

  subtitle,

  nextSubtitle

}) {

  if (!enabled) {

    return (

      <div className="
        max-w-4xl
        text-center
        px-8
      ">

        <p className="
          text-4xl
          font-semibold
          leading-relaxed
          text-white
          drop-shadow-[0_3px_6px_rgba(0,0,0,1)]
        ">

          “The Mount Hua Sect shall rise again.”

        </p>

      </div>

    );

  }

  function trimPrevious(
    text,
    max = 110
  ) {

    if (!text)
      return "";

    if (text.length <= max)
      return text;

    return (
      "..." +
      text.slice(
        text.length - max
      )
    );

  }

  function trimNext(
    text,
    max = 110
  ) {

    if (!text)
      return "";

    if (text.length <= max)
      return text;

    return (
      text.slice(0, max) +
      "..."
    );

  }

  const previousText =
    trimPrevious(
      previousSubtitle?.text
    );

  const currentText =
    subtitle?.text ||
    "Loading subtitles...";

  const nextText =
    trimNext(
      nextSubtitle?.text
    );

  return (

    <div className="
      w-full
      max-w-6xl

      flex
      flex-col

      items-center
      justify-center

      text-center

      px-8
    ">

      {/* PREVIOUS */}

      <div className="
        min-h-[70px]

        flex
        items-center
        justify-center
      ">

        <p className="
          text-3xl

          italic

          text-zinc-300

          opacity-50
        ">

          {previousText}

        </p>

      </div>

      {/* CURRENT */}

      <div className="
        min-h-[180px]

        flex
        items-center
        justify-center
      ">

        <p

          key={
            subtitle?.start
          }

          className="
            text-5xl

            font-bold

            leading-relaxed

            text-white

            drop-shadow-[0_4px_14px_rgba(0,0,0,1)]

            transition-all
            duration-500
          "

        >

          {currentText}

        </p>

      </div>

      {/* NEXT */}

      <div className="
        min-h-[70px]

        flex
        items-center
        justify-center
      ">

        <p className="
          text-3xl

          italic

          text-zinc-300

          opacity-50
        ">

          {nextText}

        </p>

      </div>

    </div>

  );

}