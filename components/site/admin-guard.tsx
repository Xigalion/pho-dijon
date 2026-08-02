'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/admin/login');
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-forest-dark">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-cream mb-1">Espace Gestion</h1>
            <p className="text-cream/50 text-sm">Connecté en tant que {session.user.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-forest-light/30 text-cream/70 hover:bg-forest-light/30"
          >
            <LogOut className="h-4 w-4 mr-2" /> Déconnexion
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
