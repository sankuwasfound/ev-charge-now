import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';
import LeafletMap from '@/components/LeafletMap';

const PRESET_LOCATIONS = [
  { lat: 28.6139, lng: 77.209, address: 'Connaught Place, New Delhi' },
  { lat: 19.076, lng: 72.8777, address: 'Marine Drive, Mumbai' },
  { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bangalore' },
  { lat: 17.385, lng: 78.4867, address: 'Hitech City, Hyderabad' },
];

const LocationScreen = () => {
  const { setLocation, setStep, logout } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [customPin, setCustomPin] = useState<{ lat: number; lng: number } | null>(null);

  const filtered = PRESET_LOCATIONS.filter((l) =>
    l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCenter: [number, number] = selected !== null
    ? [filtered[selected].lat, filtered[selected].lng]
    : customPin
      ? [customPin.lat, customPin.lng]
      : [28.6139, 77.209];

  const handleMapClick = (lat: number, lng: number) => {
    setCustomPin({ lat, lng });
    setSelected(null);
  };

  const handleContinue = () => {
    if (selected !== null) {
      setLocation(filtered[selected]);
      setStep('battery');
    } else if (customPin) {
      setLocation({ ...customPin, address: `Custom Location (${customPin.lat.toFixed(4)}, ${customPin.lng.toFixed(4)})` });
      setStep('battery');
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Current Location' });
          setStep('battery');
        },
        () => {
          setLocation({ lat: 28.6139, lng: 77.209, address: 'Current Location — New Delhi' });
          setStep('battery');
        }
      );
    } else {
      setLocation({ lat: 28.6139, lng: 77.209, address: 'Current Location — New Delhi' });
      setStep('battery');
    }
  };

  const markers = [
    ...(selected !== null ? [{ lat: filtered[selected].lat, lng: filtered[selected].lng, label: 'Selected', color: 'hsl(263,70%,58%)' }] : []),
    ...(customPin ? [{ lat: customPin.lat, lng: customPin.lng, label: 'Pinned', color: '#e11d48' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-surface)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border z-20">
        <h2 className="font-semibold text-foreground">Select Location</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { useAppStore.getState().fetchOrders(); setStep('history'); }}>
            <History className="w-4 h-4 mr-1" /> Orders
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative h-[40vh]">
        <LeafletMap
          center={currentCenter}
          zoom={12}
          markers={markers}
          onClick={handleMapClick}
          className="h-full"
        />
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
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
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 mb-6 max-h-[25vh] overflow-y-auto">
          {filtered.map((loc, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelected(i); setCustomPin(null); }}
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

        {customPin && selected === null && (
          <p className="text-xs text-muted-foreground mb-3">📍 Custom pin at {customPin.lat.toFixed(4)}, {customPin.lng.toFixed(4)}</p>
        )}

        <Button
          onClick={handleContinue}
          disabled={selected === null && !customPin}
          className="w-full gradient-primary text-primary-foreground h-12 text-base font-semibold shadow-glow disabled:opacity-50"
        >
          Confirm Location
        </Button>
      </motion.div>
    </div>
  );
};

export default LocationScreen;
