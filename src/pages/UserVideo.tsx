import React, { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage } from "@ionic/react";
import Toolbar from "../components/Toolbar";
import VideoVisualizer from "../components/VideoVisualizer";
import "./UserVideo.css";
import { getCurrentUser, getUserVideos } from "../firebaseConfig";

const UserVideo = () => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserVideos = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userVideos = await getUserVideos(currentUser.uid);
        setVideos(userVideos);
      }
    };

    fetchUserVideos();
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
