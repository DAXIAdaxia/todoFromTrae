import { create } from 'zustand';
import { FilterState, SortState } from '@/types';

interface FilterSortState extends FilterState, SortState {
  setTimeFilter: (filter: FilterState['timeFilter']) => void;
  setCategoryFilter: (categoryId: string | null) => void;
  setTagFilter: (tagIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortState['sortBy']) => void;
  setSortOrder: (order: SortState['sortOrder']) => void;
  clearFilters: () => void;
}

const initialFilterState: FilterState = {
  timeFilter: 'all',
  categoryId: null,
  tagIds: [],
  searchQuery: '',
};

const initialSortState: SortState = {
  sortBy: 'order',
  sortOrder: 'asc',
};

export const useFilterSortStore = create<FilterSortState>((set) => ({
  ...initialFilterState,
  ...initialSortState,
  setTimeFilter: (filter) => set({ timeFilter: filter }),
  setCategoryFilter: (categoryId) => set({ categoryId }),
  setTagFilter: (tagIds) => set({ tagIds }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  clearFilters: () => set(initialFilterState),
}));