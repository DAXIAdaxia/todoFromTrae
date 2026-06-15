import { CheckCircle } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

export function CompletedPage() {
  return (
    <AppLayout
      title="已完成"
      icon={<CheckCircle className="text-green-500" size={24} />}
      timeFilter="completed"
    />
  );
}
