
export default function Loading() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">
          Fetching products...
        </p>
      </div>
    </div>
  );
}