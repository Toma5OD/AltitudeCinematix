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

	return (
		<IonPage>
			<IonHeader>
				<Toolbar title='Dashboard' />
			</IonHeader>
			<IonContent>
				<div className="video-feed">
					<div className="video-card">
						{uid && <VideoCard userId={uid} />}
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Dashboard;
