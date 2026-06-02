import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tag, DEFAULT_TAGS } from '@/types';
import { generateId } from '@/utils/id';

interface TagState {
  tags: Tag[];
  addTag: (name: string, color: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
}

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: DEFAULT_TAGS,
      addTag: (name, color) => {
        const newTag: Tag = {
          id: generateId(),
          name,
          color,
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
      },
      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...updates } : tag
          ),
        }));
      },
      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
        }));
      },
    }),
    { name: 'tag-storage' }
  )
);