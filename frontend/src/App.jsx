import { Route, Routes } from "react-router"
import Login from "./Login"
import Dashboard from "./Dashboard"
import ProtectedRoute from "./ProtectedRoute"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
