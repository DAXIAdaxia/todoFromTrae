export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  note: string;
  dueDate: string | null;
  reminderTime: string | null;
  priority: Priority;
  categoryId: string | null;
  tagIds: string[];
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface FilterState {
  timeFilter: 'all' | 'today' | 'week' | 'overdue';
  categoryId: string | null;
  tagIds: string[];
  searchQuery: string;
}

export interface SortState {
  sortBy: 'order' | 'dueDate' | 'priority' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#22c55e',
  medium: '#f97316',
  high: '#ef4444',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '工作', color: '#1e3a5f', order: 0 },
  { id: 'personal', name: '个人', color: '#f97316', order: 1 },
  { id: 'study', name: '学习', color: '#22c55e', order: 2 },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: 'urgent', name: '紧急', color: '#ef4444' },
  { id: 'important', name: '重要', color: '#f97316' },
  { id: 'meeting', name: '会议', color: '#1e3a5f' },
];