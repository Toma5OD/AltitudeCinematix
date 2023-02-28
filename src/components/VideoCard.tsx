import React, { useState } from "react";
import {
    IonPage,
    IonSlides,
    IonSlide,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
} from "@ionic/react";
import "./VideoCard.css";

const VideoCard: React.FC = () => {
    const [videos, setVideos] = useState<string[]>([
        "https://www.youtube.com/embed/RNKWoqDlbxc",
        "https://www.youtube.com/embed/NSHUiZp2aaY",
        "https://www.youtube.com/embed/lM02vNMRRB0",
        "https://www.youtube.com/embed/hWagaTjEa3Y",
        "https://www.youtube.com/embed/b7Cl7S0pLRw", // 8 HOUR DRONE FILM: "Islands From Above" 4K + Music by Nature Relaxation™ (Ambient AppleTV Style)
        "https://www.youtube.com/embed/nXIc2-8-_y0", // Desert 4K Drone Nature Videos | Film UHD
        "https://www.youtube.com/embed/3ldqFSVOxIU", // Top 10 Places To Visit In Switzerland
        "https://www.youtube.com/embed/XRIndzl5T3U", // Flying over Enchanted Forest 4K - Aerial Drone Film w/ Celtic Music
    ]);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false);

    const loadMoreVideos = () => {
        setTimeout(() => {
            setVideos((prevVideos) => [
                ...prevVideos,
                "https://www.youtube.com/embed/RNKWoqDlbxc",
                "https://www.youtube.com/embed/NSHUiZp2aaY",
                "https://www.youtube.com/embed/RNKWoqDlbxc",
                "https://www.youtube.com/embed/RNKWoqDlbxc",
                "https://www.youtube.com/embed/RNKWoqDlbxc",
                "https://www.youtube.com/embed/RNKWoqDlbxc",
                "https://www.youtube.com/embed/RNKWoqDlbxc",
            ]);
            if (videos.length >= 20) {
                setDisableInfiniteScroll(true);
            }
        }, 1000);
    };

    return (
        <IonPage>
            <IonInfiniteScroll
                threshold="500px"
                disabled={disableInfiniteScroll}
                onIonInfinite={loadMoreVideos}
            >
                <IonInfiniteScrollContent loadingSpinner="bubbles" />
                <IonSlides scrollbar={true} options={{ slidesPerView: "auto" }}>
                    {videos.map((videoUrl) => (
                        <IonSlide key={videoUrl}>
                            <iframe
                                width="600"
                                height="400"
                                src={videoUrl}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </IonSlide>
                    ))}
                </IonSlides>
            </IonInfiniteScroll>
        </IonPage>
    );
};

export default VideoCard;
