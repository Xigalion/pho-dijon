'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed, Calendar, Image, Star, Tag, ShoppingBag,
  Plus, Pencil, Trash2, X, Save, TrendingUp, Clock, CheckCircle2,
  Settings, Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AdminGuard } from '@/components/site/admin-guard';
import { SettingsManager } from '@/components/admin/settings-manager';
import { BackupManager } from '@/components/admin/backup-manager';
import {
  supabase,
  type MenuItem,
  type Reservation,
  type EventItem,
  type GalleryImage,
  type Testimonial,
  type Promotion,
} from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Tab = 'overview' | 'menu' | 'reservations' | 'events' | 'gallery' | 'testimonials' | 'promotions' | 'orders' | 'settings' | 'backups';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview', label: 'Aperçu', icon: TrendingUp },
  { id: 'menu', label: 'Carte', icon: UtensilsCrossed },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'events', label: 'Événements', icon: Calendar },
  { id: 'gallery', label: 'Galerie', icon: Image },
  { id: 'testimonials', label: 'Avis', icon: Star },
  { id: 'promotions', label: 'Promotions', icon: Tag },
  { id: 'orders', label: 'Commandes', icon: ShoppingBag },
  { id: 'settings', label: 'Paramètres', icon: Settings },
  { id: 'backups', label: 'Sauvegardes', icon: Database },
];

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}

function AdminContent() {
  const [tab, setTab] = useState<Tab>('overview');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const loadAll = async () => {
    const [{ data: m }, { data: r }, { data: e }, { data: g }, { data: t }, { data: p }, { data: o }] = await Promise.all([
      supabase.from('menu_items').select('*').order('sort_order'),
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('*').order('date'),
      supabase.from('gallery_images').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('promotions').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    if (m) setMenu(m as MenuItem[]);
    if (r) setReservations(r as Reservation[]);
    if (e) setEvents(e as EventItem[]);
    if (g) setGallery(g as GalleryImage[]);
    if (t) setTestimonials(t as Testimonial[]);
    if (p) setPromotions(p as Promotion[]);
    if (o) setOrders(o as any[]);
  };

  useEffect(() => { loadAll(); }, []);

  return (
    <>
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setEditing(null); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-sans font-medium transition-all whitespace-nowrap',
              tab === t.id ? 'bg-gold text-forest-dark' : 'bg-forest-light/30 text-cream/70 hover:bg-forest-light/50'
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 'overview' && <Overview menu={menu} reservations={reservations} orders={orders} events={events} testimonials={testimonials} />}
        {tab === 'menu' && <MenuManager items={menu} editing={editing} setEditing={setEditing} reload={loadAll} />}
        {tab === 'reservations' && <ReservationsManager reservations={reservations} reload={loadAll} />}
        {tab === 'events' && <EventsManager events={events} editing={editing} setEditing={setEditing} reload={loadAll} />}
        {tab === 'gallery' && <GalleryManager gallery={gallery} editing={editing} setEditing={setEditing} reload={loadAll} />}
        {tab === 'testimonials' && <TestimonialsManager testimonials={testimonials} editing={editing} setEditing={setEditing} reload={loadAll} />}
        {tab === 'promotions' && <PromotionsManager promotions={promotions} editing={editing} setEditing={setEditing} reload={loadAll} />}
        {tab === 'orders' && <OrdersManager orders={orders} reload={loadAll} />}
        {tab === 'settings' && <SettingsManager />}
        {tab === 'backups' && <BackupManager />}
      </motion.div>

      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onSave={async (data) => {
        const table = data._table;
        const tables = ['menu_items', 'events', 'gallery_images', 'testimonials', 'promotions'];
        for (const tbl of tables) {
          if (table === tbl) {
            const { id, _table, ...rest } = data;
            if (id) {
              const { error } = await supabase.from(tbl).update(rest).eq('id', id);
              if (error) toast.error('Échec de la mise à jour'); else toast.success('Mis à jour avec succès');
            } else {
              const { error } = await supabase.from(tbl).insert(rest);
              if (error) toast.error('Échec de la création'); else toast.success('Ajouté avec succès');
            }
          }
        }
        setEditing(null);
        loadAll();
      }} />}
    </>
  );
}

function Overview({ menu, reservations, orders, events, testimonials }: any) {
  const pendingRes = reservations.filter((r: Reservation) => r.status === 'pending').length;
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const stats = [
    { label: 'Plats à la carte', value: menu.length, icon: UtensilsCrossed, color: 'text-gold' },
    { label: 'Réservations en attente', value: pendingRes, icon: Calendar, color: 'text-blue-400' },
    { label: 'Commandes en attente', value: pendingOrders, icon: ShoppingBag, color: 'text-orange-400' },
    { label: 'Événements à venir', value: events.length, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Avis clients', value: testimonials.length, icon: Star, color: 'text-yellow-400' },
    { label: 'Chiffre (commandes)', value: `${orders.reduce((s: number, o: any) => s + (o.total || 0), 0).toFixed(0)}€`, icon: TrendingUp, color: 'text-gold' },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-forest-light/20 rounded-2xl p-6">
            <s.icon className={cn('h-6 w-6 mb-3', s.color)} />
            <p className="font-display text-3xl text-cream">{s.value}</p>
            <p className="text-sm text-cream/50">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-forest-light/20 rounded-2xl p-6">
        <h3 className="font-display text-xl text-cream mb-4">Réservations Récentes</h3>
        <div className="space-y-2">
          {reservations.slice(0, 5).map((r: Reservation) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-forest-light/20 last:border-0">
              <div>
                <p className="text-cream font-sans text-sm">{r.name} · {r.guests} personnes</p>
                <p className="text-cream/40 text-xs">{r.date} à {r.time}</p>
              </div>
              <Badge className={r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {r.status === 'pending' ? 'En attente' : r.status === 'confirmed' ? 'Confirmée' : 'Refusée'}
              </Badge>
            </div>
          ))}
          {reservations.length === 0 && <p className="text-cream/40 text-sm">Aucune réservation pour le moment.</p>}
        </div>
      </div>
    </div>
  );
}

function MenuManager({ items, editing, setEditing, reload }: any) {
  const del = async (id: string) => {
    if (!confirm('Supprimer ce plat ?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) toast.error('Échec de la suppression'); else { toast.success('Plat supprimé'); reload(); }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-cream/50 text-sm">{items.length} plats</p>
        <Button onClick={() => setEditing({ _table: 'menu_items', name: '', description: '', price: 0, category: 'pho', image_url: '', calories: 0, spice_level: 0, is_popular: false, is_chef_choice: false, is_available: true, sort_order: 0 })} className="bg-gold text-forest-dark hover:bg-gold-light">
          <Plus className="h-4 w-4 mr-1" /> Ajouter un Plat
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: MenuItem) => (
          <div key={item.id} className="bg-forest-light/20 rounded-xl overflow-hidden">
            <div className="relative aspect-video">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              {!item.is_available && <div className="absolute inset-0 bg-forest-dark/60 flex items-center justify-center"><span className="text-cream text-sm">Indisponible</span></div>}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-display text-lg text-cream">{item.name}</h3>
                <span className="text-gold font-semibold">{item.price.toFixed(2).replace('.', ',')}€</span>
              </div>
              <p className="text-cream/40 text-xs line-clamp-2 mb-3">{item.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 border-forest-light/30 text-cream hover:bg-forest-light/30" onClick={() => setEditing({ ...item, _table: 'menu_items' })}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Modifier
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => del(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationsManager({ reservations, reload }: any) {
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
    if (error) toast.error('Échec de la mise à jour'); else { toast.success('Réservation mise à jour'); reload(); }
  };
  return (
    <div className="space-y-3">
      {reservations.map((r: Reservation) => (
        <div key={r.id} className="bg-forest-light/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-lg text-cream">{r.name}</h3>
              <Badge className={r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {r.status === 'pending' ? 'En attente' : r.status === 'confirmed' ? 'Confirmée' : 'Refusée'}
              </Badge>
            </div>
            <p className="text-cream/50 text-sm">{r.email} · {r.phone}</p>
            <p className="text-cream/40 text-sm">{r.date} à {r.time} · {r.guests} personnes · {r.seating === 'indoor' ? 'Intérieur' : 'Terrasse'}</p>
            {r.special_request && <p className="text-cream/40 text-sm italic mt-1">« {r.special_request} »</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            {r.status === 'pending' && (
              <>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(r.id, 'confirmed')}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Confirmer
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => updateStatus(r.id, 'cancelled')}>
                  Refuser
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
      {reservations.length === 0 && <p className="text-cream/40 text-center py-12">Aucune réservation pour le moment.</p>}
    </div>
  );
}

function EventsManager({ events, editing, setEditing, reload }: any) {
  const del = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) toast.error('Échec de la suppression'); else { toast.success('Événement supprimé'); reload(); }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-cream/50 text-sm">{events.length} événements</p>
        <Button onClick={() => setEditing({ _table: 'events', title: '', description: '', image_url: '', date: '', time: '', location: '', price: 0, capacity: 0 })} className="bg-gold text-forest-dark hover:bg-gold-light">
          <Plus className="h-4 w-4 mr-1" /> Ajouter un Événement
        </Button>
      </div>
      <div className="space-y-3">
        {events.map((event: EventItem) => (
          <div key={event.id} className="bg-forest-light/20 rounded-xl p-4 flex items-center gap-4">
            <img src={event.image_url} alt={event.title} className="h-16 w-24 rounded-lg object-cover shrink-0" />
            <div className="flex-grow min-w-0">
              <h3 className="font-display text-lg text-cream truncate">{event.title}</h3>
              <p className="text-cream/40 text-sm">{event.date} · {event.time} · {event.price.toFixed(0)}€/pers</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" className="border-forest-light/30 text-cream hover:bg-forest-light/30" onClick={() => setEditing({ ...event, _table: 'events' })}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => del(event.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryManager({ gallery, editing, setEditing, reload }: any) {
  const del = async (id: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) toast.error('Échec de la suppression'); else { toast.success('Image supprimée'); reload(); }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-cream/50 text-sm">{gallery.length} images</p>
        <Button onClick={() => setEditing({ _table: 'gallery_images', title: '', image_url: '', category: 'food' })} className="bg-gold text-forest-dark hover:bg-gold-light">
          <Plus className="h-4 w-4 mr-1" /> Ajouter une Image
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((img: GalleryImage) => (
          <div key={img.id} className="group relative rounded-xl overflow-hidden">
            <img src={img.image_url} alt={img.title} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-forest-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <p className="text-cream text-sm font-sans">{img.title}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-cream/30 text-cream" onClick={() => setEditing({ ...img, _table: 'gallery_images' })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400" onClick={() => del(img.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsManager({ testimonials, editing, setEditing, reload }: any) {
  const del = async (id: string) => {
    if (!confirm('Supprimer cet avis ?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) toast.error('Échec de la suppression'); else { toast.success('Avis supprimé'); reload(); }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-cream/50 text-sm">{testimonials.length} avis</p>
        <Button onClick={() => setEditing({ _table: 'testimonials', name: '', rating: 5, comment: '', source: 'google', avatar_url: '' })} className="bg-gold text-forest-dark hover:bg-gold-light">
          <Plus className="h-4 w-4 mr-1" /> Ajouter un Avis
        </Button>
      </div>
      <div className="space-y-3">
        {testimonials.map((t: Testimonial) => (
          <div key={t.id} className="bg-forest-light/20 rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-display text-lg text-cream">{t.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-forest-light/30 text-cream hover:bg-forest-light/30" onClick={() => setEditing({ ...t, _table: 'testimonials' })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => del(t.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="text-cream/50 text-sm italic">« {t.comment} »</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PromotionsManager({ promotions, editing, setEditing, reload }: any) {
  const del = async (id: string) => {
    if (!confirm('Supprimer cette promotion ?')) return;
    const { error } = await supabase.from('promotions').delete().eq('id', id);
    if (error) toast.error('Échec de la suppression'); else { toast.success('Promotion supprimée'); reload(); }
  };
  const toggle = async (p: Promotion) => {
    const { error } = await supabase.from('promotions').update({ active: !p.active }).eq('id', p.id);
    if (error) toast.error('Échec de la mise à jour'); else reload();
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-cream/50 text-sm">{promotions.length} promotions</p>
        <Button onClick={() => setEditing({ _table: 'promotions', code: '', description: '', discount_type: 'percent', discount_value: 10, active: true })} className="bg-gold text-forest-dark hover:bg-gold-light">
          <Plus className="h-4 w-4 mr-1" /> Ajouter une Promotion
        </Button>
      </div>
      <div className="space-y-3">
        {promotions.map((p: Promotion) => (
          <div key={p.id} className="bg-forest-light/20 rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-xl text-gold">{p.code}</span>
                <Badge className={p.active ? 'bg-green-500/20 text-green-400' : 'bg-cream/10 text-cream/40'}>
                  {p.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-cream/50 text-sm">{p.description}</p>
              <p className="text-cream/40 text-xs">{p.discount_type === 'percent' ? `${p.discount_value}% de réduction` : `${p.discount_value}€ de réduction`}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Switch checked={p.active} onCheckedChange={() => toggle(p)} />
              <Button size="sm" variant="outline" className="border-forest-light/30 text-cream hover:bg-forest-light/30" onClick={() => setEditing({ ...p, _table: 'promotions' })}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => del(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersManager({ orders, reload }: any) {
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast.error('Échec de la mise à jour'); else { toast.success('Commande mise à jour'); reload(); }
  };
  return (
    <div className="space-y-3">
      {orders.map((o: any) => (
        <div key={o.id} className="bg-forest-light/20 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-display text-lg text-cream">{o.customer_name}</h3>
              <p className="text-cream/50 text-sm">{o.customer_phone} · {o.type === 'delivery' ? 'Livraison' : 'À emporter'}</p>
              {o.address && <p className="text-cream/40 text-sm">{o.address}</p>}
            </div>
            <div className="text-right">
              <p className="font-display text-xl text-gold">{o.total.toFixed(2).replace('.', ',')}€</p>
              <Badge className={o.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                {o.status === 'pending' ? 'En attente' : 'Confirmée'}
              </Badge>
            </div>
          </div>
          <div className="text-cream/40 text-sm space-y-0.5 mb-3">
            {o.items?.map((item: any, j: number) => (
              <p key={j}>{item.qty}× {item.name} — {(item.price * item.qty).toFixed(2).replace('.', ',')}€</p>
            ))}
          </div>
          {o.status === 'pending' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(o.id, 'confirmed')}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Marquer comme Confirmée
            </Button>
          )}
        </div>
      ))}
      {orders.length === 0 && <p className="text-cream/40 text-center py-12">Aucune commande pour le moment.</p>}
    </div>
  );
}

function EditModal({ item, onClose, onSave }: { item: any; onClose: () => void; onSave: (data: any) => void }) {
  const [data, setData] = useState(item);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    onSave(data);
    setTimeout(() => setSaving(false), 500);
  };

  const fields = getFields(data._table);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-dark/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-forest text-cream rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-forest flex items-center justify-between p-5 border-b border-forest-light/30 z-10">
          <h2 className="font-display text-2xl">{data.id ? 'Modifier' : 'Ajouter'}</h2>
          <button onClick={onClose} className="text-cream/60 hover:text-gold"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-5 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <Label className="text-cream/70 mb-1.5 block">{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={data[field.key] || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  className="bg-forest-light/20 border-forest-light/30 text-cream"
                  rows={3}
                />
              ) : field.type === 'select' ? (
                <select
                  value={data[field.key] || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  className="w-full rounded-lg bg-forest-light/20 border border-forest-light/30 text-cream px-3 py-2"
                >
                  {field.options?.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'switch' ? (
                <Switch checked={!!data[field.key]} onCheckedChange={(v) => setData({ ...data, [field.key]: v })} />
              ) : (
                <Input
                  type={field.type || 'text'}
                  value={data[field.key] ?? ''}
                  onChange={(e) => setData({ ...data, [field.key]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
                  className="bg-forest-light/20 border-forest-light/30 text-cream"
                />
              )}
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-forest p-5 border-t border-forest-light/30 flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 border-forest-light/30 text-cream hover:bg-forest-light/30">
            Annuler
          </Button>
          <Button onClick={save} disabled={saving} className="flex-1 bg-gold text-forest-dark hover:bg-gold-light font-semibold">
            <Save className="h-4 w-4 mr-1.5" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function getFields(table: string): any[] {
  switch (table) {
    case 'menu_items':
      return [
        { key: 'name', label: 'Nom', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'price', label: 'Prix (€)', type: 'number' },
        { key: 'category', label: 'Catégorie', type: 'select', options: [
          { value: 'pho', label: 'Phở & Bánh Mì' },
          { value: 'rice', label: 'Riz' },
          { value: 'noodles', label: 'Nouilles' },
          { value: 'vegetarian', label: 'Végétarien' },
          { value: 'desserts', label: 'Desserts' },
          { value: 'drinks', label: 'Boissons' },
        ] },
        { key: 'image_url', label: 'URL de l\'image', type: 'text' },
        { key: 'calories', label: 'Calories', type: 'number' },
        { key: 'spice_level', label: 'Niveau d\'épice (0-3)', type: 'number' },
        { key: 'is_popular', label: 'Populaire', type: 'switch' },
        { key: 'is_chef_choice', label: 'Choix du Chef', type: 'switch' },
        { key: 'is_available', label: 'Disponible', type: 'switch' },
        { key: 'sort_order', label: 'Ordre d\'affichage', type: 'number' },
      ];
    case 'events':
      return [
        { key: 'title', label: 'Titre', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image_url', label: 'URL de l\'image', type: 'text' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'time', label: 'Heure', type: 'text' },
        { key: 'location', label: 'Lieu', type: 'text' },
        { key: 'price', label: 'Prix par personne (€)', type: 'number' },
        { key: 'capacity', label: 'Capacité', type: 'number' },
      ];
    case 'gallery_images':
      return [
        { key: 'title', label: 'Titre', type: 'text' },
        { key: 'image_url', label: 'URL de l\'image', type: 'text' },
        { key: 'category', label: 'Catégorie', type: 'select', options: [
          { value: 'food', label: 'Plats' },
          { value: 'restaurant', label: 'Restaurant' },
          { value: 'kitchen', label: 'Cuisine' },
          { value: 'staff', label: 'Équipe' },
          { value: 'customers', label: 'Clients' },
        ] },
      ];
    case 'testimonials':
      return [
        { key: 'name', label: 'Nom', type: 'text' },
        { key: 'rating', label: 'Note (1-5)', type: 'number' },
        { key: 'comment', label: 'Commentaire', type: 'textarea' },
        { key: 'source', label: 'Source', type: 'select', options: [
          { value: 'google', label: 'Google' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'tripadvisor', label: 'TripAdvisor' },
        ] },
        { key: 'avatar_url', label: 'URL Avatar (optionnel)', type: 'text' },
      ];
    case 'promotions':
      return [
        { key: 'code', label: 'Code', type: 'text' },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'discount_type', label: 'Type de réduction', type: 'select', options: [
          { value: 'percent', label: 'Pourcentage' },
          { value: 'fixed', label: 'Montant fixe' },
        ] },
        { key: 'discount_value', label: 'Valeur de la réduction', type: 'number' },
        { key: 'active', label: 'Active', type: 'switch' },
      ];
    default:
      return [];
  }
}
