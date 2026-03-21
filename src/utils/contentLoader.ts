import React from 'react';
import { supabase } from "@/integrations/supabase/client";

export interface ContentData {
  portfolio: any[];
  products: any[];
  updates: any[];
  videos: any[];
  announcements: any[];
}

/**
 * Load content with live editor support
 * Priority: Supabase -> Live Editor localStorage -> content.json
 */
export async function loadContentWithLiveEditor(
  contentType: keyof ContentData,
  supabaseTable?: string,
  supabaseOrderBy: string = 'created_at'
): Promise<any[]> {
  try {
    // First, try Supabase if table is provided
    if (supabaseTable) {
      const { data, error } = await supabase
        .from(supabaseTable)
        .select("*")
        .order(supabaseOrderBy, { ascending: false });

      if (data && data.length > 0) {
        return data;
      }
    }

    // Check for live editor updates in localStorage
    const liveEditorContent = localStorage.getItem('liveEditorContent');
    if (liveEditorContent) {
      try {
        const parsedContent = JSON.parse(liveEditorContent) as ContentData;
        if (parsedContent[contentType] && Array.isArray(parsedContent[contentType])) {
          console.log(`📝 Using live editor content for ${contentType}`);
          return parsedContent[contentType];
        }
      } catch (parseError) {
        console.warn('Failed to parse live editor content:', parseError);
      }
    }

    // Fallback to content.json
    const response = await fetch('/content.json');
    const content = await response.json();
    return content[contentType] || [];

  } catch (error) {
    console.error(`Error loading ${contentType}:`, error);

    // Last resort: try content.json directly
    try {
      const response = await fetch('/content.json');
      const content = await response.json();
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
        console.log('🔄 Live editor content updated, refreshing...');
        callback();
      }
    };

    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for localStorage changes
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('contentLastUpdated');
      if (lastUpdate) {
        const lastUpdateTime = parseInt(lastUpdate);
        const now = Date.now();
        // If updated within last 5 seconds, refresh
        if (now - lastUpdateTime < 5000) {
          console.log('🔄 Detected recent live editor update, refreshing...');
          localStorage.removeItem('contentLastUpdated'); // Clear the flag
          callback();
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [callback]);
}