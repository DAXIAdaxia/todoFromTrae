import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterSortStore } from '@/store/filterSortStore';

interface SearchBoxProps {
  className?: string;
}

export function SearchBox({ className }: SearchBoxProps) {
  const { searchQuery, setSearchQuery } = useFilterSortStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);
      setSearchQuery(value);
    },
    [setSearchQuery]
  );

  const handleClear = useCallback(() => {
    setLocalQuery('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <div className={cn('relative', className)}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={localQuery}
        onChange={handleChange}
        placeholder="搜索任务..."
        className={cn(
          'w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white',
          'text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent',
          'transition-all duration-200'
        )}
      />
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={14} className="text-gray-400" />
        </button>
      )}
    </div>
  );
}