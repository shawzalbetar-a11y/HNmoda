"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  videoUrl: string;
  productName: string;
}

export function VideoPlayerModal({
  isOpen,
  onOpenChange,
  videoUrl,
  productName,
}: VideoPlayerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-4">
          <DialogTitle>{productName}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={videoUrl.replace('watch?v=', 'embed/')}
            title="Product Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
