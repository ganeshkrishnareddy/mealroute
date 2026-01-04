import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Clients from './pages/Clients';
import Zones from './pages/Zones';
import Staff from './pages/Staff';
import DailyTasks from './pages/DailyTasks';
import Catering from './pages/Catering';
import Plans from './pages/Plans';
import Finance from './pages/Finance';
import Settings from './pages/Settings';
import Developer from './pages/Developer';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout><DashboardHome /></Layout>} />
            <Route path="/clients" element={<Layout><Clients /></Layout>} />
            <Route path="/zones" element={<Layout><Zones /></Layout>} />
            <Route path="/staff" element={<Layout><Staff /></Layout>} />
            <Route path="/tasks" element={<Layout><DailyTasks /></Layout>} />
            <Route path="/finance" element={<Layout><Finance /></Layout>} />
            <Route path="/catering" element={<Layout><Catering /></Layout>} />
            <Route path="/plans" element={<Layout><Plans /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="/developer" element={<Layout><Developer /></Layout>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
