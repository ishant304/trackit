import { Route, Routes } from "react-router"
import Login from "./Login"
import Dashboard from "./Dashboard"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  )
}

export default App
