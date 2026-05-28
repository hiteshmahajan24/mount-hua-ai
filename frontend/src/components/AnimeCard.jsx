
export default function AnimeCard({

  title,
  chapter,
  image

}) {

  return (

    <div className="
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
        ">

          {title}

        </h2>

      </div>

    </div>

  );

}
