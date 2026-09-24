import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Concrete — The Complete Guide",
    short_name: "Concrete Guide",
    description:
      "An independent field guide to Concrete (concrete.xyz): vaults, yield, risk, the Vault Terminal, wallet tracker and points — installable for one-tap access.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F2EEE6",
    theme_color: "#1F3A5F",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
