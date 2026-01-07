// components/Skeleton.tsx
export const PageSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex justify-between items-center">
      <div className="h-10 bg-gray-200 rounded-2xl w-48"></div>
      <div className="h-10 bg-gray-200 rounded-2xl w-32"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-[2rem]"></div>
      ))}
    </div>
    <div className="h-96 bg-gray-100 rounded-[2.5rem]"></div>
  </div>
);