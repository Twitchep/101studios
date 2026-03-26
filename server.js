import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const CONTENT_FILE = path.join(__dirname, "public", "content.json");

if (!fs.existsSync(CONTENT_FILE)) {
    const defaultContent = {
                hero_slider: [],
        portfolio: [],
        products: [],
        updates: [],
        videos: [],
        announcements: [],
                about: {
                        hero_image: "",
                        title: "",
                        subtitle: "",
                        bio: "",
                        sections: [],
                },
    };
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
}

const normalizeContentPayload = (payload, existing = {}) => {
        const safePayload = payload && typeof payload === "object" ? payload : {};
        const safeExisting = existing && typeof existing === "object" ? existing : {};
        const payloadAbout = safePayload.about && typeof safePayload.about === "object" ? safePayload.about : {};
        const existingAbout = safeExisting.about && typeof safeExisting.about === "object" ? safeExisting.about : {};

        return {
                ...safeExisting,
                ...safePayload,
                hero_slider: Array.isArray(safePayload.hero_slider)
                        ? safePayload.hero_slider
                        : Array.isArray(safeExisting.hero_slider)
                            ? safeExisting.hero_slider
                            : [],
                portfolio: Array.isArray(safePayload.portfolio)
                        ? safePayload.portfolio
                        : Array.isArray(safeExisting.portfolio)
                            ? safeExisting.portfolio
                            : [],
                products: Array.isArray(safePayload.products)
                        ? safePayload.products
                        : Array.isArray(safeExisting.products)
                            ? safeExisting.products
                            : [],
                updates: Array.isArray(safePayload.updates)
                        ? safePayload.updates
                        : Array.isArray(safeExisting.updates)
                            ? safeExisting.updates
                            : [],
                videos: Array.isArray(safePayload.videos)
                        ? safePayload.videos
                        : Array.isArray(safeExisting.videos)
                            ? safeExisting.videos
                            : [],
                announcements: Array.isArray(safePayload.announcements)
                        ? safePayload.announcements
                        : Array.isArray(safeExisting.announcements)
                            ? safeExisting.announcements
                            : [],
                about: {
                        hero_image: typeof payloadAbout.hero_image === "string"
                                ? payloadAbout.hero_image
                                : typeof existingAbout.hero_image === "string"
                                    ? existingAbout.hero_image
                                    : "",
                        title: typeof payloadAbout.title === "string"
                                ? payloadAbout.title
                                : typeof existingAbout.title === "string"
                                    ? existingAbout.title
                                    : "",
                        subtitle: typeof payloadAbout.subtitle === "string"
                                ? payloadAbout.subtitle
                                : typeof existingAbout.subtitle === "string"
                                    ? existingAbout.subtitle
                                    : "",
                        bio: typeof payloadAbout.bio === "string"
                                ? payloadAbout.bio
                                : typeof existingAbout.bio === "string"
                                    ? existingAbout.bio
                                    : "",
                        sections: Array.isArray(payloadAbout.sections)
                                ? payloadAbout.sections
                                : Array.isArray(existingAbout.sections)
                                    ? existingAbout.sections
                                    : [],
                },
        };
};

const sanitizeMessages = (messages) => {
    if (!Array.isArray(messages)) return [];

    return messages
        .slice(-10)
        .map((message) => ({
            role: message?.role === "assistant" ? "assistant" : "user",
            content: String(message?.content || "").trim().slice(0, 1200),
        }))
        .filter((message) => message.content.length > 0);
};

const buildAssistantPrompt = (snapshot, currentRoute) => {
    const products = Array.isArray(snapshot?.products) ? snapshot.products.slice(0, 6) : [];
    const portfolio = Array.isArray(snapshot?.portfolio) ? snapshot.portfolio.slice(0, 6) : [];
    const updates = Array.isArray(snapshot?.updates) ? snapshot.updates.slice(0, 6) : [];

    return [
        "You are the website AI assistant for 101 Studios.",
        "Keep responses short, clear, and friendly.",
        "Main site areas: Home(/), About(/about), Shop(/shop), Portfolio(/portfolio), Updates(/updates), Videos(/videos), Contact(/contact).",
        "When relevant, mention one best next page for the user.",
        "Do not invent unavailable products or services.",
        `Current route: ${currentRoute || "/"}`,
        `Product sample: ${products.map((item) => item.title).join(", ") || "none"}`,
        `Portfolio sample: ${portfolio.map((item) => item.title).join(", ") || "none"}`,
        `Update sample: ${updates.map((item) => item.title).join(", ") || "none"}`,
    ].join("\n");
};

const inferRouteSuggestion = (text) => {
    const normalized = String(text || "").toLowerCase();
    if (/shop|buy|product|price|cart/.test(normalized)) return "/shop";
    if (/portfolio|design|project|work/.test(normalized)) return "/portfolio";
    if (/update|news|blog|latest/.test(normalized)) return "/updates";
    if (/video|youtube|watch/.test(normalized)) return "/videos";
    if (/contact|call|email|whatsapp/.test(normalized)) return "/contact";
    if (/about|company|team/.test(normalized)) return "/about";
    return undefined;
};

const stripCdata = (value = "") => value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();

const decodeHtmlEntities = (value = "") =>
    value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

const removeHtmlTags = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const safeIsoDate = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return new Date().toISOString();
    }
    return parsed.toISOString();
};

const extractFirstImage = (value = "") => {
    const imgTagMatch = value.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgTagMatch?.[1]) return imgTagMatch[1];

    const mediaThumbMatch = value.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
    if (mediaThumbMatch?.[1]) return mediaThumbMatch[1];

    const enclosureMatch = value.match(/<media:content[^>]+url=["']([^"']+)["']/i);
    if (enclosureMatch?.[1]) return enclosureMatch[1];

    const rssEnclosureMatch = value.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i);
    if (rssEnclosureMatch?.[1]) return rssEnclosureMatch[1];

    return null;
};

const parseRssItems = (xml, newsSite) => {
    const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

    return itemBlocks.slice(0, 20).map((block, index) => {
        const title = stripCdata((block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "").trim());
        const link = stripCdata((block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || "#").trim());
        const pubDate = stripCdata((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || new Date().toISOString()).trim());
        const descriptionRaw = stripCdata((block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] || "").trim());
        const contentEncodedRaw = stripCdata((block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i)?.[1] || "").trim());
        const imageSource = `${descriptionRaw}\n${contentEncodedRaw}\n${block}`;

        return {
            id: `${newsSite}-${index}-${link}`,
            title: decodeHtmlEntities(removeHtmlTags(title || "Ghana headline")),
            summary: decodeHtmlEntities(removeHtmlTags(descriptionRaw || "Latest Ghana news update.")),
            url: link,
            image_url: extractFirstImage(imageSource),
            published_at: safeIsoDate(pubDate),
            news_site: newsSite,
        };
    });
};

const extractImageFromArticleHtml = (html = "") => {
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
    if (ogImage) return ogImage;

    const twitterImage = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
    if (twitterImage) return twitterImage;

    const firstImg = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    return firstImg || null;
};

const enrichMissingImages = async (items) => {
    const tasks = items.map(async (item) => {
        if (item.image_url || !item.url) return item;

        try {
            const response = await fetch(item.url, {
                headers: { "User-Agent": "Mozilla/5.0" },
            });

            if (!response.ok) return item;
            const html = await response.text();
            const extracted = extractImageFromArticleHtml(html);
            if (!extracted) return item;

            return { ...item, image_url: extracted };
        } catch {
            return item;
        }
    });

    return Promise.all(tasks);
};

app.get("/api/ghana-news", async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(10, Number(req.query.limit) || 4));
        const sources = [
            { name: "Google News Ghana", url: "https://news.google.com/rss?hl=en-GH&gl=GH&ceid=GH:en" },
            { name: "MyJoyOnline", url: "https://www.myjoyonline.com/feed/" },
            { name: "Citi Newsroom", url: "https://citinewsroom.com/feed/" },
            { name: "GhanaWeb", url: "https://www.ghanaweb.com/GhanaHomePage/rss/news.xml" },
            { name: "Graphic Online", url: "https://www.graphic.com.gh/news.feed?type=rss" },
            { name: "Pulse Ghana", url: "https://www.pulse.com.gh/rss" },
        ];

        const settled = await Promise.allSettled(
            sources.map(async (source) => {
                const response = await fetch(source.url);
                if (!response.ok) {
                    throw new Error(`Failed source: ${source.name}`);
                }

                const xml = await response.text();
                return parseRssItems(xml, source.name);
            })
        );

        const combined = settled
            .filter((result) => result.status === "fulfilled")
            .flatMap((result) => result.value)
            .filter((item) => item.title && item.url && item.url !== "#")
            .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

        const deduped = [];
        const seenUrls = new Set();
        for (const item of combined) {
            if (seenUrls.has(item.url)) continue;
            seenUrls.add(item.url);
            deduped.push(item);
        }

        const enriched = await enrichMissingImages(deduped.slice(0, Math.max(limit * 6, 24)));
        const withImages = enriched.filter((item) => !!item.image_url);
        const withoutImages = enriched.filter((item) => !item.image_url);

        const prioritized = [...withImages, ...withoutImages].slice(0, limit);

        if (!prioritized.length) {
            return res.status(502).json({ error: "No Ghana news available right now" });
        }

        res.json({ results: prioritized });
    } catch (error) {
        console.error("Ghana news endpoint failed:", error);
        res.status(500).json({ error: "Failed to fetch Ghana news" });
    }
});

app.get("/api/content", (req, res) => {
    try {
        const content = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
        res.json(content);
    } catch (error) {
        console.error("Error reading content:", error);
        res.status(500).json({ error: "Failed to read content" });
    }
});

app.post("/api/content", (req, res) => {
    try {
        const newContent = req.body;

        if (!newContent || typeof newContent !== "object") {
            return res.status(400).json({ error: "Invalid content format" });
        }

        let existingContent = {};
        try {
            existingContent = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
        } catch {
            existingContent = {};
        }

        const normalizedContent = normalizeContentPayload(newContent, existingContent);

        fs.writeFileSync(CONTENT_FILE, JSON.stringify(normalizedContent, null, 2));

        console.log(`✅ Content updated at ${new Date().toISOString()}`);
        res.json({
            success: true,
            message: "Content updated successfully",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error saving content:", error);
        res.status(500).json({ error: "Failed to save content" });
    }
});

app.post("/api/assistant", async (req, res) => {
    try {
        const userMessages = sanitizeMessages(req.body?.messages);
        const snapshot = req.body?.snapshot || {};
        const currentRoute = String(req.body?.currentRoute || "/");

        if (!userMessages.length) {
            return res.status(400).json({ error: "No valid messages provided" });
        }

        if (!OPENAI_API_KEY) {
            return res.status(503).json({
                error: "Assistant API key is not configured",
                hint: "Set OPENAI_API_KEY in your server environment.",
            });
        }

        const systemPrompt = buildAssistantPrompt(snapshot, currentRoute);
        const completionMessages = [
            { role: "system", content: systemPrompt },
            ...userMessages,
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: completionMessages,
                temperature: 0.5,
                max_tokens: 260,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Assistant provider error:", errorBody);
            return res.status(502).json({ error: "Assistant provider request failed" });
        }

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            return res.status(502).json({ error: "Assistant returned empty response" });
        }

        res.json({
            reply,
            suggestedRoute: inferRouteSuggestion(reply),
        });
    } catch (error) {
        console.error("Assistant endpoint failed:", error);
        res.status(500).json({ error: "Assistant request failed" });
    }
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`);
    console.log(`📁 Content file: ${CONTENT_FILE}`);
    console.log(`🤖 Assistant model: ${OPENAI_MODEL}`);
});

export default app;