import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  CalendarDays,
  AlertCircle,
  CheckCircle,
  Tag,
  FolderOpen,
  Settings,
  Plus,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoryStore } from '@/store/categoryStore';
import { useTagStore } from '@/store/tagStore';
import { useTodoStore } from '@/store/todoStore';
import { isToday, isThisWeek, isOverdue } from '@/utils/date';

interface SidebarProps {
  onAddTodo: () => void;
  onManageCategories: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: '全部任务' },
  { path: '/today', icon: Calendar, label: '今日待办' },
  { path: '/week', icon: CalendarDays, label: '本周待办' },
  { path: '/overdue', icon: AlertCircle, label: '逾期任务' },
  { path: '/completed', icon: CheckCircle, label: '已完成' },
];

export function Sidebar({ onAddTodo, onManageCategories }: SidebarProps) {
  const { user, signOut } = useAuth();
  const { categories } = useCategoryStore();
  const { tags } = useTagStore();
  const { todos } = useTodoStore();

  const counts = {
    all: todos.length,
    today: todos.filter((t) => !t.completed && isToday(t.dueDate)).length,
    week: todos.filter((t) => !t.completed && isThisWeek(t.dueDate)).length,
    overdue: todos.filter((t) => !t.completed && isOverdue(t.dueDate, t.completed)).length,
    completed: todos.filter((t) => t.completed).length,
  };

  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: todos.filter((t) => t.categoryId === cat.id && !t.completed).length,
  }));

  return (
    <aside className="w-64 h-screen bg-[#1e3a5f] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">Todo 待办</h1>
      </div>

      <div className="p-4">
        <button
          onClick={onAddTodo}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f97316] hover:bg-[#ea7115] rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          新增任务
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {counts[item.path === '/' ? 'all' : item.path.slice(1)]}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 mb-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-sm font-medium text-white/50 uppercase tracking-wider">分类</span>
            <button
              onClick={onManageCategories}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Settings size={14} className="text-white/50" />
            </button>
          </div>
          {categoryCounts.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.id}`}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <FolderOpen size={16} style={{ color: cat.color }} />
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4">
          <span className="text-sm font-medium text-white/50 uppercase tracking-wider px-3 mb-2 block">标签</span>
          <div className="flex flex-wrap gap-2 px-3">
            {tags.map((tag) => (
              <NavLink
                key={tag.id}
                to={`/tag/${tag.id}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                  )
                }
              >
                <Tag size={12} style={{ color: tag.color }} />
                {tag.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                {(user.email?.[0] ?? 'U').toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.user_metadata?.user_name ?? user.email}
              </p>
              <p className="text-xs text-white/40">Supabase 云端同步</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </aside>
  );
}