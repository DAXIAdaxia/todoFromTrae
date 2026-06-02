import { useState } from 'react';
import { Todo } from '@/types';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import { SearchBox } from '@/components/SearchBox';
import { FilterBar } from '@/components/FilterBar';
import { SortControl } from '@/components/SortControl';
import { Sidebar } from '@/components/Sidebar';
import { CategoryManager } from '@/components/CategoryManager';
import { CalendarDays } from 'lucide-react';

export function WeekPage() {
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleCloseForm = () => {
    setShowTodoForm(false);
    setEditingTodo(null);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar
        onAddTodo={() => setShowTodoForm(true)}
        onManageCategories={() => setShowCategoryManager(true)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-[#1e3a5f]" size={24} />
              <h1 className="text-xl font-semibold text-gray-900">本周待办</h1>
            </div>
            <SearchBox className="w-64" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <FilterBar />
            <SortControl />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <TodoList
            timeFilter="week"
            onEditTodo={handleEditTodo}
          />
        </div>
      </main>

      <TodoForm
        isOpen={showTodoForm}
        onClose={handleCloseForm}
        editTodo={editingTodo}
      />

      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  );
}