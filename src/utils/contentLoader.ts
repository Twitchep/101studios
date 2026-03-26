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

async function fetchContentJson(): Promise<ContentData> {
  const response = await fetch(`/content.json?v=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache'
    }
  });

  return response.json();
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
  supabaseOrderBy: string = 'created_at'
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
    const isLiveEditorContentFresh = !!liveEditorLastUpdated && (Date.now() - liveEditorLastUpdated) < (2 * 60 * 1000);

    if (liveEditorContent && isLiveEditorContentFresh) {
      try {
        const parsedContent = JSON.parse(liveEditorContent) as ContentData;
        if (parsedContent[contentType] && Array.isArray(parsedContent[contentType])) {
          console.log(`📝 Using live editor content for ${contentType}`);
          return mergeContentArrays(parsedContent[contentType], fallbackContent);
        }
      } catch (parseError) {
        console.warn('Failed to parse live editor content:', parseError);
      }
    }

    // Then try Supabase if table is provided
    if (supabaseTable) {
      const { data, error } = await supabase
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
    let lastSeenUpdate = parseInt(localStorage.getItem('contentLastUpdated') || '0', 10);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'liveEditorContent' || e.key === 'contentLastUpdated') {
        console.log('🔄 Live editor content updated, refreshing...');
        callback();
      }
    };

    const handleBroadcastUpdate = (event: MessageEvent) => {
      if (event?.data?.type === 'live-editor-updated') {
        console.log('🔄 Live editor broadcast received, refreshing...');
        callback();
      }
    };

    const liveEditorChannel = typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel('live-editor-content')
      : null;

    if (liveEditorChannel) {
      liveEditorChannel.addEventListener('message', handleBroadcastUpdate);
    }

    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for localStorage changes
    const interval = setInterval(() => {
      const nextUpdate = parseInt(localStorage.getItem('contentLastUpdated') || '0', 10);
      if (nextUpdate > lastSeenUpdate) {
        lastSeenUpdate = nextUpdate;
        console.log('🔄 Detected new live editor timestamp, refreshing...');
        callback();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (liveEditorChannel) {
        liveEditorChannel.removeEventListener('message', handleBroadcastUpdate);
        liveEditorChannel.close();
      }
      clearInterval(interval);
    };
  }, [callback]);
}