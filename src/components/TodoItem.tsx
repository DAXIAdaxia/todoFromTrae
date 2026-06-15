import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Calendar, Clock, Tag, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo, PRIORITY_COLORS, PRIORITY_LABELS } from '@/types';
import { useTodoStore } from '@/store/todoStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useTagStore } from '@/store/tagStore';
import { formatDateTime, getRelativeDateLabel, isOverdue } from '@/utils/date';
import { Checkbox } from './ui/Checkbox';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  isDragging?: boolean;
}

export function TodoItem({ todo, onEdit, isDragging }: TodoItemProps) {
  const { toggleComplete, deleteTodo } = useTodoStore();
  const { categories } = useCategoryStore();
  const { tags } = useTagStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const category = categories.find((c) => c.id === todo.categoryId);
  const todoTags = tags.filter((t) => todo.tagIds.includes(t.id));
  const overdue = isOverdue(todo.dueDate, todo.completed);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个任务吗？')) {
      try {
        await deleteTodo(todo.id);
      } catch (err) {
        console.error('删除任务失败:', err);
        alert('删除失败，请重试');
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm',
        'hover:shadow-md hover:border-gray-200 transition-all duration-200',
        todo.completed && 'opacity-60 bg-gray-50',
        (isDragging || isSortableDragging) && 'shadow-lg border-[#1e3a5f] opacity-90',
        overdue && !todo.completed && 'border-l-4 border-l-red-500'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 -ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={16} className="text-gray-400" />
      </div>

      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => toggleComplete(todo.id).catch(console.error)}
        className="mt-0.5"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              'font-medium text-gray-900 leading-tight',
              todo.completed && 'text-gray-500 line-through'
            )}
          >
            {todo.title}
          </h3>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(todo)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 size={14} className="text-gray-400" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>

        {todo.note && (
          <p className={cn(
            'mt-1 text-sm text-gray-500 line-clamp-2',
            todo.completed && 'text-gray-400'
          )}>
            {todo.note}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${PRIORITY_COLORS[todo.priority]}20`,
              color: PRIORITY_COLORS[todo.priority],
            }}
          >
            {PRIORITY_LABELS[todo.priority]}
          </div>

          {category && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FolderOpen size={12} style={{ color: category.color }} />
              {category.name}
            </div>
          )}

          {todoTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              <Tag size={10} />
              {tag.name}
            </div>
          ))}

          {todo.dueDate && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              overdue && !todo.completed ? 'text-red-500' : 'text-gray-500'
            )}>
              <Calendar size={12} />
              {getRelativeDateLabel(todo.dueDate)}
            </div>
          )}

          {todo.reminderTime && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {formatDateTime(todo.reminderTime)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}