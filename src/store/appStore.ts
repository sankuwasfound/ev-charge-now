import { create } from 'zustand';

export type DeliveryMethod = 'station' | 'carpool' | 'drone';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface BatteryType {
  id: string;
  name: string;
  capacity: string;
  price: number;
  compatible: string[];
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface AppState {
  step: 'login' | 'otp' | 'location' | 'battery' | 'delivery' | 'payment' | 'tracking';
  phone: string;
  location: Location | null;
  battery: BatteryType | null;
  deliveryMethod: DeliveryMethod | null;
  paymentMethod: PaymentMethod | null;
  totalCost: number;
  setStep: (step: AppState['step']) => void;
  setPhone: (phone: string) => void;
  setLocation: (location: Location) => void;
  setBattery: (battery: BatteryType) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setTotalCost: (cost: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  step: 'login',
  phone: '',
  location: null,
  battery: null,
  deliveryMethod: null,
  paymentMethod: null,
  totalCost: 0,
  setStep: (step) => set({ step }),
  setPhone: (phone) => set({ phone }),
  setLocation: (location) => set({ location }),
  setBattery: (battery) => set({ battery }),
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setTotalCost: (cost) => set({ totalCost: cost }),
}));

export const BATTERIES: BatteryType[] = [
  { id: '1', name: 'Standard Li-ion', capacity: '40 kWh', price: 2499, compatible: ['Tata Nexon EV', 'MG ZS EV'] },
  { id: '2', name: 'Fast Charge Pack', capacity: '60 kWh', price: 3999, compatible: ['Hyundai Ioniq 5', 'Kia EV6'] },
  { id: '3', name: 'Ultra Range', capacity: '80 kWh', price: 5499, compatible: ['BMW iX', 'Mercedes EQS'] },
  { id: '4', name: 'Compact Cell', capacity: '24 kWh', price: 1499, compatible: ['Tata Tiago EV', 'Citroen eC3'] },
];

export const DELIVERY_COSTS = {
  station: 0,
  carpool: 149,
  drone: 499,
};
