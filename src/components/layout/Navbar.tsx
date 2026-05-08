import { BellRing, RadioTower, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  soundOn: boolean;
  liveMode: boolean;
  onToggleSound: () => void;
  onToggleMode: () => void;
}

export function Navbar({
  soundOn,
  liveMode,
  onToggleSound,
  onToggleMode,
}: NavbarProps) {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand__mark">
          <RadioTower size={18} />
        </div>
        <div>
          <p className="eyebrow">Smart Hazard Awareness</p>
          <h1>DriveRadar</h1>
        </div>
      </div>

      <nav className="nav-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#map">Map</a>
        <a href="#analytics">Analytics</a>
        <a href="#about">About</a>
      </nav>

      <div className="nav-actions">
        <button type="button" className="chip chip--icon" onClick={onToggleSound}>
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {soundOn ? 'Sound On' : 'Muted'}
        </button>
        <button type="button" className={`chip ${liveMode ? 'chip--live' : ''}`} onClick={onToggleMode}>
          <BellRing size={16} />
          {liveMode ? 'Live Mode' : 'Demo Mode'}
        </button>
      </div>
    </header>
  );
}
