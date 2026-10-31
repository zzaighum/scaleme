import Image from "next/image";
import { siteConfig } from "@/config/site";

/*
 * The wordmark is HTML text rather than part of the logo image.
 *
 * `public/logo.svg` carries the old wordmark as 13 vector paths — letterforms,
 * not text — so renaming the brand could not be done by editing it. Retyping it
 * as SVG <text> would not work either: an SVG loaded through <img> renders in an
 * isolated context with no access to the page's webfonts, so it would fall back
 * to a system serif.
 *
 * Setting the wordmark in HTML instead uses the real Manrope face, scales with
 * the layout, stays selectable and translatable, and means a future rename is a
 * single config change. `public/logo-mark.svg` supplies the symbol unchanged.
 *
 * Colours match the original artwork: #16213A for the name, with the site's
 * primary teal picking out the middle word exactly as the old wordmark did.
 *
 * On the mark's size: the old combined logo.svg had a 2196x353 viewBox in which
 * the symbol filled only ~76% of the height, so at a 36px line it drew at about
 * 27px. logo-mark.svg is trimmed to 334x268 with no padding, so the same height
 * class renders it a third larger. The defaults below are scaled down to put it
 * back at its original proportion — raise them and the symbol grows.
 */
export function Logo({
  markClassName = "h-6 w-auto",
  textClassName = "text-xl",
}: {
  markClassName?: string;
  textClassName?: string;
}) {
  const words = siteConfig.brandName.trim().split(/\s+/);

  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/logo-mark.svg"
        alt=""
        aria-hidden="true"
        width={334}
        height={268}
        priority
        unoptimized
        className={markClassName}
      />
      <span
        className={`font-heading font-extrabold leading-none tracking-tight text-[#16213A] ${textClassName}`}
      >
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className={index === 1 ? "text-primary" : undefined}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </span>
  );
}
