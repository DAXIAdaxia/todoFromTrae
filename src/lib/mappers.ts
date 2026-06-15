import { Todo, Category, Tag } from '@/types';
import type { Database } from '@/types/database';

type DbTodo = Database['public']['Tables']['todos']['Row'];
type DbCategory = Database['public']['Tables']['categories']['Row'];
type DbTag = Database['public']['Tables']['tags']['Row'];

export function mapTodoFromDb(row: DbTodo, tagIds: string[] = []): Todo {
  return {
    id: row.id,
    title: row.title,
    note: row.note,
    dueDate: row.due_date,
    reminderTime: row.reminder_time,
    priority: row.priority,
    categoryId: row.category_id,
    tagIds,
    completed: row.completed,
    order: row.order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCategoryFromDb(row: DbCategory): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    order: row.order,
  };
}

export function mapTagFromDb(row: DbTag): Tag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
  };
}
