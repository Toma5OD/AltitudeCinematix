import React from "react";
import { IonRouterLink } from "@ionic/react";
import "./VideoCard.css";

interface VideoCardSmallProps {
    video: any;
}

const VideoCardSmall: React.FC<VideoCardSmallProps> = ({ video }) => {
    return (
        <div className="video-card-feed">

            <video
                src={video.url}
                loop
                autoPlay
                muted
                playsInline
                className="video-card-small"
            />
            <div className="video-info">
                <IonRouterLink routerLink={`/single-video/${video.id}`} className="video-title">
                    {video.title}
                </IonRouterLink>
                {video.userData ? (
                    <IonRouterLink routerLink={`/other-user-profile/${video.userId}`} className="video-author">
                        {video.userData.firstName} {video.userData.lastName}
                    </IonRouterLink>
                ) : (
                    <span className="video-author">Unknown User</span>
                )}
            </div>
        </div>
    );
};

export default VideoCardSmall;
