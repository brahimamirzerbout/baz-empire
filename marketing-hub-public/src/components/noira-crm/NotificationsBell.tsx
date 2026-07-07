import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications, Notification } from "@/context/NotificationsContext";
import { formatDate } from "@/lib/utils";
import { Bell, Check, Close, Trash } from "./svgs";

const NotificationsBell = () => {
  const { notifications, unreadCount, markAllRead, markRead, remove, clear } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleClick = (n: Notification) => {
    markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 hover:bg-surface-muted transition focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5 text-light-2" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-scale-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-surface-card border border-surface-border rounded-xl shadow-2xl z-50 animate-slide-up overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
            <h3 className="small-bold text-light-1">Notifications</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary-500 hover:underline px-2 py-1"
                  aria-label="Mark all as read"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-surface-muted"
                aria-label="Close"
              >
                <Close className="h-4 w-4 text-light-3" />
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell className="h-8 w-8 text-light-3 mb-2" />
                <p className="text-light-2 small-semibold">You're all caught up</p>
                <p className="text-light-3 small-regular mt-1">
                  New notifications will appear here.
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`group border-b border-surface-border last:border-0 ${
                      !n.read ? "bg-primary-500/5" : ""
                    }`}
                  >
                    <button
                      onClick={() => handleClick(n)}
                      className="w-full flex items-start gap-3 p-3 hover:bg-surface-muted transition text-left"
                    >
                      {n.avatar ? (
                        <img
                          src={n.avatar}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-500/20 flex-center flex-shrink-0">
                          <Bell className="h-4 w-4 text-primary-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-light-1 small-semibold">{n.title}</p>
                        {n.body && (
                          <p className="text-light-3 small-regular line-clamp-2 mt-0.5">{n.body}</p>
                        )}
                        <p className="text-light-4 tiny-medium mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                      {!n.read && (
                        <span
                          className="h-2 w-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"
                          aria-label="Unread"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => remove(n.id)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-red-500/10"
                      aria-label="Delete notification"
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-surface-border px-4 py-2">
              <button
                onClick={clear}
                className="text-xs text-light-3 hover:text-red-500 transition w-full text-center"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
