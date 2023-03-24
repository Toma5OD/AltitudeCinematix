import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  IonModal,
  IonButton,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonContent,
  IonHeader,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonIcon,
} from "@ionic/react";
import Toolbar from "../components/Toolbar";
import VideoVisualizer from "../components/VideoVisualizer";
import "./UserVideo.css";
import { getCurrentUser, getUserVideos, readUserData, updateUserDataFree, uploadProfilePicture } from "../firebaseConfig";
import firebase from "firebase/app";
import { create } from "ionicons/icons";

const UserVideo = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const bioRef = useRef<HTMLIonTextareaElement>(null);
  const userTypeRef = useRef<HTMLIonSelectElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserVideos = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userData = await readUserData(currentUser.uid);
        setUser(userData);
        setUser({ ...userData, uid: currentUser.uid });

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

  const saveProfile = async () => {
    if (user && bioRef.current && userTypeRef.current) {
      const updates = {
        bio: bioRef.current.value,
        userType: userTypeRef.current.value,
      };

      console.log('User UID:', user.uid);
      const updatedFields = await updateUserDataFree(user.uid, updates);
      if (updatedFields) {
        setUser({ ...user, ...updatedFields });
      }
    }
    setShowModal(false);
  };

  const handleFileChange = useCallback(async () => {
    const input = fileInputRef.current;
    if (input && input.files && input.files[0]) {
      const file = input.files[0];
      setSelectedFile(file);
      if (user) {
        const url = await uploadProfilePicture(user.uid, file);
        if (url) {
          setUser({ ...user, photoURL: url });
        }
      }
    }
  }, [user]);





  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage className="my-ion-page">
      <IonHeader>
        <Toolbar title="My Videos" />
      </IonHeader>
      <div className="page-below1">
        <IonContent>
          <IonGrid className="user-video-content">
            <div className="uv-background">
              <IonRow>
                <IonCol size="3">
                  <div className="user-info">
                    <IonAvatar className="profile-picture">
                      <img className="user-profile" src={user.photoURL} alt="Profile" />
                      <br />
                      <br />
                      <label className="upload-button">
                        <IonIcon icon={create} />
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          className="input-file"
                          onChange={handleFileChange}
                        />
                      </label>
                    </IonAvatar>
                    <br />
                    <br />
                    <br />
                    <h2 className="title-uv">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="user-bio">{user.bio}</p>
                    <p className="user-type">User type: {user.userType}</p>
                    <IonButton onClick={() => setShowModal(true)} expand="block">
                      Edit Profile
                    </IonButton>
                    <IonModal isOpen={showModal} cssClass="edit-profile-modal">
                      <IonContent>
                        <h2>Edit Profile</h2>
                        <IonLabel>Bio</IonLabel>
                        <IonTextarea ref={bioRef} value={user.bio}></IonTextarea>
                        <IonLabel>User Type</IonLabel>
                        <IonSelect ref={userTypeRef} value={user.userType}>
                          <IonSelectOption value="Amateur Drone Pilot">Amateur Drone Pilot</IonSelectOption>
                          <IonSelectOption value="Professional Drone Pilot">Professional Drone Pilot</IonSelectOption>
                          <IonSelectOption value="Amateur Videographer">Amateur Videographer</IonSelectOption>
                          <IonSelectOption value="Professional Videographer">Professional Videographer</IonSelectOption>
                          <IonSelectOption value="Enthusiast">Enthusiast</IonSelectOption>
                        </IonSelect>
                        <IonButton onClick={saveProfile}>Save</IonButton>
                        <IonButton onClick={() => setShowModal(false)}>Cancel</IonButton>
                      </IonContent>
                    </IonModal>
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
      </div>
    </IonPage>
  );
};

export default UserVideo;
