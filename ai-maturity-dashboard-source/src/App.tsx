
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Home } from './pages/Home';
import { MaturityDashboard } from './pages/MaturityDashboard';
import { MaturityKPIs } from './pages/MaturityKPIs';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<MaturityDashboard />} />
          <Route path="/maturity-kpis" element={<MaturityKPIs />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
