import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Battery, Car, Plane, Building2, Clock, RefreshCw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, BATTERIES, DELIVERY_COSTS } from '@/store/appStore';
import type { DeliveryMethod } from '@/store/appStore';

const methodIcons: Record<string, typeof Car> = {
  station: Building2,
  carpool: Car,
  drone: Plane,
};

const OrderHistoryScreen = () => {
  const { orders, fetchOrders, setStep, setBattery, setDeliveryMethod, setTotalCost, setLocation } = useAppStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order: typeof orders[0]) => {
    const battery = BATTERIES.find((b) => b.id === order.battery_id) || BATTERIES[0];
    setBattery(battery);
    setLocation({ lat: order.location_lat, lng: order.location_lng, address: order.location_address });
    setDeliveryMethod(order.delivery_method as DeliveryMethod);
    setTotalCost(battery.price + DELIVERY_COSTS[order.delivery_method as DeliveryMethod]);
    setStep('payment');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const Icon = (method: string) => methodIcons[method] || Package;

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'var(--gradient-surface)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <button onClick={() => setStep('location')} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order History</h1>
            <p className="text-sm text-muted-foreground">{orders.length} past order{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchOrders}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
            <Button onClick={() => setStep('location')} className="mt-4 gradient-primary text-primary-foreground">
              Place your first order
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => {
              const MethodIcon = Icon(order.delivery_method);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                        <Battery className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{order.battery_name}</p>
                        <p className="text-xs text-muted-foreground">{order.battery_capacity}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === 'completed' ? 'bg-success/10 text-success' :
                      order.status === 'active' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MethodIcon className="w-3 h-3" />
                      <span className="capitalize">{order.delivery_method === 'carpool' ? 'Car Pooling' : order.delivery_method}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-bold text-foreground">₹{order.total_cost.toLocaleString()}</span>
                    <Button size="sm" variant="outline" onClick={() => handleReorder(order)} className="text-xs">
                      <RefreshCw className="w-3 h-3 mr-1" /> Reorder
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderHistoryScreen;
