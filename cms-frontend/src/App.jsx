import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ActivityEdit from './pages/ActivityEdit';
import ActivityList from './pages/ActivityList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ActivityList />} />
        <Route path="/activities/:id" element={<ActivityEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
