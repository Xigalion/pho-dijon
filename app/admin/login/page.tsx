'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError('Veuillez remplir tous les champs.');
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError('Email ou mot de passe incorrect.');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-forest-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-forest-dark" />
          </div>
          <h1 className="font-display text-3xl text-cream mb-1">Espace Gestion</h1>
          <p className="text-cream/50 text-sm">Connectez-vous pour gérer votre restaurant</p>
        </div>

        <form onSubmit={submit} className="bg-forest-light/20 rounded-2xl p-8 space-y-5">
          <div>
            <Label className="text-cream/70 mb-1.5 block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phodijon.fr"
                className="pl-10 bg-forest-light/20 border-forest-light/30 text-cream placeholder:text-cream/30"
              />
            </div>
          </div>

          <div>
            <Label className="text-cream/70 mb-1.5 block">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-forest-light/20 border-forest-light/30 text-cream placeholder:text-cream/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/70"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full bg-gold text-forest-dark hover:bg-gold-light font-semibold h-14"
          >
            {loading ? 'Connexion...' : 'Se Connecter'}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <p className="text-center text-cream/30 text-xs mt-6">
          Accès réservé au personnel autorisé. Contactez votre administrateur pour obtenir un compte.
        </p>
      </motion.div>
    </div>
  );
}
