import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';

const PRESET_LOCATIONS = [
  { lat: 28.6139, lng: 77.209, address: 'Connaught Place, New Delhi' },
  { lat: 19.076, lng: 72.8777, address: 'Marine Drive, Mumbai' },
  { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bangalore' },
  { lat: 17.385, lng: 78.4867, address: 'Hitech City, Hyderabad' },
];

const LocationScreen = () => {
  const { setLocation, setStep } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = PRESET_LOCATIONS.filter((l) =>
    l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    if (selected !== null) {
      setLocation(filtered[selected]);
      setStep('battery');
    }
  };

  const handleUseCurrentLocation = () => {
    setLocation({ lat: 28.6139, lng: 77.209, address: 'Current Location — New Delhi' });
    setStep('battery');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-surface)' }}>
      {/* Fake Map */}
      <div className="relative h-[40vh] bg-accent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-primary animate-pulse-dot" />
            <div className="absolute -inset-4 rounded-full border-2 border-primary/30 animate-ping" />
          </div>
        </div>
        {/* Grid lines for map effect */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="currentColor" className="text-primary" />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="currentColor" className="text-primary" />
          ))}
        </svg>
        <div className="absolute bottom-4 left-4 right-4">
          <Button onClick={handleUseCurrentLocation} variant="secondary" className="w-full gap-2 shadow-md">
            <Navigation className="w-4 h-4 text-primary" /> Use Current Location
          </Button>
        </div>
      </div>

      {/* Bottom panel */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 -mt-4 rounded-t-3xl bg-card p-6 shadow-lg relative z-10"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Select your location</h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 mb-6 max-h-[30vh] overflow-y-auto">
          {filtered.map((loc, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                selected === i ? 'bg-primary/10 border-2 border-primary' : 'bg-muted border-2 border-transparent hover:bg-accent'
              }`}
            >
              <MapPin className={`w-5 h-5 flex-shrink-0 ${selected === i ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-medium ${selected === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {loc.address}
              </span>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={selected === null}
          className="w-full gradient-primary text-primary-foreground h-12 text-base font-semibold shadow-glow disabled:opacity-50"
        >
          Confirm Location
        </Button>
      </motion.div>
    </div>
  );
};

export default LocationScreen;
