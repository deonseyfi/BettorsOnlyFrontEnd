import { useState } from 'react';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import WelcomeBanner from './components/WelcomeBanner.jsx';
import Modal from './components/Modal.jsx';
import Tour from './components/Tour.jsx';
import Landing from './pages/Landing.jsx';
import Sports from './pages/Sports.jsx';
import Picks from './pages/Picks.jsx';
import Parlay from './pages/Parlay.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Capper from './pages/Capper.jsx';
import Inbox from './pages/Inbox.jsx';
import RoiGuide from './pages/RoiGuide.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';

export default function App() {
  const [page, setPage] = useState('landing');
  const [pageParam, setPageParam] = useState(null);
  const [modal, setModal] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);

  const navigate = (id, param = null) => {
    setPage(id);
    setPageParam(param);
    window.scrollTo(0, 0);
  };

  const openModal = m => setModal(typeof m === 'string' ? { type: m } : m);

  const renderPage = () => {
    switch (page) {
      case 'landing':     return <Landing onNavigate={navigate} onOpenModal={openModal} onStartTour={() => setTourOpen(true)} />;
      case 'sports':      return <Sports />;
      case 'picks':       return <Picks onNavigate={navigate} onOpenModal={openModal} />;
      case 'parlay':      return <Parlay />;
      case 'profile':     return <Profile onOpenModal={openModal} />;
      case 'leaderboard': return <Leaderboard onNavigate={navigate} />;
      case 'capper':      return <Capper capperId={pageParam} onOpenModal={openModal} />;
      case 'inbox':       return <Inbox />;
      case 'roi':         return <RoiGuide onOpenModal={openModal} />;
      case 'terms':       return <Terms />;
      case 'privacy':     return <Privacy />;
      default:            return <Landing onNavigate={navigate} onOpenModal={openModal} onStartTour={() => setTourOpen(true)} />;
    }
  };

  return (
    <>
      <WelcomeBanner onNavigate={navigate} />
      <Nav currentPage={page} onNavigate={navigate} onOpenModal={openModal} />
      {renderPage()}
      <Footer onNavigate={navigate} />
      <Modal modal={modal} onClose={() => setModal(null)} />
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  );
}
