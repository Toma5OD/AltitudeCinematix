import React, { useState } from "react";
import "./VideoVisualizerSmall2.css";
import { IonSpinner, IonRouterLink } from "@ionic/react";

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

const VideoVisualizerSmall2: React.FC<VideoVisualizerSmall2Props> = ({ video, children }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="video-visualizer-small2">
      <video
        src={video.url}
        poster={video.thumbnail}
        className="video-thumbnail-small2"
        controls
        onLoadedData={() => setLoading(false)}
      />
      {loading && (
        <div className="spinner-container">
          <IonSpinner />
        </div>
      )}
      <div className="video-info-small2">
        <IonRouterLink routerLink={`/single-video/${video.id}`} className="video-title-small">
          {video.title}
        </IonRouterLink>
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

export default VideoVisualizerSmall2;
