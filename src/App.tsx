import { useState } from 'react';
import { useTournament } from './context/TournamentContext';
import TournamentSetup from './components/TournamentSetup';
import RoundView from './components/RoundView';
import Standings from './components/Standings';
import TournamentComplete from './components/TournamentComplete';
import './styles/index.css';

function AppContent() {
  const { state } = useTournament();
  const [viewingRoundIndex, setViewingRoundIndex] = useState(
    Math.max(0, state.currentRound - 1)
  );

  switch (state.phase) {
    case 'setup':
      return <TournamentSetup />;
    case 'playing':
      return (
        <div className="playing-layout">
          <RoundView
            viewingRoundIndex={viewingRoundIndex}
            setViewingRoundIndex={setViewingRoundIndex}
          />
          <Standings
            viewingRoundIndex={viewingRoundIndex}
            setViewingRoundIndex={setViewingRoundIndex}
          />
        </div>
      );
    case 'complete':
      return <TournamentComplete />;
  }
}

export default function App() {
  return <AppContent />;
}
