
export default function AnimeCard({

  title,
  chapter,
  image

}) {

  return (

    <div className="
      min-w-[250px]
      w-[250px]
      h-[150px]

      rounded-[28px]

      overflow-hidden

      relative

      group

      cursor-pointer

      transition-all
      duration-500

      hover:scale-[1.04]

      hover:-translate-y-1

      hover:shadow-[0_0_40px_rgba(34,211,238,0.22)]

      border
      border-white/10

      bg-black/30
      backdrop-blur-xl
    ">

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
          duration-700

          group-hover:scale-110
        "

      />

      {/* OVERLAY */}

      <div className="
        absolute
        inset-0

        bg-gradient-to-t
        from-black
        via-black/40
        to-transparent
      " />

      {/* CYAN GLOW */}

      <div className="
        absolute
        inset-0

        opacity-0

        group-hover:opacity-100

        transition-all
        duration-500

        bg-cyan-400/10
      " />

      {/* CONTENT */}

      <div className="
        absolute
        bottom-0
        left-0

        p-5

        z-10
      ">

        <p className="
          text-cyan-300

          text-[13px]

          font-semibold

          tracking-wide

          mb-1
        ">

          Chapter {chapter}

        </p>

        <h2 className="
          text-[1.45rem]

          leading-tight

          font-extrabold

          text-white

          drop-shadow-xl
        ">

          {title}

        </h2>

      </div>

    </div>

  );

}
