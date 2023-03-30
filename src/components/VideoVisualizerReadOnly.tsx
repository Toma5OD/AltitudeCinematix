import React from "react";
import "./VideoVisualizer.css";
import { IonRouterLink} from "@ionic/react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  userId: string;
};

interface VideoVisualizerReadOnlyProps {
  video: Video;
}

const VideoVisualizerReadOnly: React.FC<VideoVisualizerReadOnlyProps> = ({ video }) => {
  return (
    <div className="video-visualizer">
      <video
        src={video.url}
        poster={video.thumbnail}
        className="video-thumbnail"
        controls
      />
      <IonRouterLink routerLink={`/single-video/${video.id}`}>
        <h3 className="video-title">{video.title}</h3>
      </IonRouterLink>
    </div>
  );
};

export default VideoVisualizerReadOnly;
