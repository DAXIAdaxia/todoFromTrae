import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, DEFAULT_CATEGORIES } from '@/types';
import { generateId } from '@/utils/id';

interface CategoryState {
  categories: Category[];
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categoryIds: string[]) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (name, color) => {
        const newCategory: Category = {
          id: generateId(),
          name,
          color,
          order: get().categories.length,
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },
      reorderCategories: (categoryIds) => {
        set((state) => ({
          categories: categoryIds.map((id, index) => {
            const cat = state.categories.find((c) => c.id === id);
            return cat ? { ...cat, order: index } : state.categories[index];
          }),
        }));
      },
    }),
    { name: 'category-storage' }
  )
);