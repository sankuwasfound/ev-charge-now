import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import LoginScreen from '@/components/LoginScreen';
import OtpScreen from '@/components/OtpScreen';
import LocationScreen from '@/components/LocationScreen';
import BatteryScreen from '@/components/BatteryScreen';
import DeliveryScreen from '@/components/DeliveryScreen';
import PaymentScreen from '@/components/PaymentScreen';
import TrackingScreen from '@/components/TrackingScreen';
import OrderHistoryScreen from '@/components/OrderHistoryScreen';

const screens: Record<string, React.FC> = {
  login: LoginScreen,
  otp: OtpScreen,
  location: LocationScreen,
  battery: BatteryScreen,
  delivery: DeliveryScreen,
  payment: PaymentScreen,
  tracking: TrackingScreen,
  history: OrderHistoryScreen,
};

const Index = () => {
  const step = useAppStore((s) => s.step);
  const Screen = screens[step];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25 }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
