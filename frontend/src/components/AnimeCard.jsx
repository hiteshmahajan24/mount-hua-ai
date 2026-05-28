
export default function AnimeCard({

  title,
  chapter,
  image,

  progress = 0,

  onClick

}) {

  return (

    <div

      onClick={onClick}

      className="
        min-w-[320px]
        h-[200px]

        rounded-3xl
        overflow-hidden

        relative
        group

        cursor-pointer

        transition-all

        hover:scale-[1.03]

        hover:shadow-[0_0_40px_rgba(34,211,238,0.35)]
      "

    >

      {/* IMAGE */}

      <img

        src={image}

        className="
          absolute
          inset-0

          w-full
          h-full

          object-cover

          transition-all
          duration-500

          group-hover:scale-110
        "

      />

      {/* OVERLAY */}

      <div className="
        absolute
        inset-0

        bg-gradient-to-t
        from-black
        via-black/30
        to-transparent
      " />

      {/* CONTENT */}

      <div className="
        absolute
        bottom-0
        left-0

        w-full

        p-6
      ">

        <p className="
          text-cyan-300
          text-sm
          mb-2
        ">

          Chapter {chapter}

        </p>

        <h2 className="
          text-2xl
          font-bold
          leading-tight
        ">

          {title}

        </h2>

        {/* PROGRESS */}

        {

          progress > 0

          &&

          <div className="mt-4">

            <div className="
              w-full
              h-2

              rounded-full

              bg-white/10
              overflow-hidden
            ">

              <div

                className="
                  h-full
                  rounded-full

                  bg-cyan-400

                  shadow-[0_0_15px_rgba(34,211,238,0.8)]
                "

                style={{
                  width:
                    `${progress}%`
                }}

              />

            </div>

            <p className="
              text-xs
              text-zinc-300
              mt-2
            ">

              {progress}% completed

            </p>

          </div>

        }

      </div>

    </div>

  );

}
