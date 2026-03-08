import { Skeleton } from '@/components/ui/skeleton';

interface ImageSkeletonProps {
  count?: number;
  heightClass?: string;
}

export const ImageSkeleton = ({ count = 6, heightClass = 'h-48' }: ImageSkeletonProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 space-y-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
        <Skeleton className={`w-full ${heightClass} rounded-lg`} />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    ))}
  </div>
);
