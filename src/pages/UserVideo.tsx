import React, { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage, IonGrid, IonRow, IonCol } from "@ionic/react";
import Toolbar from "../components/Toolbar";
import VideoVisualizer from "../components/VideoVisualizer";
import "./UserVideo.css";
import { getCurrentUser, getUserVideos, readUserData } from "../firebaseConfig";
import firebase from "firebase/app";

const UserVideo = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState<string>('');
  const [userType, setUserType] = useState<string>('');


  useEffect(() => {
    const fetchUserVideos = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userData = await readUserData(currentUser.uid);
        setUser({
          ...userData,
        });

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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <Toolbar title="My Videos" />
      </IonHeader>
      <IonContent>
        <IonGrid>
          <div className="uv-background">
            <IonRow>
              <IonCol size="3">
                <div className="user-info">
                  <h2 className="title-uv">{user.firstName} {user.lastName}</h2>
                </div>
              </IonCol>
              <IonCol size="9">
                <div className="user-video-container">
                  <div className="user-video-card">
                    {videos.map((video, index) => (
                      <VideoVisualizer key={index} video={video} refresh={refresh} />
                    ))}
                  </div>
                </div>
              </IonCol>
            </IonRow>
          </div>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default UserVideo;
