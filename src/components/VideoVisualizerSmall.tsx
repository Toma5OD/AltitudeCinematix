import React from "react";
import "./VideoVisualizerSmall.css";

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
  return (
    <div className="video-visualizer">
      <video
        src={video.url}
        poster={video.thumbnail}
        className="video-thumbnail"
        controls
      />
      <h3 className="video-title">{video.title}</h3>
      <div className="video-checkbox-container">
        {children}
      </div>
    </div>
  );
};

export default VideoVisualizerReadOnly;
