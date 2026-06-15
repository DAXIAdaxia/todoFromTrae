import { AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

export function OverduePage() {
  return (
    <AppLayout
      title="逾期任务"
      icon={<AlertCircle className="text-red-500" size={24} />}
      timeFilter="overdue"
    />
  );
}
