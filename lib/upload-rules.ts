/** What the admin may upload. Shared by the upload route and the browser-side uploader. */
export const UPLOAD_RULES = {
  image: {
    types: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
    maxBytes: 40 * 1024 * 1024,
    label: "JPEG, PNG, WebP, AVIF or GIF up to 40 MB",
  },
  video: {
    types: ["video/mp4", "video/webm", "video/quicktime"],
    maxBytes: 500 * 1024 * 1024,
    label: "MP4, WebM or MOV up to 500 MB",
  },
} as const

export type UploadKind = keyof typeof UPLOAD_RULES
