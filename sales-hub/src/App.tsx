import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pipeline from './pages/Pipeline'
import Accounts from './pages/Accounts'
import Quotes from './pages/Quotes'
import Activities from './pages/Activities'
import Products from './pages/Products'
import Team from './pages/Team'
import Forecast from './pages/Forecast'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/products" element={<Products />} />
        <Route path="/team" element={<Team />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
