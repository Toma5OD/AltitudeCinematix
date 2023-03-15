import { IonContent, IonHeader, IonPage } from "@ionic/react";
import React from "react";
import Toolbar from "../components/Toolbar";
import VideoVisualizer from "../components/VideoVisualizer";
import "./MyVideos.css";

const MyVideos = () => {
    // Replace this with the actual video URLs fetched from your storage
    const videoUrls = [
        "https://www.example.com/video1.mp4",
        "https://www.example.com/video2.mp4",
        "https://www.example.com/video3.mp4",
    ];

    return (
        <IonPage>
            <IonHeader>
                <Toolbar title="My Videos" />
            </IonHeader>
            <IonContent className="my-videos-page">
                <h2 className="my-videos-title">Your uploaded videos</h2>
                <div className="video-visualizer-wrapper">
                    {videoUrls.map((url, index) => (
                        <VideoVisualizer
                            key={index}
                            video={{
                                title: "Sample video title", // Replace this with the actual video title
                                thumbnail: url, // Use the URL as the thumbnail for now, replace this with the actual thumbnail URL if available
                            }}
                        />
                    ))}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MyVideos;
