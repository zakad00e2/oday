import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionary-context";
import type { Locale } from "@/lib/i18n/config";

const avatars = [
  "https://i.pravatar.cc/80?img=1",
  "https://i.pravatar.cc/80?img=2",
  "https://i.pravatar.cc/80?img=3",
  "https://i.pravatar.cc/80?img=4",
];

export default function Hero({
  hero,
  lang,
}: {
  hero: Dictionary["hero"];
  lang: Locale;
}) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/IMG_3734 (1).PNG"
          alt={hero.heroImageAlt}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-right sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto -mt-11 animate-fade-in-up">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl ${lang === "en" ? "lg:text-6xl font-medium" : "lg:text-7xl font-semibold"} text-white leading-tight mb-6`}
        >
          {hero.titleLine1}
          <br />
          <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            {hero.titleLine2}
          </span>
        </h1>

        <div className={`flex flex-nowrap justify-center items-center md:gap-x-6 sm:text-lg md:text-xl text-white/80 w-full px-1 md:px-0 mx-auto mb-10 leading-relaxed font-medium ${
          lang === "en" ? "gap-x-1.5 text-[13.5px]" : "gap-x-1.5 text-[14.5px]"
        }`}>
          {hero.subtitle.split("•").map((part, i, arr) => (
            <div key={`${part}-${i}`} className="contents">
              <span className="whitespace-nowrap">{part.trim()}</span>
              {i < arr.length - 1 ? <span className="opacity-50 text-[10px] md:text-sm">•</span> : null}
            </div>
          ))}
        </div>

        <div className="inline-flex items-center mt-8 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <a
            href={`/${lang}/hotels`}
            className="px-8 py-3 text-[15px] font-semibold transition-all duration-300 hover:bg-gray-100 bg-white text-[#111]"
          >
            {hero.bookHotel}
          </a>
          <a
            href={`/${lang}/trips`}
            className={`px-8 py-3 text-[15px] font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white ${lang === "ar" ? "border-r" : "border-l"} border-white/30 backdrop-blur-sm`}
          >
            {hero.browseTrips}
          </a>
        </div>
      </div>

      <div className="hidden md:block absolute bottom-8 md:bottom-16 left-4 md:left-20 z-20 w-64 md:w-72 rounded-3xl p-5 animate-float bg-white/10 backdrop-blur-sm backdrop-saturate-150 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-3 space-x-reverse">
            {avatars.map((src) => (
              <Image
                key={src}
                src={src}
                alt={hero.travelerAlt}
                width={40}
                height={40}
                quality={60}
                sizes="40px"
                className="w-10 h-10 rounded-full border-2 border-white/40 object-cover"
              />
            ))}
            <span className="w-10 h-10 rounded-full border-2 border-white/40 bg-white/25 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
              +50
            </span>
          </div>
          <span className="text-white text-sm font-semibold whitespace-nowrap">
            {hero.joinUs}
          </span>
        </div>

        <p className="text-white/80 text-sm leading-relaxed mb-5">
          {hero.floatingDesc}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  );
}
