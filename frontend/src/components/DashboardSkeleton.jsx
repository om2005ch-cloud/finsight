import Skeleton from './Skeleton';
import AnimatedBackground from './AnimatedBackground';

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative">
      <AnimatedBackground />

      {/* Top Navbar Skeleton */}
      <nav className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-24 h-5 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-28 h-9 rounded-lg hidden sm:block" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </nav>

      {/* Main Dashboard Skeleton Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* KPI Row (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="w-24 h-3.5" />
                <Skeleton className="w-7 h-7 rounded-lg" />
              </div>
              <Skeleton className="w-32 h-7" />
              <Skeleton className="w-20 h-3" />
            </div>
          ))}
        </div>

        {/* Add Transaction Input Shell */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <Skeleton className="w-36 h-4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>

        {/* Forecast + AI Insight Row (2 cards) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-40 h-4" />
            </div>
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-48 h-3" />
            <Skeleton className="w-24 h-5 rounded-md mt-2" />
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-36 h-4" />
            </div>
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-5/6 h-3" />
            <Skeleton className="w-4/6 h-3" />
          </div>
        </div>

        {/* Spending Chart Skeleton */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="w-40 h-5" />
            <Skeleton className="w-24 h-4" />
          </div>
          <Skeleton className="w-full h-56 rounded-lg" />
        </div>

        {/* Recent Transactions List Skeleton */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="w-44 h-5" />
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-none">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
