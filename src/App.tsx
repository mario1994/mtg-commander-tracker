import { useTournament } from './context/TournamentContext';
import TournamentSetup from './components/TournamentSetup';
import RoundView from './components/RoundView';
import Standings from './components/Standings';
import TournamentComplete from './components/TournamentComplete';
import './styles/index.css';

function AppContent() {
  const { state } = useTournament();

  switch (state.phase) {
    case 'setup':
      return <TournamentSetup />;
    case 'playing':
      return (
        <div className="playing-layout">
          <RoundView />
          <Standings />
        </div>
      );
    case 'complete':
      return <TournamentComplete />;
  }
}

export default function App() {
  return <AppContent />;
}
