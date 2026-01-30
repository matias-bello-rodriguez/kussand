const SITE_URL = "https://kussand.com";

const pages = [
  "",
  "servicios",
  "quienes-somos",
  "careers"
];

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => {
    const route = page === "" ? "" : `${page}`;
    return `  <url>
    <loc>${SITE_URL}/${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === "" ? "daily" : "weekly"}</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`;
}).join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
