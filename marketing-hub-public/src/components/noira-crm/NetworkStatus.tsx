import { useEffect, useState } from "react";
import { useToast } from "./Toaster";
import { WifiOff } from "./svgs";

/**
 * Listens to online/offline events and shows a toast when the
 * connection changes. Returns the current online state.
 */
const NetworkStatus = () => {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const { showToast: toast } = useToast();

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      toast("Back online", "success");
    };
    const onOffline = () => {
      setOnline(false);
      toast("You are offline — changes may not save", "error");
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [toast]);

  // tiny inline indicator (no toast spam)
  if (online) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1100] flex items-center gap-2 rounded-full bg-red-500 text-white px-4 py-2 shadow-2xl animate-slide-up"
    >
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Offline</span>
    </div>
  );
};

/** Hook variant — returns current online status */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

export default NetworkStatus;
