import React from "react";
import { deleteVideo } from "../firebaseConfig"; // Import the deleteVideo function
import "./VideoVisualizer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  userId: string; // Add the userId property
  fileName: string; // Add the fileName property
};


interface VideoVisualizerProps {
  video: Video;
  refresh: () => void; // Add the refresh property
}

const VideoVisualizer: React.FC<VideoVisualizerProps> = ({ video, refresh }) => {
  const handleDelete = async () => {
    try {
      await deleteVideo(video.id, video.userId, video.fileName);
      console.log("Video deleted successfully");
      if (typeof refresh === "function") {
        refresh();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="video-visualizer">
      <video
        src={video.url}
        poster={video.thumbnail}
        className="video-thumbnail"
        controls
      />
      <h3 className="video-title">{video.title}</h3>
      <button onClick={handleDelete} className="delete-button">
        <FontAwesomeIcon icon={faTrash} />
        Delete
      </button>
    </div>
  );
};

export default VideoVisualizer;
