import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/Home';
import { TodayPage } from '@/pages/Today';
import { WeekPage } from '@/pages/Week';
import { OverduePage } from '@/pages/Overdue';
import { CompletedPage } from '@/pages/Completed';
import { CategoryPage, TagPage } from '@/pages/CategoryPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/week" element={<WeekPage />} />
        <Route path="/overdue" element={<OverduePage />} />
        <Route path="/completed" element={<CompletedPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/tag/:tagId" element={<TagPage />} />
      </Routes>
    </Router>
  );
}