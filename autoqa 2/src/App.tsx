import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/app/AppLayout';
import { Login, Otp } from './screens/Auth';
import Dashboard from './screens/Dashboard';
import Calls from './screens/Calls';
import CallDetail from './screens/CallDetail';
import AgentPerformance from './screens/AgentPerformance';
import AgentDetail from './screens/AgentDetail';
import GuidelinePerformance from './screens/GuidelinePerformance';
import ReviewGuideline from './screens/ReviewGuideline';
import Guidelines from './screens/Guidelines';
import Agents from './screens/Agents';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/calls/:callId" element={<CallDetail />} />
        <Route path="/agent-performance" element={<AgentPerformance />} />
        <Route path="/agent-performance/:agentId" element={<AgentDetail />} />
        <Route path="/guideline-performance" element={<GuidelinePerformance />} />
        <Route path="/guideline-performance/:guidelineId" element={<ReviewGuideline />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/agents" element={<Agents />} />
      </Route>
      <Route path="*" element={<Navigate to="/calls" replace />} />
    </Routes>
  );
}
