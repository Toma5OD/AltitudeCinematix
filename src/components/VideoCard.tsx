import React, { useState, useEffect } from "react";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Swiper, SwiperSlide } from "swiper/react";
import "./VideoCard.css";
import { getLatestVideos, readUserData } from "../firebaseConfig";
import { IonRouterLink } from '@ionic/react';

SwiperCore.use([Navigation, Autoplay]);

interface VideoCardProps {
  refreshKey: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ refreshKey }) => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const latestVideos = await getLatestVideos(10); // Fetch the latest 10 videos
      const videosWithUserData = await Promise.all(
        latestVideos.map(async (video) => {
          const userData = await readUserData(video.userId);
          return { ...video, userData };
        })
      );
      setVideos(videosWithUserData);
    })();
  }, [refreshKey]);

  return (
    <div className="video-card-feed">
      <Swiper
        slidesPerView={1}
        loop={true}
        loopedSlides={videos.length}
        navigation={true}
        mousewheel={true}
        direction={"horizontal"}
      >
        {videos.map((video) => (
          <SwiperSlide key={video.url}>
            <div className="swiper1">
              <video
                src={video.url}
                loop
                autoPlay
                muted
                playsInline
                controls
                className="video-player"

              />
              <div className="video-info">
                <IonRouterLink routerLink={`/single-video/${video.id}`} className="video-title">
                  {video.title}
                </IonRouterLink>
                <IonRouterLink routerLink={`/other-user-profile/${video.userId}`} className="video-author">
                  {video.userData.firstName} {video.userData.lastName}
                </IonRouterLink>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCard;