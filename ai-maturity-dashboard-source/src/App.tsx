
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Home } from './pages/Home';
import { MaturityDashboard } from './pages/MaturityDashboard';
import { MaturityKPIs } from './pages/MaturityKPIs';
import { RobotLayout } from './components/Layout/RobotLayout';
import { RobotViewerPage } from './pages/RobotViewer';
import { RobotConnectivityPage } from './pages/RobotConnectivity';
import { RobotControlPage } from './pages/RobotControl';
import { RobotApiPage } from './pages/RobotApi';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<MaturityDashboard />} />
          <Route path="/maturity-kpis" element={<MaturityKPIs />} />
          <Route path="/robot/viewer" element={<RobotLayout><RobotViewerPage /></RobotLayout>} />
          <Route path="/robot/connectivity" element={<RobotLayout><RobotConnectivityPage /></RobotLayout>} />
          <Route path="/robot/control" element={<RobotLayout><RobotControlPage /></RobotLayout>} />
          <Route path="/robot/api" element={<RobotLayout><RobotApiPage /></RobotLayout>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
