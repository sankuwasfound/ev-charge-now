import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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

export interface Order {
  id: string;
  battery_id: string;
  battery_name: string;
  battery_capacity: string;
  battery_price: number;
  delivery_method: string;
  delivery_cost: number;
  total_cost: number;
  payment_method: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
  status: string;
  created_at: string;
}

export interface AppState {
  step: 'login' | 'otp' | 'location' | 'battery' | 'delivery' | 'payment' | 'tracking' | 'history';
  phone: string;
  location: Location | null;
  battery: BatteryType | null;
  deliveryMethod: DeliveryMethod | null;
  paymentMethod: PaymentMethod | null;
  totalCost: number;
  user: User | null;
  orders: Order[];
  setStep: (step: AppState['step']) => void;
  setPhone: (phone: string) => void;
  setLocation: (location: Location) => void;
  setBattery: (battery: BatteryType) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setTotalCost: (cost: number) => void;
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
  saveOrder: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  step: 'login',
  phone: '',
  location: null,
  battery: null,
  deliveryMethod: null,
  paymentMethod: null,
  totalCost: 0,
  user: null,
  orders: [],
  setStep: (step) => set({ step }),
  setPhone: (phone) => set({ phone }),
  setLocation: (location) => set({ location }),
  setBattery: (battery) => set({ battery }),
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setTotalCost: (cost) => set({ totalCost: cost }),
  setUser: (user) => set({ user }),
  setOrders: (orders) => set({ orders }),
  saveOrder: async () => {
    const { user, phone, location, battery, deliveryMethod, paymentMethod, totalCost } = get();
    if (!user || !location || !battery || !deliveryMethod || !paymentMethod) return;
    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      phone,
      location_address: location.address,
      location_lat: location.lat,
      location_lng: location.lng,
      battery_id: battery.id,
      battery_name: battery.name,
      battery_capacity: battery.capacity,
      battery_price: battery.price,
      delivery_method: deliveryMethod,
      delivery_cost: DELIVERY_COSTS[deliveryMethod],
      total_cost: totalCost,
      payment_method: paymentMethod,
    });
    if (error) console.error('Save order error:', error);
  },
  fetchOrders: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Fetch orders error:', error);
    else set({ orders: data || [] });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ step: 'login', user: null, phone: '', location: null, battery: null, deliveryMethod: null, paymentMethod: null, totalCost: 0, orders: [] });
  },
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
