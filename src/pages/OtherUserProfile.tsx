import React, { useState, useEffect } from "react";
import { IonContent, IonLoading, IonHeader, IonPage, IonGrid, IonRow, IonCol, IonAvatar } from "@ionic/react";
import Toolbar from "../components/Toolbar2";
import VideoVisualizerReadOnly from "../components/VideoVisualizerReadOnly";
import "./OtherUserProfile.css";
import { useParams } from "react-router-dom";
import { getUserVideos, readUserData } from "../firebaseConfig";
import { query, getDatabase, ref, onValue, off, orderByChild, equalTo, DataSnapshot } from 'firebase/database';

const OtherUserProfile = () => {
    const [videos, setVideos] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const { userId } = useParams<{ userId: string }>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserVideos = async () => {
            setIsLoading(true);
            if (userId) {
                const userData = await readUserData(userId);
                setUser(userData);

                const db = getDatabase();
                const userVideosRef = ref(db, 'videos');
                const filteredVideosRef = orderByChild('userId');
                const videosRefEqualToUserId = query(userVideosRef, filteredVideosRef, equalTo(userId));

                const onValueChange = onValue(videosRefEqualToUserId, (snapshot: DataSnapshot) => {
                    const videosData = snapshot.val();
                    const videosList = [];
                    for (const videoId in videosData) {
                        videosList.push({
                            id: videoId,
                            ...videosData[videoId],
                        });
                    }
                    setVideos(videosList);
                    setIsLoading(false);
                });

                return () => {
                    off(userVideosRef, 'value', onValueChange);
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
                <div className="page-inside">
                    <IonGrid>
                        <IonRow>
                            <IonCol size="3">
                                <div className="pad">
                                    <div className="user-info--other">
                                        <IonAvatar className="profile-picture--other">
                                            <img className="user-profile--other" src={user.photoURL} alt="Profile" />
                                        </IonAvatar>
                                        <h2 className="title-uv--other">{user.firstName} {user.lastName}</h2>
                                        <p className="user-bio--other">{user.bio}</p>
                                        <p className="user-type--other">User type: {user.userType}</p>
                                    </div>
                                </div>
                            </IonCol>
                            <IonCol size="9">
                                <div className="user-video-container--other">
                                    <div className="user-video-card--other">
                                        {videos.length > 0 ? (
                                            videos.map((video, index) => (
                                                <VideoVisualizerReadOnly key={index} video={video} />
                                            ))
                                        ) : (
                                            <div className="no-videos-message--other">
                                                <p>{user.firstName} {user.lastName} does not have any videos uploaded.</p>
                                            </div>
                                        )}
                                    </div>
                                    <IonLoading
                                        isOpen={isLoading}
                                        message={"Loading..."}
                                    />
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default OtherUserProfile;


