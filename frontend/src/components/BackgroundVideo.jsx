
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

    >

      <source

        src="/mounthua.mp4"

        type="video/mp4"

      />

    </video>

  );

}
