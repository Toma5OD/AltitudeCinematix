import React, { useState, useEffect } from "react";
import { IonSlides, IonSlide, IonInfiniteScroll } from "@ionic/react";
import "./VideoCard.css";

interface Props {
  toolbarHeight: number;
}

const VideoCard: React.FC<Props> = ({ toolbarHeight }) => {
  const [videos] = useState<string[]>([
    "https://www.youtube.com/embed/RNKWoqDlbxc",
    "https://www.youtube.com/embed/NSHUiZp2aaY",
    "https://www.youtube.com/embed/lM02vNMRRB0",
    "https://www.youtube.com/embed/hWagaTjEa3Y",
    "https://www.youtube.com/embed/b7Cl7S0pLRw", // 8 HOUR DRONE FILM: "Islands From Above" 4K + Music by Nature Relaxation™ (Ambient AppleTV Style)
    "https://www.youtube.com/embed/nXIc2-8-_y0", // Desert 4K Drone Nature Videos | Film UHD
    "https://www.youtube.com/embed/3ldqFSVOxIU", // Top 10 Places To Visit In Switzerland
    "https://www.youtube.com/embed/XRIndzl5T3U", // Flying over Enchanted Forest 4K - Aerial Drone Film w/ Celtic Music
  ]);

  const [iframeHeight, setIframeHeight] = useState<number>(0);

  useEffect(() => {
    setIframeHeight(window.innerHeight - toolbarHeight);
  }, [toolbarHeight]);

  return (
    <div className="video-feed">
      <IonInfiniteScroll>
        <IonSlides scrollbar={true} options={{ slidesPerView: "auto" }}>
          {videos.map((videoUrl) => (
            <IonSlide className="video-slide" key={videoUrl}>
              <iframe
                src={videoUrl}
                title="YouTube video player"
                allowFullScreen
                style={{ height: iframeHeight }}
              ></iframe>
            </IonSlide>
          ))}
        </IonSlides>
      </IonInfiniteScroll>
    </div>
  );
};

export default VideoCard;
