import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import './WeeklyChart.css';

interface Video {
    videoId: string;
    title: string;
    url: string;
    userId: string;
    ratings: { [userId: string]: number };
    averageRating: number;
}

const WeeklyChart: React.FC = () => {
    const [topVideos, setTopVideos] = useState<Video[]>([]);

    useEffect(() => {
        const fetchVideos = () => {
            const videosRef = ref(database, 'videos');
            onValue(videosRef, (snapshot) => {
                const videos = snapshot.val();

                const sortedVideos: Video[] = Object.entries(videos)
                    .map(([videoId, videoData]) => {
                        const data = videoData as Omit<Video, 'videoId' | 'averageRating'>;
                        const ratings = Object.values(data.ratings || {});
                        const averageRating = ratings.reduce((sum, r) => sum + r, 0) / (ratings.length || 1);
                        return { videoId, ...data, averageRating };
                    })
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 10); // Display top 10 videos

                setTopVideos(sortedVideos);
            });
        };

        fetchVideos();
    }, []);

    return (
        <div className="weekly-chart">
            <h1>Top Rated Videos of the Week</h1>
            <ul>
                {topVideos.map((video, index) => (
                    <li key={video.videoId}>
                        <span className="rank">{index + 1}.</span>
                        <span className="title">{video.title}</span>
                        <span className="rating">{video.averageRating.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeeklyChart;
