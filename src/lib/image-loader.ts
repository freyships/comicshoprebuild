// Shop photos live in Cloudflare R2 at media.comicbookstores.co, with pre-made sizes:
//   /w480/<key>, /w960/<key>, and the original at /<key>.
// No per-request resizing (no image transformation bill).
type LoaderArgs = { src: string; width: number; quality?: number };

const MEDIA = "https://media.comicbookstores.co/";

export default function imageLoader({ src, width }: LoaderArgs): string {
  if (!src.startsWith(MEDIA)) return src;
  const key = src.slice(MEDIA.length);
  if (width <= 480) return `${MEDIA}w480/${key}`;
  if (width <= 960) return `${MEDIA}w960/${key}`;
  return src;
}
