import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SpiceLevel({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <div className="flex items-center gap-0.5" title={`Spice level: ${level}/3`}>
      {[1, 2, 3].map((i) => (
        <Flame
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i <= level ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );
}
