import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isBefore,
  format,
  parseISO,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: string | null, formatStr: string = 'yyyy-MM-dd'): string | null => {
  if (!date) return null;
  try {
    return format(parseISO(date), formatStr, { locale: zhCN });
  } catch {
    return null;
  }
};

export const formatDateTime = (date: string | null): string | null => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

export const isToday = (date: string | null): boolean => {
  if (!date) return false;
  const parsedDate = parseISO(date);
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  return isWithinInterval(parsedDate, { start: todayStart, end: todayEnd });
};

export const isThisWeek = (date: string | null): boolean => {
  if (!date) return false;
  const parsedDate = parseISO(date);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  return isWithinInterval(parsedDate, { start: weekStart, end: weekEnd });
};

export const isOverdue = (date: string | null, completed: boolean): boolean => {
  if (!date || completed) return false;
  const parsedDate = parseISO(date);
  const todayStart = startOfDay(new Date());
  return isBefore(parsedDate, todayStart);
};

export const getRelativeDateLabel = (date: string | null): string | null => {
  if (!date) return null;
  if (isToday(date)) return '今天';
  if (isThisWeek(date)) return '本周';
  return formatDate(date);
};