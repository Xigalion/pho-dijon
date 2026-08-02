'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}: Props) {
  return (
    <div
      className={cn(
        'max-w-2xl mb-12',
        align === 'center' ? 'mx-auto text-center' : 'text-left'
      )}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            'font-sans text-xs uppercase tracking-[0.3em] mb-3',
            light ? 'text-gold' : 'text-gold-dark'
          )}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn(
          'font-display text-4xl md:text-5xl font-medium leading-tight',
          light ? 'text-cream' : 'text-forest'
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            'mt-4 text-base md:text-lg leading-relaxed',
            light ? 'text-cream/70' : 'text-forest/60'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
