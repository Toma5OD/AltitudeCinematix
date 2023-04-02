import React, { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebaseConfig';
import './WeeklyChart.css';
import Toolbar from "../components/Toolbar2";
import {
    IonRouterLink,
    IonHeader,
    IonPage,
    IonContent,
} from '@ionic/react';
import { fetchRatingsAndCalculateAverages } from '../firebaseConfig';
import { Video } from '../videoTypes';

const WeeklyChart: React.FC = () => {
    const [topVideos, setTopVideos] = useState<Video[]>([]);

    const formatRating = (averageRating: number): string => {
        return averageRating.toFixed(2);
    };

    useEffect(() => {
        const fetchVideos = async () => {
            const videosRef = ref(database, 'videos');
            const ratingAverages = await fetchRatingsAndCalculateAverages();

            const listener = onValue(videosRef, async (snapshot) => {
                const videos = snapshot.val();

                const videoPromises = Object.entries(videos).map(async ([videoId, videoData]) => {
                    const data = videoData as Omit<Video, 'videoId' | 'averageRating'>;
                    const averageRating = ratingAverages.get(videoId) || 0;
                    return { videoId, ...data, averageRating };
                });

                const fetchedVideos = await Promise.all(videoPromises);
                const sortedVideos = fetchedVideos
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 10); // Display top 10 videos

                setTopVideos(sortedVideos);
            });

            return () => {
                off(videosRef, 'value', listener);
            };
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
                                        <IonRouterLink routerLink={`/single-video/${video.videoId}`}>
                                            <span className="title">{video.title}</span>
                                        </IonRouterLink>
                                        <span className="rating">{formatRating(video.averageRating)}</span>
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
