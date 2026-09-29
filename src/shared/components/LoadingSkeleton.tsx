import { colors } from "@/src/shared/theme/colors";

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  className?: string;
}

/** Pulsing gray block for content with a known layout. Decorative. */
export function LoadingSkeleton({ width, height, borderRadius = 8, className }: SkeletonProps) {
  return (
    <div
      className={["animate-pulse motion-reduce:animate-none", className ?? ""].filter(Boolean).join(" ")}
      style={{ width, height, borderRadius, backgroundColor: colors.border }}
      aria-hidden="true"
    />
  );
}

/** Pre-built skeleton for the dashboard screen layout. */
export function DashboardSkeleton() {
  return (
    <div className="flex-1 bg-brand-background px-4 pt-6">
      <LoadingSkeleton width={220} height={28} className="mb-2" />
      <LoadingSkeleton width={160} height={16} className="mb-6" />

      <LoadingSkeleton width="100%" height={100} borderRadius={12} className="mb-3" />
      <LoadingSkeleton width="100%" height={100} borderRadius={12} className="mb-6" />

      <div className="flex-row gap-3 mb-6">
        <LoadingSkeleton width="48%" height={90} borderRadius={12} />
        <LoadingSkeleton width="48%" height={90} borderRadius={12} />
      </div>
      <div className="flex-row gap-3 mb-6">
        <LoadingSkeleton width="48%" height={90} borderRadius={12} />
        <LoadingSkeleton width="48%" height={90} borderRadius={12} />
      </div>

      <LoadingSkeleton width="100%" height={200} borderRadius={12} />
    </div>
  );
}
