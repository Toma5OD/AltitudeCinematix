import React, { useState } from "react";
import {
  IonRouterLink,
  IonToast,
} from "@ionic/react";
import { deleteVideo } from "../firebaseConfig";
import "./VideoVisualizer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  userId: string;
  fileName: string;
};

interface VideoVisualizerProps {
  video: Video;
  refresh: () => void;
}

const VideoVisualizer: React.FC<VideoVisualizerProps> = ({ video, refresh }) => {
  const [toastMessage, setToastMessage] = useState("");
  const handleDelete = async () => {
    try {
      await deleteVideo(video.id, video.userId, video.fileName);
      console.log("Video deleted successfully");
      document.dispatchEvent(new CustomEvent("videoDeleted"));
      setToastMessage("Video deleted successfully");
      if (typeof refresh === "function") {
        refresh();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      setToastMessage("Error deleting video");
    }
  };

  return (
    <div className="video-visualizer">
      <IonToast
        isOpen={toastMessage !== ""}
        onDidDismiss={() => setToastMessage("")}
        message={toastMessage}
        duration={3000}
      />
      <video
        src={video.url}
        poster={video.thumbnail}
        className="video-thumbnail"
        controls
      />
      <IonRouterLink routerLink={`/single-video/${video.id}`}>
        <h3 className="video-title">{video.title}</h3>
      </IonRouterLink>
      <button onClick={handleDelete} className="delete-button">
        <FontAwesomeIcon icon={faTrash} />
        Delete
      </button>
    </div>
  );
};

export default VideoVisualizer;
