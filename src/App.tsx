import { NavLink, Route, Routes } from 'react-router-dom'
import Grammar from './pages/Grammar'
import Home from './pages/Home'
import Listening from './pages/Listening'
import Reading from './pages/Reading'
import Report from './pages/Report'
import Vocabulary from './pages/Vocabulary'
import WrongBook from './pages/WrongBook'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/vocabulary', label: '词汇' },
  { to: '/grammar', label: '语法' },
  { to: '/reading', label: '阅读' },
  { to: '/listening', label: '听力' },
  { to: '/wrong-book', label: '错题本' },
  { to: '/report', label: '学习报告' },
]

export default function App() {
  return (
    <div className="shell">
      <aside className="sidebar glass">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <div className="brand-name">英语学习</div>
            <div className="brand-sub">高一 · 人教2019</div>
          </div>
        </div>
        <nav className="nav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/wrong-book" element={<WrongBook />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </div>
  )
}
