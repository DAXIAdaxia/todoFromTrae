import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Todo } from '@/types';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import { SearchBox } from '@/components/SearchBox';
import { FilterBar } from '@/components/FilterBar';
import { SortControl } from '@/components/SortControl';
import { Sidebar } from '@/components/Sidebar';
import { CategoryManager } from '@/components/CategoryManager';
import { useCategoryStore } from '@/store/categoryStore';
import { useTagStore } from '@/store/tagStore';
import { FolderOpen, Tag } from 'lucide-react';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { categories } = useCategoryStore();

  const category = categories.find((c) => c.id === categoryId);

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
              <FolderOpen size={24} style={{ color: category?.color || '#1e3a5f' }} />
              <h1 className="text-xl font-semibold text-gray-900">
                {category?.name || '分类任务'}
              </h1>
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
            categoryId={categoryId}
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

export function TagPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { tags } = useTagStore();

  const tag = tags.find((t) => t.id === tagId);

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
              <Tag size={24} style={{ color: tag?.color || '#1e3a5f' }} />
              <h1 className="text-xl font-semibold text-gray-900">
                {tag?.name || '标签任务'}
              </h1>
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
            tagId={tagId}
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