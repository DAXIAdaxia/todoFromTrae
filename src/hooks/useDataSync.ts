import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTodoStore } from '@/store/todoStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useTagStore } from '@/store/tagStore';

export function useDataSync() {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const fetchTodos = useTodoStore((s) => s.fetchTodos);
  const resetTodos = useTodoStore((s) => s.reset);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);
  const resetCategories = useCategoryStore((s) => s.reset);
  const fetchTags = useTagStore((s) => s.fetchTags);
  const resetTags = useTagStore((s) => s.reset);

  useEffect(() => {
    if (!user) {
      resetTodos();
      resetCategories();
      resetTags();
      return;
    }

    setSyncing(true);
    Promise.all([fetchCategories(), fetchTags(), fetchTodos()])
      .catch(console.error)
      .finally(() => setSyncing(false));
  }, [user, fetchTodos, fetchCategories, fetchTags, resetTodos, resetCategories, resetTags]);

  return { syncing };
}
