import React, { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage } from "@ionic/react";
import Toolbar from "../components/Toolbar";
import VideoVisualizer from "../components/VideoVisualizer";
import "./UserVideo.css";
import { getCurrentUser, getUserVideos } from "../firebaseConfig";
import firebase from "firebase/app";

const UserVideo = () => {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserVideos = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userVideosRef = firebase.database().ref("videos").orderByChild("userId").equalTo(currentUser.uid);
        const onValueChange = userVideosRef.on("value", (snapshot) => {
          const videosData = snapshot.val();
          const videosList = [];
          for (const videoId in videosData) {
            videosList.push({
              id: videoId,
              ...videosData[videoId],
            });
          }
          setVideos(videosList);
        });
  
        return () => {
          userVideosRef.off("value", onValueChange);
        };
      }
    };
  
    fetchUserVideos();
  }, []);  

  const refresh = () => {
    // Add a refresh function here if needed
  };

  return (
    <IonPage>
      <IonHeader>
        <Toolbar title="My Videos" />
      </IonHeader>
      <IonContent>
        <div className="user-video-container">
          {videos.map((video, index) => (
            <VideoVisualizer key={index} video={video} refresh={refresh} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserVideo;
