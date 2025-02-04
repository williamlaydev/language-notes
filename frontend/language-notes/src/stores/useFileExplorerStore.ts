import {create} from 'zustand';
import { fetchPages } from '@/api/page';
import { fetchSets } from '@/api/set';
import { SupabaseClient } from '@supabase/supabase-js';

interface FileExplorerState {
    tree: PageNode[];
    setFileExplorerState: (supabase: SupabaseClient) => void;
}

const useFileExplorerStore = create<FileExplorerState>()((set) => ({
    tree: [],
    setFileExplorerState: async (supabase: SupabaseClient) => {
        const tree = await createFileExplorerTree(supabase);
        set(() => ({ tree: tree}))
    },
}));

const createFileExplorerTree = async (supabase: any): Promise<PageNode[]> => {
    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            throw new Error(`Error fetching session: ${error.message}`);
        }

        if (!data || !data.session) {
            throw new Error("Session data is missing.");
        }

        const token = data.session.access_token || "";
        const pages = await fetchPages("chinese", token);

        // Fetch sets in parallel
        const setsPromises = pages.map(async (page) => {
            const sets = await fetchSets(page.id, token);
            
            // Handle empty sets
            if (!sets || sets.length === 0) {
                console.warn(`No sets found for page ID: ${page.id}`);
            }

            return {
                id: page.id,
                name: page.name,
                sets: sets || []
            };
        });

        // Wait for all sets to be fetched
        return await Promise.all(setsPromises);
    } catch (error) {
        console.error('Failed to fetch initial state:', error);
        return []; // Return an empty array in case of error
    }
};

export default useFileExplorerStore;
