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
  const defaultThumbnailUrl = "https://firebasestorage.googleapis.com/v0/b/altitudecinematix.appspot.com/o/pics%2Fthumbnail-background.png?alt=media&token=e70c6684-6744-42a2-8b94-57928f9e5f89";
  return (
    <div className="video-visualizer">
      <img
        src={video.thumbnail || defaultThumbnailUrl}
        alt={video.title}
        className="video-thumbnail"
      />
      <h3 className="video-title">{video.title}</h3>
    </div>
  );
};

export default VideoVisualizer;
