import {
  IonContent,
  IonHeader,
  IonPage,
  IonToast
} from "@ionic/react";
import VideoUpload from "../components/VideoUpload";
import React, { useState } from "react";
import Toolbar from "../components/Toolbar";
import "./Upload.css";

const Upload = () => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleUploadComplete = (status: boolean) => {
    setUploadComplete(status);
    if (status) {
      document.dispatchEvent(new CustomEvent("videoUploaded"));
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <Toolbar title="Upload" />
      </IonHeader>
      <div className="upload-page">
        <div className="video-upload">
          <h2 className="video-upload-title">Upload your video</h2>
          <IonContent>
            <div className="video-upload-wrapper">
              <VideoUpload onUploadComplete={handleUploadComplete} />
            </div>
            <div className="video-upload-instructions">
              <h3 className="h3-title">Instructions</h3>
              <ol className="video-upload-instructions">
                <li>Select a video file from your computer</li>
                <li>Click the &quot;Upload&quot; button</li>
                <li>Wait for the upload progress to reach 100%</li>
              </ol>
            </div>
          </IonContent>
        </div>
      </div>
    </IonPage>
  );
};

export default Upload;
