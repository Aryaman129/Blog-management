
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FilterOption } from '@/types';

interface FilterTabsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  counts: Record<string, number>;
}

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const filters: { key: FilterOption; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'blog', label: 'Blog Posts' },
    { key: 'project', label: 'Projects' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map(({ key, label }) => (
        <Button
          key={key}
          variant={activeFilter === key ? "default" : "ghost"}
          onClick={() => onFilterChange(key)}
          className={cn(
            "relative transition-all duration-200",
            activeFilter === key
              ? "gradient-primary text-white shadow-lg shadow-primary/25"
              : "hover:bg-surface-elevated hover:text-primary"
          )}
        >
          {label}
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-2 text-xs",
              activeFilter === key 
                ? "bg-white/20 text-white border-white/30" 
                : "bg-surface-elevated"
            )}
          >
            {counts[key] || 0}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
