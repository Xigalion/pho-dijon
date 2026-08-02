'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, Bike, Store, Tag, Clock, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase, type MenuItem, type Promotion } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type CartItem = MenuItem & { qty: number };

export default function OrderPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      const { data: menu } = await supabase.from('menu_items').select('*').eq('is_available', true).order('sort_order');
      if (menu) setItems(menu as MenuItem[]);
      const { data: promos } = await supabase.from('promotions').select('*').eq('active', true);
      if (promos) setPromotions(promos as Promotion[]);
    })();
  }, []);

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'pho', label: 'Phở & Bánh Mì' },
    { id: 'rice', label: 'Riz' },
    { id: 'noodles', label: 'Nouilles' },
    { id: 'vegetarian', label: 'Végétarien' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Boissons' },
  ];
  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.name} ajouté au panier`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const subtotal = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);
  const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discount_type === 'percent') return (subtotal * appliedPromo.discount_value) / 100;
    return Math.min(appliedPromo.discount_value, subtotal);
  }, [appliedPromo, subtotal]);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const applyPromo = () => {
    const promo = promotions.find((p) => p.code.toLowerCase() === promoCode.toLowerCase());
    if (promo) {
      setAppliedPromo(promo);
      toast.success(`Code promo « ${promo.code} » appliqué !`);
    } else {
      toast.error('Code promo invalide.');
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return toast.error('Votre panier est vide.');
    if (!name || !phone) return toast.error('Veuillez entrer votre nom et téléphone.');
    if (orderType === 'delivery' && !address) return toast.error('Veuillez entrer votre adresse de livraison.');

    setLoading(true);
    const { data, error } = await supabase.rpc('create_order', {
      p_customer_name: name,
      p_customer_phone: phone,
      p_customer_email: email,
      p_type: orderType,
      p_address: address,
      p_items: cart.map((c) => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
      p_subtotal: subtotal,
      p_discount_code: appliedPromo?.code || '',
      p_total: total,
    });
    setLoading(false);

    if (error) {
      toast.error('Impossible de passer la commande. Veuillez réessayer.');
    } else {
      setConfirmed(true);
      setCart([]);
      setCartOpen(false);
      if (data) {
        fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL}/functions/v1/reservation-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationId: data, type: 'order' }),
        }).catch(() => {});
      }
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg text-center"
        >
          <div className="h-20 w-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-forest-dark" />
          </div>
          <h1 className="font-display text-4xl text-forest mb-4">Commande Validée !</h1>
          <p className="text-forest/60 mb-2">
            Merci, {name}. Votre commande {orderType === 'delivery' ? 'de livraison' : 'à emporter'} a été reçue.
          </p>
          <p className="text-forest/60 mb-2 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Délai estimé : 25–35 min
          </p>
          <p className="text-forest/60 mb-8">Nous vous appellerons au {phone} pour confirmer.</p>
          <Button onClick={() => { setConfirmed(false); setName(''); setPhone(''); setEmail(''); setAddress(''); }} className="bg-forest text-cream hover:bg-forest-light">
            Passer une Autre Commande
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[35vh] min-h-[280px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6646068/pexels-photo-6646068.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Cuisine vietnamienne"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3"
          >
            Commander en Ligne
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-medium text-cream text-shadow-lg"
          >
            Commander en Ligne
          </motion.h1>
        </div>
      </section>

      <div className="sticky top-0 z-30 glass shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all whitespace-nowrap',
                  filter === c.id ? 'bg-gold text-forest-dark' : 'bg-forest-light/20 text-cream/80 hover:bg-forest-light/40'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <Button
            onClick={() => setCartOpen(true)}
            className="bg-gold text-forest-dark hover:bg-gold-light shrink-0"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Panier ({cart.reduce((s, c) => s + c.qty, 0)})
          </Button>
        </div>
      </div>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    {item.is_popular && (
                      <Badge className="absolute top-3 left-3 bg-forest text-cream">Populaire</Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display text-lg text-forest">{item.name}</h3>
                      <span className="font-sans font-semibold text-gold-dark">{item.price.toFixed(2).replace('.', ',')}€</span>
                    </div>
                    <p className="text-xs text-forest/60 line-clamp-2 mb-3">{item.description}</p>
                    <Button onClick={() => addToCart(item)} size="sm" className="w-full bg-forest text-cream hover:bg-forest-light">
                      <Plus className="h-4 w-4 mr-1" /> Ajouter au Panier
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex"
          >
            <div className="absolute inset-0 bg-forest-dark/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative ml-auto h-full w-full max-w-md bg-cream shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-forest text-cream p-5 flex items-center justify-between z-10">
                <h2 className="font-display text-2xl">Votre Commande</h2>
                <button onClick={() => setCartOpen(false)} className="text-cream/70 hover:text-gold">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all', orderType === 'pickup' ? 'border-gold bg-gold/10' : 'border-forest/10')}
                  >
                    <Store className="h-6 w-6 text-forest" />
                    <span className="font-sans font-semibold text-forest text-sm">À emporter</span>
                    <span className="text-xs text-forest/50">Gratuit · 15-20 min</span>
                  </button>
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all', orderType === 'delivery' ? 'border-gold bg-gold/10' : 'border-forest/10')}
                  >
                    <Bike className="h-6 w-6 text-forest" />
                    <span className="font-sans font-semibold text-forest text-sm">Livraison</span>
                    <span className="text-xs text-forest/50">3,50€ · 25-35 min</span>
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-forest/40">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Votre panier est vide.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                        <img src={c.image_url} alt={c.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="flex-grow min-w-0">
                          <p className="font-sans font-semibold text-forest text-sm truncate">{c.name}</p>
                          <p className="text-gold-dark font-semibold text-sm">{(c.price * c.qty).toFixed(2).replace('.', ',')}€</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(c.id, -1)} className="h-7 w-7 rounded-full bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center font-sans text-sm text-forest">{c.qty}</span>
                          <button onClick={() => updateQty(c.id, 1)} className="h-7 w-7 rounded-full bg-forest/10 flex items-center justify-center text-forest hover:bg-forest/20">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => removeFromCart(c.id)} className="ml-1 text-red-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <>
                    <div>
                      <Label className="text-forest mb-1.5 block flex items-center gap-1">
                        <Tag className="h-4 w-4" /> Code Promo
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="WELCOME10"
                          className="rounded-lg"
                        />
                        <Button onClick={applyPromo} variant="outline" className="shrink-0">Appliquer</Button>
                      </div>
                      {appliedPromo && (
                        <p className="text-xs text-green-600 mt-1">✓ {appliedPromo.description}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-forest mb-1.5 block">Nom *</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg" placeholder="Votre nom" />
                      </div>
                      <div>
                        <Label className="text-forest mb-1.5 block">Téléphone *</Label>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg" placeholder="+33 6 00 00 00 00" />
                      </div>
                      <div>
                        <Label className="text-forest mb-1.5 block">Email</Label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg" placeholder="votre@email.com" />
                      </div>
                      {orderType === 'delivery' && (
                        <div>
                          <Label className="text-forest mb-1.5 block">Adresse de Livraison *</Label>
                          <Input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-lg" placeholder="Rue, Ville" />
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl p-4 space-y-2 text-sm font-sans">
                      <div className="flex justify-between text-forest/60">
                        <span>Sous-total</span>
                        <span>{subtotal.toFixed(2).replace('.', ',')}€</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Réduction</span>
                          <span>−{discount.toFixed(2).replace('.', ',')}€</span>
                        </div>
                      )}
                      <div className="flex justify-between text-forest/60">
                        <span>{orderType === 'delivery' ? 'Livraison' : 'À emporter'}</span>
                        <span>{deliveryFee > 0 ? `${deliveryFee.toFixed(2).replace('.', ',')}€` : 'Gratuit'}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-forest text-base pt-2 border-t border-forest/10">
                        <span>Total</span>
                        <span>{total.toFixed(2).replace('.', ',')}€</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-forest/50">
                      <Clock className="h-4 w-4" />
                      Délai estimé : 25–35 min
                    </div>

                    <Button onClick={placeOrder} disabled={loading} size="lg" className="w-full bg-gold text-forest-dark hover:bg-gold-light font-semibold h-14">
                      {loading ? 'Envoi en cours...' : `Valider · ${total.toFixed(2).replace('.', ',')}€`}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}