import { Calendar } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

export function TodayPage() {
  return (
    <AppLayout
      title="今日待办"
      icon={<Calendar className="text-[#1e3a5f]" size={24} />}
      timeFilter="today"
    />
  );
}
