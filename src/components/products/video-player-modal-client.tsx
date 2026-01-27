"use client";

import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayerModal } from './video-player-modal';
import { useLanguage } from '@/hooks/use-language';

interface VideoPlayerModalClientProps {
  videoUrl: string;
  productName: string;
}

export function VideoPlayerModalClient({ videoUrl, productName }: VideoPlayerModalClientProps) {
  const [isVideoOpen, setVideoOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Button variant="outline" className="w-full mt-4" onClick={() => setVideoOpen(true)}>
        <PlayCircle className="mr-2 h-5 w-5" />
        {t('watch_video')}
      </Button>
      <VideoPlayerModal
        isOpen={isVideoOpen}
        onOpenChange={setVideoOpen}
        videoUrl={videoUrl}
        productName={productName}
      />
    </>
  );
}
