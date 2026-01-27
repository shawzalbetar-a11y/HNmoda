'use client';

export function Hero() {
  // To use your own image, place it in the `public/images` folder
  // and name it `hero-background.jpg`.
  const heroImageUrl = "/images/hero-background.jpg";

  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
        data-ai-hint="luxury fabric rolls"
      />
      <div className="absolute inset-0 bg-black/30" />
      {/* Centered Text Overlay */}
      <div className="relative z-10 text-center bg-background/50 backdrop-blur-sm p-8 rounded-xl">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground">
          HUMAN NATURE
        </h1>
        <p className="mt-2 text-lg text-foreground/80">HN MODA</p>
      </div>
    </section>
  );
}
