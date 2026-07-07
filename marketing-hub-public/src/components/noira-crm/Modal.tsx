import { ReactNode, useEffect } from "react";
import { Close } from "./svgs";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

const Modal = ({ isOpen, onClose, title, description, children, size = "md" }: ModalProps) => {
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className={`modal-content ${sizeMap[size]}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 id="modal-title" className="h3-bold text-light-1">
                {title}
              </h3>
            )}
            {description && <p className="text-light-3 small-regular mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-surface-muted transition flex-shrink-0"
            aria-label="Close dialog"
          >
            <Close className="h-5 w-5 text-light-3" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
