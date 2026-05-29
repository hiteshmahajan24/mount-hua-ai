import logo from "../assets/logos/logo_icon_transparent.png";
export default function Sidebar({

  chapter,
  setChapter,

  search,
  setSearch

}) {

  const chapters = Array.from(
    { length: 100 },
    (_, i) => 285 + i
  );

  const filtered = chapters.filter(

    (c) =>

      c.toString().includes(
        search
      )

  );

  return (

    <div className="
      w-[320px]
      h-full
      bg-zinc-950
      border-r
      border-zinc-800
      p-6
      flex
      flex-col
    ">

      {/* HEADER */}

      <div className="
        mb-8
        flex
        items-center
        gap-4
      ">

        <img

          src={logo}

          alt="Mount Hua"

          className="
            w-14
            h-14
            object-contain
          "

        />

        <div>

          <h1 className="
            text-4xl
            font-bold
          ">

            Mount Hua

          </h1>

          <p className="
            text-zinc-400
            text-sm
          ">

            Cinematic Audiobook

          </p>

        </div>

      </div>

      {/* SEARCH */}

      <input

        value={search}

        onChange={(e) =>

          setSearch(
            e.target.value
          )

        }

        placeholder="Search Chapter..."

        className="
          bg-zinc-900
          border
          border-zinc-700
          rounded-2xl
          px-5
          py-4
          outline-none
          mb-6
        "

      />

      {/* CHAPTERS */}

      <div className="
        flex-1
        overflow-y-auto
        space-y-3
      ">

        {filtered.map((c) => (

          <div

            key={c}

            onClick={() =>
              setChapter(c)
            }

            className={`
              rounded-2xl
              p-5
              cursor-pointer
              transition-all
              border

              ${
                chapter === c

                ?

                "bg-cyan-500/20 border-cyan-400"

                :

                "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              }
            `}

          >

            <p className="
              text-xl
              font-semibold
            ">

              Chapter {c}

            </p>

            <p className="
              text-zinc-400
              mt-1
            ">

              Mount Hua Sect

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}
