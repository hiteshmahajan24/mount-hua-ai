
export default function BackgroundVideo() {

  return (

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
      "
      style={{
        filter:
          "contrast(1.1) saturate(1.1)"
      }}

    >

      <source

        src="/mounthua.mp4"

        type="video/mp4"

      />

    </video>

  );

}
