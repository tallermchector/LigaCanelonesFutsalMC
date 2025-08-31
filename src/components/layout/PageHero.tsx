import React from 'react';

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <section className="relative bg-cover bg-center py-20 md:py-32 text-center text-white" style={{ backgroundImage: "url('/banner_.jpg')" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
