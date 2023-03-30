import React, { useState, useEffect } from "react";
import SwiperCore, { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "./VideoCard.css";
import { getLatestVideos, readUserData, getUserRatingForVideo, rateVideo } from "../firebaseConfig";
import { IonRouterLink, IonSpinner } from '@ionic/react';
import { useSelector } from "react-redux";
import { IonIcon } from '@ionic/react';
import { star } from 'ionicons/icons';

SwiperCore.use([Navigation, Autoplay]);

interface VideoCardProps {
  userId: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ userId }) => {
  const user = useSelector((state: any) => state.user);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (user) {
        const latestVideos = await getLatestVideos(50, user.id);
        const videosWithUserDataAndRating = await Promise.all(
          latestVideos.map(async (video) => {
            const userData = await readUserData(video.userId);
            const userRating = await getUserRatingForVideo(userId, video.id);
            return { ...video, userData, userRating };
          })
        );
        console.log('Videos with user data and rating:', videosWithUserDataAndRating);
        setVideos(videosWithUserDataAndRating);
      }
    })();
  }, [user, userId]);

  const handleRateVideo = async (videoId: string, rating: number) => {
    console.log("User ID in handleRateVideo function:", userId);
    if (videoId && user) {
      try {
        await rateVideo(userId, videoId, rating);
        console.log('Rating submitted successfully');
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === videoId ? { ...video, userRating: rating } : video
          )
        );
      } catch (error) {
        console.log('Failed to submit rating:', error);
      }
    }
  };

  const renderStars = (videoId: string, userRating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <IonIcon
        key={index}
        icon={star}
        className={`star ${index < userRating ? 'active' : ''}`}
        onClick={() => handleRateVideo(videoId, index + 1)}
      />
    ));
  };

  return (
    <div className="video-card-feed">
      {videos.length > 0 ? (
        <Swiper
          slidesPerView={1}
          loop={true}
          loopedSlides={videos.length}
          navigation={true}
          mousewheel={true}
          direction={"horizontal"}
        >
          {videos.map((video) => {
            console.log('Video object:', video);
            return (
              <SwiperSlide key={video.id}>
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
                    <div className="video-rating">
                      {renderStars(
                        video.id,
                        video.userRating !== undefined
                          ? video.userRating
                          : video.ratings && video.ratings[user.id]
                            ? video.ratings[user.id]
                            : 0
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="spinner-container">
          <IonSpinner name="crescent" />
        </div>
      )}
    </div>
  );  
};

export default VideoCard;

