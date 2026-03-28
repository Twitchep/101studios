import React from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface ContentData {
  hero_slider: any[];
  portfolio: any[];
  products: any[];
  updates: any[];
  videos: any[];
  announcements: any[];
  about?: any;
}

const CONTENT_SESSION_KEY = 'content-json-cache-v1';
const CONTENT_SESSION_TTL_MS = 10 * 60 * 1000;

// Module-level cache: all concurrent callers share one in-flight request.
// Invalidated only when the live editor pushes an update.
let _contentJsonPromise: Promise<ContentData> | null = null;

export function invalidateContentCache() {
  _contentJsonPromise = null;
  try {
    sessionStorage.removeItem(CONTENT_SESSION_KEY);
  } catch {
    // Ignore storage access errors in restricted contexts.
  }
}

function readSessionContentCache(): ContentData | null {
  try {
    const raw = sessionStorage.getItem(CONTENT_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { ts?: number; data?: ContentData };
    if (!parsed?.ts || !parsed?.data) return null;
    if (Date.now() - parsed.ts > CONTENT_SESSION_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeSessionContentCache(data: ContentData) {
  try {
    sessionStorage.setItem(CONTENT_SESSION_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // Ignore storage write failures.
  }
}

async function fetchContentJson(): Promise<ContentData> {
  const sessionCached = readSessionContentCache();
  if (sessionCached) {
    return sessionCached;
  }

  if (!_contentJsonPromise) {
    _contentJsonPromise = fetch('/content.json', { cache: 'no-cache' })
      .then((r) => r.json())
      .then((data) => {
        const typedData = data as ContentData;
        writeSessionContentCache(typedData);
        return typedData;
      })
      .catch((err) => {
        _contentJsonPromise = null; // allow retry on next call
        return Promise.reject(err);
      });
  }

  return _contentJsonPromise;
}

export async function loadHomepageContentBundle(): Promise<
  Pick<ContentData, 'hero_slider' | 'portfolio' | 'products' | 'updates' | 'videos'>
> {
  const content = await fetchContentJson();
  return {
    hero_slider: Array.isArray(content.hero_slider) ? content.hero_slider : [],
    portfolio: Array.isArray(content.portfolio) ? content.portfolio : [],
    products: Array.isArray(content.products) ? content.products : [],
    updates: Array.isArray(content.updates) ? content.updates : [],
    videos: Array.isArray(content.videos) ? content.videos : [],
  };
}

function mergeContentArrays(primary: any[], fallback: any[]) {
  if (!Array.isArray(primary) || primary.length === 0) return Array.isArray(fallback) ? fallback : [];
  if (!Array.isArray(fallback) || fallback.length === 0) return primary;

  const fallbackMap = new Map(
    fallback
      .filter((item) => item && typeof item === 'object' && item.id)
      .map((item) => [item.id, item])
  );

  const mergedPrimary = primary.map((item) => {
    const fallbackItem = item?.id ? fallbackMap.get(item.id) : undefined;

    if (!fallbackItem) {
      return item;
    }

    const mergedItem = { ...fallbackItem, ...item };

    Object.keys(fallbackItem).forEach((key) => {
      const value = item?.[key];
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        mergedItem[key] = fallbackItem[key];
      }
    });

    return mergedItem;
  });

  const primaryIds = new Set(primary.map((item) => item?.id).filter(Boolean));
  const missingFallbackItems = fallback.filter((item) => item?.id && !primaryIds.has(item.id));

  return [...mergedPrimary, ...missingFallbackItems];
}

/**
 * Load content with live editor support
 * Priority: Live Editor localStorage -> Supabase -> content.json
 */
export async function loadContentWithLiveEditor(
  contentType: keyof ContentData,
  supabaseTable?: string,
  supabaseOrderBy: string = 'created_at',
  options?: { skipSupabase?: boolean }
): Promise<any[]> {
  try {
    let fallbackContent: any[] = [];

    try {
      const fallbackJson = await fetchContentJson();
      fallbackContent = fallbackJson[contentType] || [];
    } catch (fallbackReadError) {
      console.warn(`Unable to read fallback content for ${contentType}:`, fallbackReadError);
    }

    // First, check for live editor updates in localStorage
    const liveEditorContent = localStorage.getItem('liveEditorContent');
    const liveEditorLastUpdatedRaw = localStorage.getItem('contentLastUpdated');
    const liveEditorLastUpdated = liveEditorLastUpdatedRaw ? parseInt(liveEditorLastUpdatedRaw, 10) : 0;
    const isLiveEditorContentFresh =
      !!liveEditorLastUpdated && (Date.now() - liveEditorLastUpdated) < 2 * 60 * 1000;

    if (liveEditorContent && isLiveEditorContentFresh) {
      try {
        const parsedContent = JSON.parse(liveEditorContent) as ContentData;
        if (parsedContent[contentType] && Array.isArray(parsedContent[contentType])) {
          console.log(`Using live editor content for ${contentType}`);
          return mergeContentArrays(parsedContent[contentType], fallbackContent);
        }
      } catch (parseError) {
        console.warn('Failed to parse live editor content:', parseError);
      }
    }

    // Then try Supabase if table is provided
    if (supabaseTable && !options?.skipSupabase) {
      const { data } = await supabase
        .from(supabaseTable as any)
        .select("*")
        .order(supabaseOrderBy, { ascending: false });

      if (data && data.length > 0) {
        return mergeContentArrays(data, fallbackContent);
      }
    }

    // Fallback to content.json
    return fallbackContent;
  } catch (error) {
    console.error(`Error loading ${contentType}:`, error);

    // Last resort: try content.json directly
    try {
      const content = await fetchContentJson();
      return content[contentType] || [];
    } catch (fallbackError) {
      console.error(`Fallback failed for ${contentType}:`, fallbackError);
      return [];
    }
  }
}

/**
 * Listen for live editor content updates
 */
export function useLiveEditorUpdates(callback: () => void) {
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'liveEditorContent' || e.key === 'contentLastUpdated') {
        console.log('Live editor content updated, refreshing...');
        invalidateContentCache();
        callback();
      }
    };

    const handleBroadcastUpdate = (event: MessageEvent) => {
      if (event?.data?.type === 'live-editor-updated') {
        console.log('Live editor broadcast received, refreshing...');
        invalidateContentCache();
        callback();
      }
    };

    const liveEditorChannel =
      typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('live-editor-content') : null;

    if (liveEditorChannel) {
      liveEditorChannel.addEventListener('message', handleBroadcastUpdate);
    }

    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (liveEditorChannel) {
        liveEditorChannel.removeEventListener('message', handleBroadcastUpdate);
        liveEditorChannel.close();
      }
    };
  }, [callback]);
}
