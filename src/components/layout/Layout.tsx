import { Outlet } from 'react-router-dom'
import { LocaleProvider } from '../../i18n'
import { Seo } from '../seo/Seo'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import { SkipLink } from './SkipLink'
import './Layout.css'

export function Layout() {
  return (
    <LocaleProvider>
      <Seo />
      <ScrollToTop />
      <SkipLink />
      <div className="site-shell">
        <div className="site-grain" aria-hidden="true" />
        <Header />
        <main id="main" className="site-main" tabIndex={-1}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </LocaleProvider>
  )
}
