import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Battery, Clock, Phone, Car, Plane, Building2, Navigation, Zap } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const TrackingScreen = () => {
  const { battery, deliveryMethod, location, totalCost } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(deliveryMethod === 'drone' ? 12 : deliveryMethod === 'carpool' ? 25 : 40);

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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-surface)' }}>
      {/* Mini Map */}
      <div className="relative h-[35vh] bg-accent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/15" />
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 3.3}%`} x2="100%" y2={`${i * 3.3}%`} stroke="currentColor" className="text-primary" />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 3.3}%`} y1="0" x2={`${i * 3.3}%`} y2="100%" stroke="currentColor" className="text-primary" />
          ))}
        </svg>

        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="25%" y1="70%" x2="75%" y2="30%" stroke="hsl(263 70% 58%)" strokeWidth="3" strokeDasharray="8 4" opacity="0.5" />
        </svg>

        {/* Destination */}
        <motion.div className="absolute" style={{ left: '25%', top: '65%' }}>
          <div className="relative">
            <MapPin className="w-8 h-8 text-primary" />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-foreground bg-card px-2 py-0.5 rounded-full shadow-sm">
              You
            </div>
          </div>
        </motion.div>

        {/* Moving delivery icon */}
        <motion.div
          className="absolute"
          initial={{ left: '75%', top: '25%' }}
          animate={{ left: `${75 - progress * 0.5}%`, top: `${25 + progress * 0.45}%` }}
          transition={{ ease: 'linear' }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <DeliveryIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-primary/20 animate-ping" />
          </div>
        </motion.div>

        {/* Station marker */}
        <div className="absolute" style={{ right: '15%', top: '20%' }}>
          <div className="flex items-center gap-1 bg-card px-2 py-1 rounded-lg shadow-sm text-[10px] text-muted-foreground">
            <Building2 className="w-3 h-3 text-primary" /> Nearest Station
          </div>
        </div>

        {/* ETA overlay */}
        <div className="absolute top-4 left-4 glass-card px-3 py-2">
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
              <div>
                <p className="text-[10px] text-muted-foreground">Model</p>
                <p className="text-sm font-medium text-foreground">{droneInfo.model}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Drone ID</p>
                <p className="text-sm font-medium text-foreground">{droneInfo.id}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Altitude</p>
                <p className="text-sm font-medium text-foreground">{droneInfo.altitude}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Speed</p>
                <p className="text-sm font-medium text-foreground">{droneInfo.speed}</p>
              </div>
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
