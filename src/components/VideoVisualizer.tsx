import React from "react";
import "./VideoVisualizer.css";

type Video = {
  title: string;
  thumbnail: string;
};

interface VideoVisualizerProps {
  video: Video;
}

const VideoVisualizer: React.FC<VideoVisualizerProps> = ({ video }) => {
  // Render video thumbnail and title, or customize as needed
  return (
    <div className="video-visualizer">
      <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
      <h3 className="video-title">{video.title}</h3>
    </div>
  );
};

export default VideoVisualizer;
