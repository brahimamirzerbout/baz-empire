"use client";
import { useEffect, useRef } from "react";

export function useDrag(onDrop: (data: string) => void) {
  return {
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("text/plain");
      if (data) onDrop(data);
    },
  };
}
