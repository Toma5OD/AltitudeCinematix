import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import './WeeklyChart.css';
import Toolbar from "../components/Toolbar";
import {
    IonHeader,
    IonPage,
    IonContent,
} from '@ionic/react';
import { fetchRatingsAndCalculateAverages } from '../firebaseConfig';

interface Video {
    videoId: string;
    title: string;
    url: string;
    userId: string;
    averageRating: number;
}

const WeeklyChart: React.FC = () => {
    const [topVideos, setTopVideos] = useState<Video[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const videosRef = ref(database, 'videos');
            const ratingAverages = await fetchRatingsAndCalculateAverages();

            onValue(videosRef, (snapshot) => {
                const videos = snapshot.val();

                const videoPromises = Object.entries(videos).map(async ([videoId, videoData]) => {
                    const data = videoData as Omit<Video, 'videoId' | 'averageRating'>;
                    const averageRating = ratingAverages.get(videoId) || 0;
                    return { videoId, ...data, averageRating };
                });

                Promise.all(videoPromises).then((unsortedVideos) => {
                    const sortedVideos = unsortedVideos
                        .sort((a, b) => b.averageRating - a.averageRating)
                        .slice(0, 10); // Display top 10 videos

                    setTopVideos(sortedVideos);
                });
            });
        };

        fetchVideos();
    }, []);

    const getMedalColor = (index: number): string => {
        switch (index) {
          case 0:
            return "#ffd700"; // Gold
          case 1:
            return "#c0c0c0"; // Silver
          case 2:
            return "#cd7f32"; // Bronze
          default:
            return "";
        }
      };

    return (
        <IonPage>
            <IonHeader>
                <Toolbar title="Upload" />
            </IonHeader>
            <IonContent>
                <div className="page-background-weekly">
                    <div className="weekly-chart-content">
                        <div className="weekly-chart">
                            <h1>Top Rated Videos of the Week</h1>
                            <ul>
                                {topVideos.map((video, index) => (
                                    <li key={video.videoId} style={index < 3 ? { backgroundColor: getMedalColor(index) } : {}}>
                                        <span className="rank">{index + 1}.</span>
                                        <span className="title">{video.title}</span>
                                        <span className="rating">{video.averageRating.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default WeeklyChart;
