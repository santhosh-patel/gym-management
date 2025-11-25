import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Plans from './pages/Plans';
import Subscriptions from './pages/Subscriptions';
import { LayoutDashboard, Users, CreditCard, CalendarCheck } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <header className="header">
          <h1>Gym Manager</h1>
        </header>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutDashboard size={18} /> Dashboard
            </div>
          </NavLink>
          <NavLink to="/members" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Members
            </div>
          </NavLink>
          <NavLink to="/plans" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} /> Plans
            </div>
          </NavLink>
          <NavLink to="/subscriptions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarCheck size={18} /> Subscriptions
            </div>
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
