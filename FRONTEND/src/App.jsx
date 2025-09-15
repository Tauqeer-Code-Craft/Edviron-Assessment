import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Transactions from "./pages/Transactions";
import SchoolTransactions from "./pages/SchoolTransactions";
import StatusCheck from "./pages/StatusCheck";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { DashboardLayout } from "./pages/DashboardLayout";
import PaymentAnalytics from "./pages/PaymentAnalytics";

const ProtectedRoute = ({children}) => {
  const token = localStorage.getItem("token");
  if(!token){
    return <Navigate to="/sign-in" replace />
  }
  return children;
}

const App = () => {
  return(
    <Router>
      <Routes>
        {/* Auth Pages */}
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        
        {/* Dashboard Pages */}
        <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Transactions />
            </DashboardLayout>
          </ProtectedRoute>
        }
        />

        <Route
         path="/transactions/school/:schoolId" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SchoolTransactions />
              </DashboardLayout>
            </ProtectedRoute>
        }/>

        <Route
         path="/status-check"
          element={
          <ProtectedRoute>
            <DashboardLayout>
              <StatusCheck />
            </DashboardLayout>
          </ProtectedRoute>
          }/>
      <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <PaymentAnalytics />
          </DashboardLayout>
        </ProtectedRoute>
      }/>

      <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Router>
  )
}

export default App;