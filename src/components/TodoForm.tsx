import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';
import { useTodoStore } from '@/store/todoStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useTagStore } from '@/store/tagStore';
import { Todo, Priority } from '@/types';
import { PRIORITY_OPTIONS } from '@/constants';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTodo?: Todo | null;
}

const priorityOptions = [
  { value: 'low', label: '低优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'high', label: '高优先级' },
];

export function TodoForm({ isOpen, onClose, editTodo }: TodoFormProps) {
  const { addTodo, updateTodo } = useTodoStore();
  const { categories } = useCategoryStore();
  const { tags } = useTagStore();

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setNote(editTodo.note);
      setDueDate(editTodo.dueDate ? editTodo.dueDate.slice(0, 10) : '');
      setReminderTime(editTodo.reminderTime ? editTodo.reminderTime.slice(0, 16) : '');
      setPriority(editTodo.priority);
      setCategoryId(editTodo.categoryId || '');
      setSelectedTagIds(editTodo.tagIds);
    } else {
      resetForm();
    }
  }, [editTodo, isOpen]);

  const resetForm = () => {
    setTitle('');
    setNote('');
    setDueDate('');
    setReminderTime('');
    setPriority('medium');
    setCategoryId('');
    setSelectedTagIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const todoData = {
      title: title.trim(),
      note: note.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null,
      priority,
      categoryId: categoryId || null,
      tagIds: selectedTagIds,
      completed: editTodo?.completed || false,
    };

    if (editTodo) {
      updateTodo(editTodo.id, todoData);
    } else {
      addTodo(todoData);
    }

    onClose();
    resetForm();
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const categoryOptions = [
    { value: '', label: '无分类' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTodo ? '编辑任务' : '新增任务'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="任务标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入任务标题..."
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            任务备注
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="输入任务备注..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="截止日期"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Input
            label="提醒时间"
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="优先级"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={priorityOptions}
          />
          <Select
            label="分类"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categoryOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: selectedTagIds.includes(tag.id)
                      ? 'rgba(255,255,255,0.5)'
                      : tag.color,
                  }}
                />
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" type="submit">
            {editTodo ? '保存修改' : '添加任务'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}