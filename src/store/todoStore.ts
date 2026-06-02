import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, Priority, DEFAULT_CATEGORIES, DEFAULT_TAGS } from '@/types';
import { generateId } from '@/utils/id';

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTodos: (todoIds: string[]) => void;
  getFilteredTodos: (filter: {
    timeFilter: 'all' | 'today' | 'week' | 'overdue';
    categoryId: string | null;
    tagIds: string[];
    searchQuery: string;
  }) => Todo[];
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (todoData) => {
        const now = new Date().toISOString();
        const newTodo: Todo = {
          ...todoData,
          id: generateId(),
          order: get().todos.length,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
              : todo
          ),
        }));
      },
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      toggleComplete: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
              : todo
          ),
        }));
      },
      reorderTodos: (todoIds) => {
        set((state) => ({
          todos: todoIds.map((id, index) => {
            const todo = state.todos.find((t) => t.id === id);
            return todo ? { ...todo, order: index } : state.todos[index];
          }),
        }));
      },
      getFilteredTodos: (filter) => {
        const { todos } = get();
        let filtered = todos;

        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(query) ||
              todo.note.toLowerCase().includes(query)
          );
        }

        if (filter.categoryId) {
          filtered = filtered.filter((todo) => todo.categoryId === filter.categoryId);
        }

        if (filter.tagIds.length > 0) {
          filtered = filtered.filter((todo) =>
            filter.tagIds.some((tagId) => todo.tagIds.includes(tagId))
          );
        }

        return filtered;
      },
    }),
    { name: 'todo-storage' }
  )
);