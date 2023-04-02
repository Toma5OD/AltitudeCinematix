import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  IonModal,
  IonButton,
  IonLabel,
  IonLoading,
  IonTextarea,
  IonSelect,
  IonToast,
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
import Toolbar from "../components/Toolbar2";
import VideoVisualizer from "../components/VideoVisualizer";
import "./UserVideo.css";
import { getCurrentUser, readUserData, updateUserDataFree, uploadProfilePicture } from "../firebaseConfig";
import { query, onValue, orderByChild, equalTo, off, getDatabase, ref } from "firebase/database";
import { create } from "ionicons/icons";

const UserVideo = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const bioRef = useRef<HTMLIonTextareaElement>(null);
  const userTypeRef = useRef<HTMLIonSelectElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserVideos = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userData = await readUserData(currentUser.uid);
        setUser({ ...userData, uid: currentUser.uid });

        const database = getDatabase();
        const userVideosRef = ref(database, "videos");
        const filteredUserVideosRef = query(userVideosRef, orderByChild("userId"), equalTo(currentUser.uid));
        const onValueChange = onValue(filteredUserVideosRef, (snapshot) => {
          const videosData = snapshot.val();
          const videosList = [];
          for (const videoId in videosData) {
            videosList.push({
              id: videoId,
              ...videosData[videoId],
            });
          }
          setIsLoading(false);
          setVideos(videosList);
        });

        return () => {

          off(filteredUserVideosRef, "value", onValueChange);
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
                    <div className="user-info2">
                      <IonAvatar className="profile-picture">
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
                        <img className="user-profile" src={user.photoURL} alt="Profile" />
                      </IonAvatar>
                    </div>
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
                    <IonModal
                      style={{
                        '--width': '60%',
                        '--height': '90%',
                        '--border-radius': '10px',
                        '--box-shadow': '0px 2px 15px rgba(0, 0, 0, 0.1)',
                      }}
                      isOpen={showModal}
                    >
                      <IonContent style={{ '--background': '#F0F0F0' }}>
                        <div style={{ paddingTop: '3%', paddingRight: '4%', paddingLeft: '4%', paddingBottom: '1%', }}>
                          <h1 style={{ textAlign: 'center', color: '#3B3B3B', marginBottom: '20px', fontSize: '3em', fontFamily: 'Montserrat' }}>Edit Profile</h1>
                          <div style={{ paddingTop: '3%', paddingRight: '4%', paddingLeft: '4%', paddingBottom: '1%', backgroundColor: '#C9E4CA', color: '#1D4E2D', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                            <IonLabel style={{ color: '#3B3B3B', marginBottom: '5px' }}>Bio</IonLabel>
                            <IonTextarea ref={bioRef} value={user.bio} style={{ paddingTop: '3%', marginBottom: '20px' }}></IonTextarea>
                          </div>
                          <div style={{
                            paddingTop: '1%',
                            paddingRight: '4%',
                            paddingLeft: '4%',
                            paddingBottom: '1%',
                            backgroundColor: '#C9E4CA',
                            color: '#1D4E2D',
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px'
                          }}>
                            <IonLabel style={{ marginBottom: '5px' }}>User Type</IonLabel>
                            <br />
                            <br />
                            <IonSelect ref={userTypeRef} value={user.userType} style={{ backgroundColor: '#6FA56E', marginBottom: '20px', borderRadius: '10px', padding: '2%' }}>
                              <IonSelectOption value="Amateur Drone Pilot">Amateur Drone Pilot</IonSelectOption>
                              <IonSelectOption value="Professional Drone Pilot">Professional Drone Pilot</IonSelectOption>
                              <IonSelectOption value="Amateur Videographer">Amateur Videographer</IonSelectOption>
                              <IonSelectOption value="Professional Videographer">Professional Videographer</IonSelectOption>
                              <IonSelectOption value="Enthusiast">Enthusiast</IonSelectOption>
                            </IonSelect>
                          </div>
                          <div style={{ paddingTop: '1%', paddingRight: '4%', paddingLeft: '4%', paddingBottom: '1%' }}>
                            <div style={{ padding: '10px' }}>
                              <IonButton onClick={saveProfile} style={{ marginRight: '10px', '--background': '#4CAF50', '--color': 'white' }}>Save</IonButton>
                            </div>
                            <div style={{ padding: '10px' }}>
                              <IonButton onClick={() => setShowModal(false)} style={{ '--background': '#F44336', '--color': 'white' }}>Cancel</IonButton>
                            </div>
                          </div>
                        </div>
                      </IonContent>
                    </IonModal>
                    <IonLoading
                      isOpen={isLoading}
                      message={"Loading..."}
                    />
                  </div>
                </IonCol>
                <IonCol size="9">
                  <div className="user-video-container">
                    <div className="user-video-card">
                      {videos.length === 0 ? (
                        <div className="no-videos-message">
                          <h2>You have not uploaded any videos yet.</h2>
                          <h2>Upload some videos today! or continue viewing</h2>
                        </div>
                      ) : (
                        videos.map((video, index) => (
                          <VideoVisualizer key={index} video={video} refresh={refresh} />
                        ))
                      )}
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

