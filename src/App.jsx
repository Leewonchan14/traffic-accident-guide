import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Diagnose from './components/Diagnose.jsx'
import Immediate from './components/Immediate.jsx'
import Highway from './components/Highway.jsx'
import Simulator3D from './components/Simulator3D.jsx'
import Evidence from './components/Evidence.jsx'
import Never from './components/Never.jsx'
import AfterFlow from './components/AfterFlow.jsx'
import Contacts from './components/Contacts.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import MobileBar from './components/MobileBar.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Diagnose />
        <Immediate />
        <Highway />
        <Simulator3D />
        <Evidence />
        <Never />
        <AfterFlow />
        <Contacts />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
