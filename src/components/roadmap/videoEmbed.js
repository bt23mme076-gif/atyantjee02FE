// Turns any YouTube/Vimeo URL format into a standardized embeddable iframe src,
// or returns null for direct video file uploads.
export function getEmbedUrl(url) {
  if (!url) return null;
  const cleanUrl = url.trim();

  // 1. YouTube Shorts: youtube.com/shorts/VIDEO_ID
  const shortsMatch = cleanUrl.match(/(?:youtube\.com\/shorts\/)([\w-]+)/i);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  // 2. Standard Watch: youtube.com/watch?v=VIDEO_ID
  const watchMatch = cleanUrl.match(/[?&]v=([\w-]+)/i);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // 3. Share URL: youtu.be/VIDEO_ID
  const shareMatch = cleanUrl.match(/(?:youtu\.be\/)([\w-]+)/i);
  if (shareMatch) return `https://www.youtube.com/embed/${shareMatch[1]}`;

  // 4. Existing Embed: youtube.com/embed/VIDEO_ID
  const embedMatch = cleanUrl.match(/(?:youtube(?:-nocookie)?\.com\/embed\/)([\w-]+)/i);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  // 5. Live Streams: youtube.com/live/VIDEO_ID
  const liveMatch = cleanUrl.match(/(?:youtube\.com\/live\/)([\w-]+)/i);
  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}`;

  // 6. Legacy Path: youtube.com/v/VIDEO_ID
  const vMatch = cleanUrl.match(/(?:youtube\.com\/v\/)([\w-]+)/i);
  if (vMatch) return `https://www.youtube.com/embed/${vMatch[1]}`;

  // 7. Vimeo (vimeo.com/VIDEO_ID or player.vimeo.com/video/VIDEO_ID)
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}
