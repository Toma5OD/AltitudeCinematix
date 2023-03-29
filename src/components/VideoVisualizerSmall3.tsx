import React from "react";
import "./VideoVisualizerSmall2.css";
import { IonRouterLink } from "@ionic/react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  userId: string;
  userData?: {
    firstName: string;
    lastName: string;
  };
};

interface VideoVisualizerSmall2Props {
  video: Video;
  children?: React.ReactNode;
}

const VideoVisualizerSmall3: React.FC<VideoVisualizerSmall2Props> = ({ video, children }) => {
  return (
    <div className="video-visualizer-small2">
      <video
        src={video.url}
        poster={video.thumbnail}
        className="video-thumbnail-small2"
        controls
      />
      <div className="video-info-small2">
        <IonRouterLink routerLink={`/single-video/${video.id}`} className="video-title-small">
          {video.title}
        </IonRouterLink>
        <div className="video-checkbox-container">
        {children}
      </div>
        {video.userData ? (
          <IonRouterLink routerLink={`/other-user-profile/${video.userId}`} className="video-author-small">
            {video.userData.firstName} {video.userData.lastName}
          </IonRouterLink>
        ) : (
          <span className="video-author-small2"></span>
        )}
      </div>
    </div>
  );
};

export default VideoVisualizerSmall3;
