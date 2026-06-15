import { create } from 'zustand';
import { Tag, DEFAULT_TAGS } from '@/types';
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { mapTagFromDb } from '@/lib/mappers';

interface TagState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  addTag: (name: string, color: string) => Promise<void>;
  updateTag: (id: string, updates: Partial<Tag>) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  reset: () => void;
}

async function seedDefaultTags(userId: string) {
  const rows = DEFAULT_TAGS.map((tag) => ({
    user_id: userId,
    name: tag.name,
    color: tag.color,
  }));

  const { error } = await supabase.from('tags').insert(rows);
  if (error) throw error;
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', userId)
        .order('created_at');

      if (error) throw error;

      if (!data || data.length === 0) {
        await seedDefaultTags(userId);
        const { data: seeded, error: seedError } = await supabase
          .from('tags')
          .select('*')
          .eq('user_id', userId)
          .order('created_at');
        if (seedError) throw seedError;
        set({ tags: (seeded ?? []).map(mapTagFromDb), isLoading: false });
        return;
      }

      set({ tags: data.map(mapTagFromDb), isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addTag: async (name, color) => {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('tags')
      .insert({ user_id: userId, name, color })
      .select()
      .single();

    if (error) throw error;
    set((state) => ({ tags: [...state.tags, mapTagFromDb(data)] }));
  },

  updateTag: async (id, updates) => {
    const { data, error } = await supabase
      .from('tags')
      .update({ name: updates.name, color: updates.color })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    set((state) => ({
      tags: state.tags.map((tag) => (tag.id === id ? mapTagFromDb(data) : tag)),
    }));
  },

  deleteTag: async (id) => {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    }));
  },

  reset: () => set({ tags: [], isLoading: false, error: null }),
}));
