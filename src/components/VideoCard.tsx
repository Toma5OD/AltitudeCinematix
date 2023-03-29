import React, { useState, useEffect } from "react";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Swiper, SwiperSlide } from "swiper/react";
import "./VideoCard.css";
import { getLatestVideos, readUserData } from "../firebaseConfig";
import { IonRouterLink } from '@ionic/react';
import { useSelector } from "react-redux";

SwiperCore.use([Navigation, Autoplay]);

interface VideoCardProps { }

const VideoCard: React.FC<VideoCardProps> = () => {
  const user = useSelector((state: any) => state.user);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const latestVideos = await getLatestVideos(50);
      const videosWithUserData = await Promise.all(
        latestVideos.map(async (video) => {
          const userData = await readUserData(video.userId);
          return { ...video, userData };
        })
      );
      setVideos(videosWithUserData);
    })();
  }, [user]);

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
                {video.userData ? (
                  <IonRouterLink routerLink={`/other-user-profile/${video.userId}`} className="video-author">
                    {video.userData.firstName} {video.userData.lastName}
                  </IonRouterLink>
                ) : (
                  <span className="video-author">Unknown User</span>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>
    </div>
  );
};

export default VideoCard;