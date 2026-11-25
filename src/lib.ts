import { SITE } from "./config";

export const BOOK_HREF = SITE.BOOKING_URL || "/teardown/";
export const INITIALS = SITE.FOUNDER_NAME.split(/\s+/).map((w) => w[0]).join("");

const images = import.meta.glob<{ default: ImageMetadata }>("./assets/*.{jpg,jpeg,png,webp,avif}", { eager: true });
/** An image Pep has dropped into src/assets, or undefined so the element is not rendered. */
export const asset = (name: string) => (name ? images[`./assets/${name.split("/").pop()}`]?.default : undefined);
