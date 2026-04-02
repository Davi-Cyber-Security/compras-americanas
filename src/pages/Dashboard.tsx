import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
