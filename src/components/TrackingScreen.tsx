import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Battery, Clock, Phone, Car, Plane, Building2, Navigation, Zap } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import LeafletMap from '@/components/LeafletMap';

const TrackingScreen = () => {
  const { battery, deliveryMethod, location, totalCost } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(deliveryMethod === 'drone' ? 12 : deliveryMethod === 'carpool' ? 25 : 40);

  const destLat = location?.lat || 28.6139;
  const destLng = location?.lng || 77.209;
  const startLat = destLat + 0.04;
  const startLng = destLng + 0.05;

  const currentLat = startLat + (destLat - startLat) * (progress / 100);
  const currentLng = startLng + (destLng - startLng) * (progress / 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 0.5, 85));
      setEta((e) => Math.max(e - 0.1, 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const driverInfo = {
    name: 'Rajesh Kumar',
    carNumber: 'DL 01 AB 1234',
    phone: '+91 98765 43210',
    rating: 4.8,
  };

  const droneInfo = {
    model: 'SkyCharge X200',
    id: 'DRN-4829',
    altitude: '120m',
    speed: '65 km/h',
  };

  const DeliveryIcon = deliveryMethod === 'drone' ? Plane : deliveryMethod === 'carpool' ? Car : Building2;
  const deliveryLabel = deliveryMethod === 'drone' ? 'Drone' : deliveryMethod === 'carpool' ? 'Driver' : 'Station';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-surface)' }}>
      {/* Live Map */}
      <div className="relative h-[35vh]">
        <LeafletMap
          center={[destLat, destLng]}
          zoom={13}
          markers={[
            { lat: destLat, lng: destLng, label: 'You', color: '#16a34a' },
            { lat: startLat + 0.01, lng: startLng + 0.01, label: 'Station', color: '#6366f1' },
          ]}
          movingMarker={{ lat: currentLat, lng: currentLng, label: deliveryLabel }}
          routeLine={{ from: [destLat, destLng], to: [startLat, startLng] }}
          className="h-full"
        />
        {/* ETA overlay */}
        <div className="absolute top-4 left-4 glass-card px-3 py-2 z-[1000]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">ETA</p>
              <p className="text-sm font-bold text-foreground">{Math.ceil(eta)} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 -mt-4 rounded-t-3xl bg-card p-6 shadow-lg relative z-10 overflow-y-auto"
      >
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Order confirmed</span>
            <span>Arriving</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: '5%' }}
              animate={{ width: `${Math.max(progress, 10)}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-sm font-semibold text-foreground">
              {deliveryMethod === 'carpool' ? 'Driver on the way' : deliveryMethod === 'drone' ? 'Drone in flight' : 'Ready for pickup'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Battery</p>
                <p className="text-xs font-medium text-foreground">{battery?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DeliveryIcon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Method</p>
                <p className="text-xs font-medium text-foreground capitalize">{deliveryMethod === 'carpool' ? 'Car Pooling' : deliveryMethod === 'drone' ? 'Drone' : 'Station'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-xs font-medium text-foreground truncate max-w-[120px]">{location?.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Total</p>
                <p className="text-xs font-medium text-foreground">₹{totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver / Drone info */}
        {deliveryMethod === 'carpool' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Driver Details</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {driverInfo.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{driverInfo.name}</p>
                <p className="text-xs text-muted-foreground">{driverInfo.carNumber}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-warning">★</span>
                  <span className="text-xs text-muted-foreground">{driverInfo.rating}</span>
                </div>
              </div>
              <a href={`tel:${driverInfo.phone}`} className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-success" />
              </a>
            </div>
          </motion.div>
        )}

        {deliveryMethod === 'drone' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Drone Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-[10px] text-muted-foreground">Model</p><p className="text-sm font-medium text-foreground">{droneInfo.model}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Drone ID</p><p className="text-sm font-medium text-foreground">{droneInfo.id}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Altitude</p><p className="text-sm font-medium text-foreground">{droneInfo.altitude}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Speed</p><p className="text-sm font-medium text-foreground">{droneInfo.speed}</p></div>
            </div>
          </motion.div>
        )}

        {deliveryMethod === 'station' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Station Info</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">EV Rescue Station #12</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> 2.3 km away • Open 24/7
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackingScreen;
