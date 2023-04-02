import React from "react";
import { IonRouterLink, IonIcon, IonAvatar } from "@ionic/react";
import { star } from "ionicons/icons";
import "./VideoInfo.css";

interface VideoInfoProps {
  video: any;
  userId: string;
  handleRateVideo: (videoId: string, rating: number) => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video, userId, handleRateVideo }) => {
  const renderStars = (videoId: string, userRating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <IonIcon
        key={index}
        icon={star}
        className={`star ${index < userRating ? "active" : ""}`}
        onClick={() => handleRateVideo(videoId, index + 1)}
      />
    ));
  };

  return (
    <div className="video-info-container">
      <div className="video-info">
        <div className="video-title-row">
          <IonRouterLink routerLink={`/single-video/${video.id}`} className="video-title">
            {video.title}
          </IonRouterLink>
        </div>
        {video.userData ? (
          <div className="video-author-container">
            <IonAvatar className="author-avatar">
              <img className="user-profile" src={video.userData.photoURL} alt="Profile" />
            </IonAvatar>
            <IonRouterLink routerLink={`/other-user-profile/${video.userId}`} className="video-author">
              {video.userData.firstName} {video.userData.lastName}
            </IonRouterLink>
            <div className="video-rating">
              {renderStars(
                video.id,
                video.userRating !== undefined
                  ? video.userRating
                  : video.ratings && video.ratings[userId]
                  ? video.ratings[userId]
                  : 0
              )}
            </div>
          </div>
        ) : (
          <span className="video-author"></span>
        )}
      </div>
    </div>
  );
};

export default VideoInfo;
