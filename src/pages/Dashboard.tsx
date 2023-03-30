import {
	IonContent,
	IonHeader,
	IonPage,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import VideoCard from "../components/VideoCard";
import Toolbar from "../components/Toolbar";
import { getCurrentUser } from "../firebaseConfig";

const Dashboard: React.FC = () => {
	const [videoUploadCounter, setVideoUploadCounter] = useState(0);
	const [videoDeletionCounter, setVideoDeletionCounter] = useState(0);
	const [uid, setUid] = useState<string | null>(null);

	useEffect(() => {
		async function fetchCurrentUser() {
			const currentUser = await getCurrentUser();
			if (currentUser) {
				setUid(currentUser.uid);
			}
		}
		fetchCurrentUser();
	}, []);

	useEffect(() => {
		const updateVideoFeedOnDeletion = () => {
			setVideoDeletionCounter((prevState) => prevState + 1);
		  };

		const updateVideoFeed = () => {
			setVideoUploadCounter((prevState) => prevState + 1);
		};

		document.addEventListener("videoDeleted", updateVideoFeedOnDeletion);

		document.addEventListener("videoUploaded", updateVideoFeed);

		return () => {
			document.removeEventListener("videoDeleted", updateVideoFeedOnDeletion);
			document.removeEventListener("videoUploaded", updateVideoFeed);
		};
	}, []);

	return (
		<IonPage>
			<IonHeader>
				<Toolbar title='Dashboard' />
			</IonHeader>
			<IonContent>
				<div className="video-feed">
					<div className="video-card">
						{uid && <VideoCard userId={uid} key={videoUploadCounter + videoDeletionCounter} />}
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Dashboard;
