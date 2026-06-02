import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterSortStore } from '@/store/filterSortStore';
import { SortState } from '@/types';

interface SortControlProps {
  className?: string;
}

const sortOptions: { value: SortState['sortBy']; label: string }[] = [
  { value: 'order', label: '自定义' },
  { value: 'dueDate', label: '截止时间' },
  { value: 'priority', label: '优先级' },
  { value: 'createdAt', label: '创建时间' },
];

export function SortControl({ className }: SortControlProps) {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useFilterSortStore();

  const handleToggleOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ArrowUpDown size={16} className="text-gray-400" />
      <span className="text-sm text-gray-500">排序:</span>
      
      <div className="flex items-center gap-1">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-all',
              sortBy === option.value
                ? 'bg-[#1e3a5f] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleToggleOrder}
        className={cn(
          'p-1.5 rounded-lg transition-colors',
          'bg-gray-100 hover:bg-gray-200 text-gray-600'
        )}
        title={sortOrder === 'asc' ? '升序' : '降序'}
      >
        {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      </button>
    </div>
  );
}