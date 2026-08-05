import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon/blog/blog_favicon.ico", type: "image/x-icon" },
      { url: "/favicon/blog/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/blog/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/blog/favicon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/favicon/blog/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/blog/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon/blog/blog_favicon.ico",
    apple: [
      { url: "/favicon/blog/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/favicon/blog/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/favicon/blog/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/favicon/blog/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/favicon/blog/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/favicon/blog/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/favicon/blog/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/favicon/blog/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/favicon/blog/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
