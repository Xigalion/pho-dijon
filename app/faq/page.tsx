'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/site/section-heading';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Faut-il réserver ?',
    a: 'Les réservations sont recommandées pour le service du dîner, surtout le week-end. Pour le déjeuner, les clients sans réservation sont les bienvenus. Vous pouvez réserver via notre site web ou par téléphone.',
  },
  {
    q: 'Proposez-vous des options végétariennes et végétaliennes ?',
    a: 'Oui ! Nous avons une section végétarienne dédiée sur notre carte, incluant un pho végétarien au tofu, des rouleaux de printemps frais et une salade de papaye. De nombreux plats peuvent être adaptés en version végétalienne sur demande — informez simplement notre équipe.',
  },
  {
    q: 'Votre bouillon de pho est-il sans gluten ?',
    a: 'Notre bouillon de bœuf traditionnel est naturellement sans gluten, préparé à partir d\'os de bœuf, d\'épices et de nouilles de riz. Cependant, certaines sauces que nous utilisons contiennent du gluten. Veuillez informer notre équipe de toute allergie et nous vous guiderons vers les options sûres.',
  },
  {
    q: 'Proposez-vous la livraison et à emporter ?',
    a: 'Oui ! Vous pouvez commander en ligne via notre site web pour un retrait sur place ou une livraison dans Dijon. Les commandes à emporter sont prêtes en 15-20 minutes, et la livraison prend 25-35 minutes.',
  },
  {
    q: 'Puis-je organiser un événement privé chez PHỞ Dijon ?',
    a: 'Absolument. Nous proposons trois formules de privatisation, des réunions intimes de 20 personnes à la privatisation totale jusqu\'à 80 invités. Visitez notre page Privatisation pour plus de détails, ou contactez-nous pour un devis personnalisé.',
  },
  {
    q: 'Vendez-vous des cartes cadeaux ?',
    a: 'Oui, les cartes cadeaux sont disponibles de 10€ à 200€ et peuvent être achetées directement sur notre site web. Elles sont livrées instantanément par email et n\'expirent jamais.',
  },
  {
    q: 'Quels sont vos horaires d\'ouverture ?',
    a: 'Nous sommes ouverts tous les jours de 11h30 à 22h00, y compris les jours fériés. La cuisine prend la dernière commande à 21h30.',
  },
  {
    q: 'Y a-t-il un parking à proximité ?',
    a: 'Il y a un parking public Rue de la Liberté, à 3 minutes à pied du restaurant. Le stationnement en rue est également disponible dans les environs.',
  },
  {
    q: 'Acceptez-vous les grands groupes ?',
    a: 'Oui, nous accueillons des groupes de toutes tailles. Pour les groupes de 8 personnes ou plus, nous recommandons de réserver à l\'avance afin que nous puissions préparer un arrangement confortable pour votre groupe.',
  },
  {
    q: 'Puis-je ajuster le niveau d\'épices de mon plat ?',
    a: 'Bien sûr ! Chaque plat peut être ajusté selon votre niveau d\'épices préféré, de doux à très épicé. Indiquez simplement votre préférence à votre serveur lors de la commande.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative h-[35vh] min-h-[280px] overflow-hidden">
        <img src="https://images.pexels.com/photos/32887427/pexels-photo-32887427.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080" alt="FAQ" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 to-forest-dark/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-xs uppercase tracking-[0.4em] text-gold mb-3">
            Bon à Savoir
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-5xl md:text-6xl font-medium text-cream text-shadow-lg">
            FAQ
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading eyebrow="Questions & Réponses" title="Questions Fréquentes" subtitle="Tout ce que vous devez savoir pour dîner chez PHỞ Dijon." />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-display text-lg text-forest">{faq.q}</span>
                  <ChevronDown
                    className={cn('h-5 w-5 text-gold-dark shrink-0 transition-transform', open === i && 'rotate-180')}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-forest/60 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
