import { NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import VocabPage from './pages/VocabPage'
import GrammarPage from './pages/GrammarPage'
import ReadingPage from './pages/ReadingPage'
import ListeningPage from './pages/ListeningPage'
import MistakesPage from './pages/MistakesPage'
import ReportPage from './pages/ReportPage'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/vocab', label: '词汇' },
  { to: '/grammar', label: '语法' },
  { to: '/reading', label: '阅读' },
  { to: '/listening', label: '听力' },
  { to: '/mistakes', label: '错题本' },
  { to: '/report', label: '学习报告' },
]

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-nav">
        <span className="app-brand">
          <span className="app-brand-dot" />
          english-learning
        </span>
        <nav className="app-nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                'app-nav-link' + (isActive ? ' is-active' : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vocab" element={<VocabPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/listening" element={<ListeningPage />} />
          <Route path="/mistakes" element={<MistakesPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>
    </div>
  )
}
