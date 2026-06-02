import { useTagStore } from '@/store/tagStore';
import { useFilterSortStore } from '@/store/filterSortStore';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';

interface FilterBarProps {
  className?: string;
}

export function FilterBar({ className }: FilterBarProps) {
  const { tags } = useTagStore();
  const { tagIds, setTagFilter, clearFilters } = useFilterSortStore();

  const handleTagClick = (tagId: string) => {
    if (tagIds.includes(tagId)) {
      setTagFilter(tagIds.filter((id) => id !== tagId));
    } else {
      setTagFilter([...tagIds, tagId]);
    }
  };

  const hasFilters = tagIds.length > 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">标签筛选:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all',
              tagIds.includes(tag.id)
                ? 'bg-[#1e3a5f] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                tagIds.includes(tag.id) ? 'bg-white/50' : ''
              )}
              style={{ backgroundColor: tagIds.includes(tag.id) ? undefined : tag.color }}
            />
            {tag.name}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          清除筛选
        </button>
      )}
    </div>
  );
}