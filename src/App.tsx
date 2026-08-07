import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { isLocale } from './lib/paths'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { JourneyPage } from './pages/JourneyPage'
import { MachinePage } from './pages/MachinePage'
import { MediaPage } from './pages/MediaPage'
import { ResultsPage } from './pages/ResultsPage'
import { TeamPage } from './pages/TeamPage'

function LocaleLayout() {
  const { lang } = useParams()
  if (!lang || !isLocale(lang)) {
    return <Navigate to="/sv" replace />
  }
  return <Layout />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sv" replace />} />
      <Route path="/:lang" element={<LocaleLayout />}>
        <Route index element={<HomePage />} />
        <Route path="resa" element={<JourneyPage />} />
        <Route path="journey" element={<JourneyPage />} />
        <Route path="maskinen" element={<MachinePage />} />
        <Route path="machine" element={<MachinePage />} />
        <Route path="resultat" element={<ResultsPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="teamet" element={<TeamPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="sponsorer" element={<ContactPage />} />
        <Route path="sponsors" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/sv" replace />} />
    </Routes>
  )
}
