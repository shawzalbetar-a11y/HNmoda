'use client';

export function Hero() {
  const heroImageUrl = "https://res.cloudinary.com/dgyryuy30/image/upload/v1768170515/%D8%AE%D9%84%D9%81%D9%8A%D8%A9_%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9_idbblk.jpg";

  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
        data-ai-hint="fashion workspace fabric sewing"
      />
      <div className="absolute inset-0 bg-black/30" />
      {/* Centered Text Overlay */}
      <div className="relative z-10 text-center bg-background/50 backdrop-blur-sm p-8 rounded-xl">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground">
          HUMAN NATURE
        </h1>
        <p className="mt-2 text-lg text-foreground/80">hnmoda</p>
      </div>
    </section>
  );
}
