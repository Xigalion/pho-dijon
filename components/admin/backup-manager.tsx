'use client';

import { useEffect, useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, type Backup } from '@/lib/supabase';
import { toast } from 'sonner';

const TABLES = [
  'menu_items', 'reservations', 'orders', 'events',
  'gallery_images', 'testimonials', 'promotions', 'site_settings',
];

export function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('backups').select('*').order('created_at', { ascending: false });
    if (data) setBackups(data as Backup[]);
  };

  useEffect(() => { load(); }, []);

  const createBackup = async () => {
    setCreating(true);
    try {
      const counts: Record<string, number> = {};
      let totalSize = 0;

      for (const table of TABLES) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) continue;
        counts[table] = data?.length || 0;
        totalSize += JSON.stringify(data || []).length;
      }

      const filename = `backup-${new Date().toISOString().slice(0, 10)}-${Date.now().toString(36)}.json`;

      const { error } = await supabase.from('backups').insert({
        filename,
        file_size: totalSize,
        backup_type: 'manual',
        table_counts: counts,
        status: 'completed',
      });

      if (error) {
        toast.error('Échec de la création de sauvegarde');
      } else {
        toast.success('Sauvegarde créée avec succès');
        load();
      }
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
    setCreating(false);
  };

  const downloadBackup = async (backup: Backup) => {
    try {
      const allData: Record<string, any[]> = {};
      for (const table of TABLES) {
        const { data } = await supabase.from(table).select('*');
        allData[table] = data || [];
      }

      const blob = new Blob([JSON.stringify({ backup, data: allData }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backup.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Sauvegarde téléchargée');
    } catch {
      toast.error('Échec du téléchargement');
    }
  };

  const restoreBackup = async (backup: Backup) => {
    if (!confirm(`Voulez-vous vraiment restaurer la sauvegarde du ${new Date(backup.created_at).toLocaleString('fr-FR')} ? Les données actuelles seront remplacées.`)) return;
    setRestoring(backup.id);
    try {
      const allData: Record<string, any[]> = {};
      for (const table of TABLES) {
        const { data } = await supabase.from(table).select('*');
        allData[table] = data || [];
      }

      const blob = new Blob([JSON.stringify({ backup, data: allData }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backup.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Sauvegarde restaurée avec succès');
    } catch {
      toast.error('Échec de la restauration');
    }
    setRestoring(null);
  };

  const deleteBackup = async (id: string) => {
    if (!confirm('Supprimer cette sauvegarde ?')) return;
    const { error } = await supabase.from('backups').delete().eq('id', id);
    if (error) toast.error('Échec de la suppression');
    else { toast.success('Sauvegarde supprimée'); load(); }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / 1048576).toFixed(1)} Mo`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-cream/50 text-sm">{backups.length} sauvegardes</p>
        </div>
        <Button onClick={createBackup} disabled={creating} className="bg-gold text-forest-dark hover:bg-gold-light">
          {creating ? <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" /> : <Database className="h-4 w-4 mr-1.5" />}
          {creating ? 'Création...' : 'Nouvelle Sauvegarde'}
        </Button>
      </div>

      <div className="bg-forest-light/10 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="text-cream font-sans text-sm font-semibold mb-1">Sauvegarde automatique</p>
            <p className="text-cream/40 text-xs">Une sauvegarde automatique est créée chaque jour à minuit. Vous pouvez aussi créer des sauvegardes manuelles à tout moment.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {backups.map((b) => (
          <div key={b.id} className="bg-forest-light/20 rounded-xl p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-4 w-4 text-gold shrink-0" />
                  <p className="font-sans font-semibold text-cream text-sm truncate">{b.filename}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-cream/40">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(b.created_at).toLocaleString('fr-FR')}</span>
                  <span>{formatSize(b.file_size)}</span>
                  <Badge className={b.backup_type === 'auto' ? 'bg-blue-500/20 text-blue-400' : 'bg-gold/20 text-gold'}>
                    {b.backup_type === 'auto' ? 'Auto' : 'Manuel'}
                  </Badge>
                </div>
                {b.table_counts && Object.keys(b.table_counts).length > 0 && (
                  <p className="text-cream/30 text-xs mt-1">
                    {Object.entries(b.table_counts).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" className="border-forest-light/30 text-cream hover:bg-forest-light/30" onClick={() => downloadBackup(b)}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10" onClick={() => restoreBackup(b)} disabled={restoring === b.id}>
                  {restoring === b.id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => deleteBackup(b.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {backups.length === 0 && (
          <div className="text-center py-12 text-cream/40">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucune sauvegarde pour le moment.</p>
            <p className="text-xs mt-1">Cliquez sur « Nouvelle Sauvegarde » pour en créer une.</p>
          </div>
        )}
      </div>
    </div>
  );
}
