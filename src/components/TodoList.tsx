import { useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Todo } from '@/types';
import { useTodoStore } from '@/store/todoStore';
import { useFilterSortStore } from '@/store/filterSortStore';
import { isToday, isThisWeek, isOverdue } from '@/utils/date';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  timeFilter?: 'all' | 'today' | 'week' | 'overdue' | 'completed';
  categoryId?: string | null;
  tagId?: string | null;
  onEditTodo: (todo: Todo) => void;
}

export function TodoList({ timeFilter = 'all', categoryId, tagId, onEditTodo }: TodoListProps) {
  const { todos, reorderTodos } = useTodoStore();
  const { searchQuery, tagIds, sortBy, sortOrder } = useFilterSortStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    if (timeFilter === 'today') {
      filtered = filtered.filter((t) => !t.completed && isToday(t.dueDate));
    } else if (timeFilter === 'week') {
      filtered = filtered.filter((t) => !t.completed && isThisWeek(t.dueDate));
    } else if (timeFilter === 'overdue') {
      filtered = filtered.filter((t) => !t.completed && isOverdue(t.dueDate, t.completed));
    } else if (timeFilter === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    if (categoryId) {
      filtered = filtered.filter((t) => t.categoryId === categoryId);
    }

    if (tagId) {
      filtered = filtered.filter((t) => t.tagIds.includes(tagId));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.note.toLowerCase().includes(query)
      );
    }

    if (tagIds.length > 0) {
      filtered = filtered.filter((t) =>
        tagIds.some((id) => t.tagIds.includes(id))
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'order') {
        return sortOrder === 'asc' ? a.order - b.order : b.order - a.order;
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sortOrder === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortOrder === 'asc' ? -1 : 1;
        const aDate = new Date(a.dueDate).getTime();
        const bDate = new Date(b.dueDate).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sortOrder === 'asc'
          ? priorityOrder[b.priority] - priorityOrder[a.priority]
          : priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'createdAt') {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      return 0;
    });

    return sorted;
  }, [todos, timeFilter, categoryId, tagId, searchQuery, tagIds, sortBy, sortOrder]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredAndSortedTodos.findIndex((t) => t.id === active.id);
      const newIndex = filteredAndSortedTodos.findIndex((t) => t.id === over.id);

      const newOrder = [...filteredAndSortedTodos];
      const [movedItem] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedItem);

      reorderTodos(newOrder.map((t) => t.id));
    }
  };

  if (filteredAndSortedTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-lg font-medium">暂无任务</p>
        <p className="text-sm mt-1">点击"新增任务"开始添加</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredAndSortedTodos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {filteredAndSortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEditTodo}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}