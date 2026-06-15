import { create } from 'zustand';
import { Todo } from '@/types';
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { mapTodoFromDb } from '@/lib/mappers';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  reorderTodos: (todoIds: string[]) => Promise<void>;
  reset: () => void;
}

async function fetchTodoTagMap(): Promise<Map<string, string[]>> {
  const { data, error } = await supabase.from('todo_tags').select('todo_id, tag_id');
  if (error) throw error;

  const map = new Map<string, string[]>();
  for (const row of data ?? []) {
    const existing = map.get(row.todo_id) ?? [];
    existing.push(row.tag_id);
    map.set(row.todo_id, existing);
  }
  return map;
}

async function syncTodoTags(todoId: string, tagIds: string[]) {
  await supabase.from('todo_tags').delete().eq('todo_id', todoId);

  if (tagIds.length === 0) return;

  const rows = tagIds.map((tagId) => ({ todo_id: todoId, tag_id: tagId }));
  const { error } = await supabase.from('todo_tags').insert(rows);
  if (error) throw error;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = await getCurrentUserId();
      const [todosResult, tagMap] = await Promise.all([
        supabase
          .from('todos')
          .select('*')
          .eq('user_id', userId)
          .order('order'),
        fetchTodoTagMap(),
      ]);

      if (todosResult.error) throw todosResult.error;

      const todos = (todosResult.data ?? []).map((row) =>
        mapTodoFromDb(row, tagMap.get(row.id) ?? [])
      );
      set({ todos, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addTodo: async (todoData) => {
    const userId = await getCurrentUserId();
    const order = get().todos.length;

    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        title: todoData.title,
        note: todoData.note,
        due_date: todoData.dueDate,
        reminder_time: todoData.reminderTime,
        priority: todoData.priority,
        category_id: todoData.categoryId,
        completed: todoData.completed,
        order,
      })
      .select()
      .single();

    if (error) throw error;

    if (todoData.tagIds.length > 0) {
      await syncTodoTags(data.id, todoData.tagIds);
    }

    const newTodo = mapTodoFromDb(data, todoData.tagIds);
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },

  updateTodo: async (id, updates) => {
    const existing = get().todos.find((t) => t.id === id);
    if (!existing) return;

    const { data, error } = await supabase
      .from('todos')
      .update({
        title: updates.title,
        note: updates.note,
        due_date: updates.dueDate,
        reminder_time: updates.reminderTime,
        priority: updates.priority,
        category_id: updates.categoryId,
        completed: updates.completed,
        order: updates.order,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const tagIds = updates.tagIds ?? existing.tagIds;
    if (updates.tagIds !== undefined) {
      await syncTodoTags(id, tagIds);
    }

    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? mapTodoFromDb(data, tagIds) : todo
      ),
    }));
  },

  deleteTodo: async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  toggleComplete: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;

    const completed = !todo.completed;
    const { data, error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? mapTodoFromDb(data, t.tagIds) : t
      ),
    }));
  },

  reorderTodos: async (todoIds) => {
    await Promise.all(
      todoIds.map((id, index) =>
        supabase.from('todos').update({ order: index }).eq('id', id)
      )
    );

    set((state) => ({
      todos: todoIds
        .map((id, index) => {
          const todo = state.todos.find((t) => t.id === id);
          return todo ? { ...todo, order: index } : null;
        })
        .filter(Boolean) as Todo[],
    }));
  },

  reset: () => set({ todos: [], isLoading: false, error: null }),
}));
