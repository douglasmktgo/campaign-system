import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import BriefCapture from "./pages/BriefCapture";
import TaskReview from "./pages/TaskReview";
import SyncConfirmation from "./pages/SyncConfirmation";
import TaskClose from "./pages/TaskClose";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<BriefCapture />} />
        <Route path="/campaigns/:id/review" element={<TaskReview />} />
        <Route path="/campaigns/:id/sync" element={<SyncConfirmation />} />
        <Route path="/campaigns/:id/close" element={<TaskClose />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}
