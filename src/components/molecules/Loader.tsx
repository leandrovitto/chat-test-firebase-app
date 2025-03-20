import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10 bg-green-50">
      <div className="ml-2 text-xs font-bold mb-2">Loading...</div>
      <Loader2 className=" animate-spin" size="32" />
    </div>
  );
};
