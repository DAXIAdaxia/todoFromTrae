import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Plus, Edit2, Trash2, FolderOpen, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/categoryStore';
import { useTagStore } from '@/store/tagStore';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#1e3a5f', '#f97316', '#22c55e', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1', '#84cc16',
];

export function CategoryManager({ isOpen, onClose }: CategoryManagerProps) {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { tags, addTag, updateTag, deleteTag } = useTagStore();
  
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    if (activeTab === 'categories') {
      addCategory(newName.trim(), newColor);
    } else {
      addTag(newName.trim(), newColor);
    }
    
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
    setIsAdding(false);
  };

  const handleEdit = (id: string, name: string, color: string) => {
    setEditingId(id);
    setNewName(name);
    setNewColor(color);
  };

  const handleSaveEdit = (id: string) => {
    if (!newName.trim()) return;
    
    if (activeTab === 'categories') {
      updateCategory(id, { name: newName.trim(), color: newColor });
    } else {
      updateTag(id, { name: newName.trim(), color: newColor });
    }
    
    setEditingId(null);
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除吗？')) {
      if (activeTab === 'categories') {
        deleteCategory(id);
      } else {
        deleteTag(id);
      }
    }
  };

  const items = activeTab === 'categories' ? categories : tags;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="管理分类与标签" size="md">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setActiveTab('categories');
            setIsAdding(false);
            setEditingId(null);
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'categories'
              ? 'bg-[#1e3a5f] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <FolderOpen size={16} />
          分类
        </button>
        <button
          onClick={() => {
            setActiveTab('tags');
            setIsAdding(false);
            setEditingId(null);
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'tags'
              ? 'bg-[#1e3a5f] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          <Tag size={16} />
          标签
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            {editingId === item.id ? (
              <>
                <div className="flex gap-1.5 flex-shrink-0">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={cn(
                        'w-5 h-5 rounded-full border-2 transition-all',
                        newColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  autoFocus
                />
                <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                  保存
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  取消
                </Button>
              </>
            ) : (
              <>
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 font-medium text-gray-700">{item.name}</span>
                <button
                  onClick={() => handleEdit(item.id, item.name, item.color)}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                >
                  <Edit2 size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                </button>
              </>
            )}
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-1.5 flex-shrink-0">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all',
                    newColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="输入名称..."
              className="flex-1 px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              autoFocus
            />
            <Button size="sm" onClick={handleAdd}>
              添加
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              取消
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full justify-center"
          >
            <Plus size={16} />
            添加{activeTab === 'categories' ? '分类' : '标签'}
          </button>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
        <Button variant="secondary" onClick={onClose}>
          关闭
        </Button>
      </div>
    </Modal>
  );
}