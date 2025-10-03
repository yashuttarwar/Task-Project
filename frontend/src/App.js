import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route goes to Signup page */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Task Page */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TaskPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;








