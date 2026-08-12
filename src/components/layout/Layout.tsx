import { Outlet } from 'react-router-dom'
import { LocaleProvider } from '../../i18n'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import './Layout.css'

export function Layout() {
  return (
    <LocaleProvider>
      <ScrollToTop />
      <div className="site-shell">
        <div className="site-grain" aria-hidden="true" />
        <Header />
        <main className="site-main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  )
}
