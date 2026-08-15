import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prolingo",
    short_name: "Prolingo",
    description: "领域英语学习 — 按场景积累专业词汇",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e7490",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
