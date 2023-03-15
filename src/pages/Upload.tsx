import { IonContent, IonHeader, IonPage } from "@ionic/react";
import VideoUpload from "../components/VideoUpload";
import React from "react";
import Toolbar from "../components/Toolbar";
import "./Upload.css";

const Upload = () => {
  return (
    <IonPage>
      <IonHeader>
        <Toolbar title='Upload' />
      </IonHeader>
      <div className="upload-page">
        <div className="video-upload">
          <h2 className="video-upload-title">Upload your video</h2>
          <IonContent>
            <div className="video-upload-wrapper">
              <VideoUpload />
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
