import React, { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage } from "@ionic/react";
import Toolbar from "../components/Toolbar";
import VideoVisualizer from "../components/VideoVisualizer";
import "./UserVideo.css";

const UserVideo = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch user videos here and set the state
    // Example: setVideos(fetchUserVideos());
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <Toolbar title="My Videos" />
      </IonHeader>
      <IonContent>
        <div className="user-video-container">
          {videos.map((video, index) => (
            <VideoVisualizer key={index} video={video} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserVideo;
