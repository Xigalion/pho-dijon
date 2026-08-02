'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const amounts = [25, 50, 75, 100, 150, 200];

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [purchaser, setPurchaser] = useState('');
  const [recipient, setRecipient] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const purchase = async () => {
    if (!purchaser || !recipient || !email) return toast.error('Veuillez remplir tous les champs.');
    if (finalAmount < 10) return toast.error('Le montant minimum est de 10€.');
    setLoading(true);
    const code = `PHO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const { error } = await supabase.from('gift_cards').insert({
      purchaser_name: purchaser,
      recipient_name: recipient,
      recipient_email: email,
      amount: finalAmount,
      message,
      code,
    });
    setLoading(false);
    if (error) toast.error('Achat impossible. Veuillez réessayer.');
    else { setDone(true); toast.success('Carte cadeau achetée !'); }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg text-center">
          <div className="h-20 w-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-6">
            <Gift className="h-10 w-10 text-forest-dark" />
          </div>
          <h1 className="font-display text-4xl text-forest mb-4">Carte Cadeau Envoyée !</h1>
          <p className="text-forest/60 mb-2">Une carte cadeau de {finalAmount.toFixed(0)}€ pour {recipient} est en route vers {email}.</p>
          <p className="text-forest/60 mb-8">Code de la carte : <strong className="text-gold-dark">PHO-XXXXXX</strong></p>
          <Button onClick={() => { setDone(false); setPurchaser(''); setRecipient(''); setEmail(''); setMessage(''); setCustomAmount(''); }} className="bg-forest text-cream hover:bg-forest-light">
            Acheter une Autre Carte
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img src="https://images.pexels.com/photos/31990173/pexels-photo-31990173.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080" alt="Cadeau" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3">
            Partagez les Saveurs
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-5xl md:text-6xl font-medium text-cream text-shadow-lg">
            Cartes Cadeaux
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <Sparkles className="h-10 w-10 text-gold mx-auto mb-3" />
              <h2 className="font-display text-3xl text-forest mb-2">Offrez le Vietnam</h2>
              <p className="text-forest/60">Parfait pour toute occasion. Livrées instantanément par email.</p>
            </div>

            <div className="mb-6">
              <Label className="text-forest mb-3 block">Choisir le Montant</Label>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAmount(a); setCustomAmount(''); }}
                    className={cn(
                      'py-3 rounded-xl font-sans font-semibold transition-all border-2',
                      amount === a && !customAmount ? 'border-gold bg-gold/10 text-forest' : 'border-forest/10 text-forest/60 hover:border-forest/30'
                    )}
                  >
                    {a}€
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <Input
                  type="number"
                  placeholder="Montant personnalisé"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="rounded-lg max-w-xs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-forest mb-1.5 block">Votre Nom</Label>
                <Input value={purchaser} onChange={(e) => setPurchaser(e.target.value)} className="rounded-lg" placeholder="Votre nom" />
              </div>
              <div>
                <Label className="text-forest mb-1.5 block">Nom du Destinataire</Label>
                <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="rounded-lg" placeholder="Nom du destinataire" />
              </div>
              <div>
                <Label className="text-forest mb-1.5 block">Email du Destinataire</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg" placeholder="destinataire@email.com" />
              </div>
              <div>
                <Label className="text-forest mb-1.5 block">Message Personnalisé</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-lg" placeholder="Ajoutez un mot personnel..." rows={3} />
              </div>
            </div>

            <div className="mt-6 p-4 bg-cream rounded-xl flex items-center justify-between">
              <span className="text-forest/60 font-sans">Valeur de la Carte</span>
              <span className="font-display text-3xl text-forest">{finalAmount.toFixed(0)}€</span>
            </div>

            <Button onClick={purchase} disabled={loading} size="lg" className="w-full mt-6 bg-gold text-forest-dark hover:bg-gold-light font-semibold h-14">
              {loading ? 'Traitement...' : `Acheter · ${finalAmount.toFixed(0)}€`}
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 forest-gradient text-cream">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Gift, title: 'Livraison Instantanée', desc: 'Envoyée par email immédiatement après l\'achat.' },
              { icon: CheckCircle2, title: 'Sans Expiration', desc: 'Nos cartes cadeaux n\'expirent jamais.' },
              { icon: Sparkles, title: 'Tout le Menu', desc: 'Valable sur place, à emporter et en ligne.' },
            ].map((f) => (
              <div key={f.title}>
                <f.icon className="h-10 w-10 text-gold mx-auto mb-3" />
                <h3 className="font-display text-xl mb-2">{f.title}</h3>
                <p className="text-cream/60 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
