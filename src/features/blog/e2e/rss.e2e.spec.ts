import { expect, test } from "@playwright/test";

const feeds = [
  { key: "en", path: "/rss.xml" },
  { key: "sv", path: "/rss-sv.xml" },
] as const;

for (const feed of feeds) {
  test(`${feed.key} RSS feed returns valid XML`, async ({ request }) => {
    const response = await request.get(feed.path);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<channel>");
    expect(body).toContain("<item>");
  });
}
