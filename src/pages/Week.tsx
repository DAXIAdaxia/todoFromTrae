import { CalendarDays } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

export function WeekPage() {
  return (
    <AppLayout
      title="本周待办"
      icon={<CalendarDays className="text-[#1e3a5f]" size={24} />}
      timeFilter="week"
    />
  );
}
