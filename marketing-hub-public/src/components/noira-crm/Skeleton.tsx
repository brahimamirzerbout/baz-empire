type SkeletonProps = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedMap = {
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-full",
};

const Skeleton = ({ className = "", rounded = "md" }: SkeletonProps) => {
  return <div className={`skeleton ${roundedMap[rounded]} ${className}`} />;
};

export const PostCardSkeleton = () => (
  <div className="post-card">
    <div className="flex items-center gap-3">
      <Skeleton rounded="full" className="h-12 w-12" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
    <Skeleton className="h-72 w-full" rounded="lg" />
    <div className="flex gap-2">
      <Skeleton rounded="full" className="h-6 w-16" />
      <Skeleton rounded="full" className="h-6 w-16" />
    </div>
  </div>
);

export const PostGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid-container">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-80 w-full" rounded="lg" />
    ))}
  </div>
);

export const UserCardSkeleton = () => (
  <div className="user-card">
    <Skeleton rounded="full" className="h-14 w-14" />
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export const ProfileHeaderSkeleton = () => (
  <div className="flex flex-col items-center w-full gap-4">
    <Skeleton rounded="full" className="h-32 w-32" />
    <Skeleton className="h-5 w-40" />
    <Skeleton className="h-3 w-24" />
    <div className="flex gap-6 mt-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
