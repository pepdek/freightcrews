import { SITE } from "./config";

export const BOOK_HREF = SITE.BOOKING_URL || "/teardown/";
export const INITIALS = SITE.FOUNDER_NAME.split(/\s+/).map((w) => w[0]).join("");

const images = import.meta.glob<{ default: ImageMetadata }>("./assets/*.{jpg,jpeg,png,webp,avif}", { eager: true });
/** An image Pep has dropped into src/assets, or undefined so the element is not rendered. */
export const asset = (name: string) => (name ? images[`./assets/${name.split("/").pop()}`]?.default : undefined);

const url = (path: string) => new URL(path, SITE.DOMAIN).href;
const [locality, region] = SITE.CITY.split(", ");

/** Organization + founder, for the home and about pages. */
export const orgSchema = [
  {
    "@type": "Organization",
    "@id": url("/#organization"),
    name: SITE.BRAND,
    url: url("/"),
    logo: url("/favicon.svg"),
    address: { "@type": "PostalAddress", addressLocality: locality, addressRegion: region, addressCountry: "US" },
    founder: { "@id": url("/#founder") },
    ...(SITE.EMAIL && { email: SITE.EMAIL }),
    ...(SITE.PHONE && { telephone: SITE.PHONE }),
  },
  {
    "@type": "Person",
    "@id": url("/#founder"),
    name: SITE.FOUNDER_NAME,
    jobTitle: SITE.FOUNDER_ROLE,
    worksFor: { "@id": url("/#organization") },
    ...(SITE.LINKEDIN_URL && { sameAs: [SITE.LINKEDIN_URL] }),
  },
];

export const breadcrumbSchema = (...crumbs: [name: string, path: string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: url(path) })),
});
