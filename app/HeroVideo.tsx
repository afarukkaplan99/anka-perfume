export default function HeroVideo() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* okunabilirlik için overlay */}
      <div className="absolute inset-0 bg-black/45" />
    </div>
  );
}
