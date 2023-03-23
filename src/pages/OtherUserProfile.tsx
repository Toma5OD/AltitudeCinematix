import React, { useState, useEffect } from "react";
import { IonContent, IonHeader, IonPage, IonGrid, IonRow, IonCol } from "@ionic/react";
import Toolbar from "../components/Toolbar";
import VideoVisualizerReadOnly from "../components/VideoVisualizerReadOnly";
import "./OtherUserProfile.css";
import { useParams } from "react-router-dom";
import { getUserVideos, readUserData } from "../firebaseConfig";
import firebase from "firebase/app";

const OtherUserProfile = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const { userId } = useParams<{ userId: string }>();

    useEffect(() => {
        const fetchUserVideos = async () => {
            if (userId) {
                const userData = await readUserData(userId);
                setUser(userData);

                const userVideosRef = firebase.database().ref("videos").orderByChild("userId").equalTo(userId);
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
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const refresh = () => {
        // Add a refresh function here if needed
    };

    return (
        <IonPage>
            <IonHeader>
                <Toolbar title={`${user.firstName} ${user.lastName}'s Videos`} />
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size="3">
                            <div className="user-info">
                                <h2 className="title-uv">{user.firstName} {user.lastName}</h2>
                                <p className="email-uv">Email: {user.email}</p>
                            </div>
                        </IonCol>
                        <IonCol size="9">
                            <div className="user-video-container">
                                <div className="user-video-card">
                                    {videos.map((video, index) => (
                                        <VideoVisualizerReadOnly key={index} video={video} />
                                    ))}
                                </div>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default OtherUserProfile;
