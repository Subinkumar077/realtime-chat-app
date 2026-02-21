import { getDateSeparator } from "@/lib/utils";

interface DateSeparatorProps {
  timestamp: number;
}

export function DateSeparator({ timestamp }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
        {getDateSeparator(timestamp)}
      </div>
    </div>
  );
}
