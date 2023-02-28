import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonButton,
	IonLoading,
} from "@ionic/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logoutUser } from "../firebaseConfig";
import "./Dashboard.css";
import VideoCard from "../components/VideoCard";

const Dashboard: React.FC = () => {
	const [busy, setBusy] = useState(false);
	const username = useSelector((state: any) => state.user.username);
	const history = useHistory();

	async function logout() {
		setBusy(true);
		await logoutUser();
		setBusy(false);
		history.replace("/");
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Dashboard</IonTitle>
					<div slot="end" className="logout-button-container">
						<IonButton onClick={logout}>Logout</IonButton>
					</div>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonLoading
					message="Logging out.."
					duration={0}
					isOpen={busy}
				/>

				{/* Here you can add your video feed component */}
				{/* You can style it with the className "video-feed" */}
				{/* You can also add other components or elements as needed */}
				<div className="video-feed">
					<h1>Welcome to your video feed, {username}</h1>
					<div className="video-feed">
						<div className="video-card">
							<VideoCard />
						</div>
					</div>

				</div>
			</IonContent>
		</IonPage>
	);
};

export default Dashboard;
