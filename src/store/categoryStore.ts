import { create } from 'zustand';
import { Category, DEFAULT_CATEGORIES } from '@/types';
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { mapCategoryFromDb } from '@/lib/mappers';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string, color: string) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  reset: () => void;
}

async function seedDefaultCategories(userId: string) {
  const rows = DEFAULT_CATEGORIES.map((cat) => ({
    user_id: userId,
    name: cat.name,
    color: cat.color,
    order: cat.order,
  }));

  const { error } = await supabase.from('categories').insert(rows);
  if (error) throw error;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('order');

      if (error) throw error;

      if (!data || data.length === 0) {
        await seedDefaultCategories(userId);
        const { data: seeded, error: seedError } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId)
          .order('order');
        if (seedError) throw seedError;
        set({ categories: (seeded ?? []).map(mapCategoryFromDb), isLoading: false });
        return;
      }

      set({ categories: data.map(mapCategoryFromDb), isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addCategory: async (name, color) => {
    const userId = await getCurrentUserId();
    const order = get().categories.length;

    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: userId, name, color, order })
      .select()
      .single();

    if (error) throw error;
    set((state) => ({ categories: [...state.categories, mapCategoryFromDb(data)] }));
  },

  updateCategory: async (id, updates) => {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        color: updates.color,
        order: updates.order,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? mapCategoryFromDb(data) : cat
      ),
    }));
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    }));
  },

  reorderCategories: async (categoryIds) => {
    await Promise.all(
      categoryIds.map((id, index) =>
        supabase.from('categories').update({ order: index }).eq('id', id)
      )
    );
    set((state) => ({
      categories: categoryIds
        .map((id, index) => {
          const cat = state.categories.find((c) => c.id === id);
          return cat ? { ...cat, order: index } : null;
        })
        .filter(Boolean) as Category[],
    }));
  },

  reset: () => set({ categories: [], isLoading: false, error: null }),
}));
