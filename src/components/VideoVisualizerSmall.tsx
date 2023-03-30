import React, { useState } from "react";
import "./VideoVisualizerSmall.css";
import { IonSpinner } from "@ionic/react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  userId: string;
};

interface VideoVisualizerReadOnlyProps {
  video: Video;
  children?: React.ReactNode;
}

const VideoVisualizerReadOnly: React.FC<VideoVisualizerReadOnlyProps> = ({ video, children }) => {
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="video-visualizer1">
      <video
        src={video.url}
        poster={video.thumbnail}
        className="video-thumbnail1"
        controls
        onLoadedData={() => setLoading(false)}
      />
      {loading && (
        <div className="spinner-container">
          <IonSpinner />
        </div>
      )}
      <h3 className="video-title">{video.title}</h3>
      <div className="video-checkbox-container1">
        {children}
      </div>
    </div>
  );
};

export default VideoVisualizerReadOnly;
