import React, { useState } from "react";
import SwiperCore, { Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import "./VideoCard.css";

SwiperCore.use([Navigation, Autoplay]);

const VideoCard: React.FC = () => {
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

  return (
    <div className="video-card-feed">
      <Swiper
        slidesPerView={1}
        loop={true}
        loopedSlides={videos.length}
        navigation={true}
        mousewheel={true}
        direction={'horizontal'}
      >
        {videos.map((videoUrl) => (
          <SwiperSlide key={videoUrl}>
            <div className="swiper1">
              <iframe
                src={videoUrl}
                title="YouTube video player"
                allowFullScreen
              ></iframe>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCard;
