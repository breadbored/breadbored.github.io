import { Post } from "../types";
import { getAllPublishedPosts, getAllArchivedPosts } from "../utils/post_parser";
import fs from 'fs';

const BASE_URL = 'https://bread.codes';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

interface StaticPage {
  path: string;
  priority: number;
  changefreq: string;
}

const staticPages: StaticPage[] = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/about/', priority: 0.5, changefreq: 'monthly' },
  { path: '/album/', priority: 0.5, changefreq: 'monthly' },
  { path: '/attack-fn/', priority: 0.5, changefreq: 'monthly' },
  { path: '/bsky-test/', priority: 0.5, changefreq: 'monthly' },
  { path: '/save-act/', priority: 0.5, changefreq: 'monthly' },
  { path: '/series/', priority: 0.7, changefreq: 'monthly' },
  { path: '/archive/', priority: 0.6, changefreq: 'monthly' },
];

function formatDate(date: string | Date): string {
  return new Date(date).toISOString().split('T')[0];
}

function generateXML(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

async function generateSitemap() {
  try {
    const publishedPosts = await getAllPublishedPosts();
    const archivedPosts = await getAllArchivedPosts();
    const currentDate = formatDate(new Date());

    const entries: SitemapEntry[] = [];

    // Add static pages
    staticPages.forEach(page => {
      entries.push({
        loc: `${BASE_URL}${page.path}`,
        lastmod: currentDate,
        changefreq: page.changefreq,
        priority: page.priority
      });
    });

    // Discover and add series pages
    const seriesPosts = publishedPosts.filter(post => !!post.chapterHeader);
    const seriesSet = new Set<string>();
    const seriesMap = new Map<string, number[]>();

    seriesPosts.forEach(post => {
      // Extract series name from slug pattern: {name}-series-{number}
      const match = post.slug.match(/^(.+)-series-\d+$/);
      if (match) {
        seriesSet.add(match[1]);
        if (!seriesMap.has(match[1])) {
          seriesMap.set(match[1], []);
        }
        seriesMap.get(match[1])!.push(parseInt(post.slug.split('-series-')[1]));
      }
    });

    seriesSet.forEach(seriesSlug => {
      entries.push({
        loc: `${BASE_URL}/series/${seriesSlug}/`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7
      });

      const chapterNumbers = seriesMap.get(seriesSlug) || [];
      chapterNumbers.forEach(chapNum => {
        entries.push({
          loc: `${BASE_URL}/series/${seriesSlug}/${chapNum}/`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.6
        });
      });
    });

    // Add published posts
    publishedPosts.forEach(post => {
      entries.push({
        loc: `${BASE_URL}/posts/${post.slug}/`,
        lastmod: formatDate(post.date),
        changefreq: 'monthly',
        priority: 0.8
      });
    });

    // Add archived posts
    archivedPosts.forEach(post => {
      entries.push({
        loc: `${BASE_URL}/archive/${post.slug}/`,
        lastmod: formatDate(post.date),
        changefreq: 'yearly',
        priority: 0.6
      });
    });

    // Generate and write XML
    const xml = generateXML(entries);
    fs.writeFileSync('public/sitemap.xml', xml);

    console.log(`✓ Sitemap generated with ${entries.length} URLs`);
    console.log(`  - ${staticPages.length} static pages`);
    console.log(`  - ${seriesSet.size} series pages`);
    console.log(`  - ${publishedPosts.length} published posts`);
    console.log(`  - ${archivedPosts.length} archived posts`);

    process.exit(0);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    process.exit(1);
  }
}

generateSitemap();
