import { useParams } from 'react-router-dom';
import { FolderOpen, Tag } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { useCategoryStore } from '@/store/categoryStore';
import { useTagStore } from '@/store/tagStore';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories } = useCategoryStore();
  const category = categories.find((c) => c.id === categoryId);

  return (
    <AppLayout
      title={category?.name || '分类任务'}
      icon={
        <FolderOpen
          size={24}
          style={{ color: category?.color || '#1e3a5f' }}
        />
      }
      categoryId={categoryId}
    />
  );
}

export function TagPage() {
  const { tagId } = useParams<{ tagId: string }>();
  const { tags } = useTagStore();
  const tag = tags.find((t) => t.id === tagId);

  return (
    <AppLayout
      title={tag?.name || '标签任务'}
      icon={<Tag size={24} style={{ color: tag?.color || '#1e3a5f' }} />}
      tagId={tagId}
    />
  );
}
