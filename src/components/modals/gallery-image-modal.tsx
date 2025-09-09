
"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import Image from "next/image";
import { GalleryImage } from "@/lib/types";

interface GalleryImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryImage | null;
}

export function GalleryImageModal({ isOpen, onClose, image }: GalleryImageModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-2 sm:p-4 bg-transparent border-none shadow-none">
        <div className="relative">
          <Image 
            src={image.url} 
            alt={image.alt} 
            width={1200}
            height={800}
            className="rounded-lg object-contain w-full h-auto max-h-[85vh] shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
