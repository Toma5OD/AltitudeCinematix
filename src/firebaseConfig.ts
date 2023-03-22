
import 'firebase/database';
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import config from "./firebaseCredentials";

firebase.initializeApp(config);

export function getCurrentUser(): Promise<firebase.User | null> {
	return new Promise((resolve) => {
		const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				resolve(user);
			} else {
				resolve(null);
			}
			unsubscribe();
		});
	});
}

export function logoutUser() {
	return firebase.auth().signOut();
}

export async function loginUser(username: string, password: string) {
	const email = `${username}`;
	try {
		const res = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password);
		return res;
	} catch (error) {
		console.log(error);
		return false;
	}
}

export const registerUser = async (
	username: string,
	password: string,
	firstName: string,
	lastName: string,
	phoneNumber: string
) => {
	try {
		const res = await firebase.auth().createUserWithEmailAndPassword(username, password);
		await firebase.database().ref(`users/${res.user?.uid}`).set({
			firstName,
			lastName,
			phoneNumber,
		});
		return res;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export async function readUserData(uid: string) {
	try {
		const snapshot = await firebase
			.database()
			.ref(`users/${uid}`)
			.once('value');
		return snapshot.val();
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function updateEmail(newEmail: string): Promise<void> {
	const currentUser = firebase.auth().currentUser;

	if (!currentUser) {
		throw new Error('No authenticated user found');
	}

	await currentUser.updateEmail(newEmail);
}

export async function updateUserPassword(newPassword: string) {
	try {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw new Error('No authenticated user found');
		}
		await currentUser.updatePassword(newPassword);
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function reauthenticateUser(password: string) {
	try {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw new Error('No authenticated user found');
		}

		const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email!, password);
		await currentUser.reauthenticateWithCredential(credential);
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function updateUserData(updates: { [key: string]: any }) {
	try {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser) {
			throw new Error('No authenticated user found');
		}
		const userRef = firebase.database().ref(`users/${currentUser.uid}`);
		await userRef.update(updates);
		const snapshot = await userRef.once('value');
		return snapshot.val();
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function uploadVideo(file: File, title: string, user: firebase.User,
	onUploadProgress: (progress: number) => void) {

	try {
		const videoId = uuidv4();
		const storageRef = firebase.storage().ref(`videos/${videoId}/${file.name}`);

		const metadata = {
			contentType: file.type,
			customMetadata: {
				userId: user.uid,
			},
		};

		const uploadTask = storageRef.put(file, metadata);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onUploadProgress(progress);
			},
			(error) => {
				console.log(error);
				throw error;
			},
			async () => {
				const downloadURL = await storageRef.getDownloadURL();

				const videoData = {
					title,
					url: downloadURL,
					fileName: file.name,
					userId: user.uid,
				};

				await firebase.database().ref(`videos/${videoId}`).set(videoData);

				console.log("Upload complete");
			}
		);

		return uploadTask;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function getUserVideos(userId: string): Promise<any[]> {
	try {
		const userVideosRef = firebase.database().ref("videos").orderByChild("userId").equalTo(userId);
		const snapshot = await userVideosRef.once("value");
		const videos: any[] = [];
		snapshot.forEach((childSnapshot) => {
			videos.push({ ...childSnapshot.val(), id: childSnapshot.key, fileName: childSnapshot.val().fileName });
		});

		return videos;
	} catch (error) {
		console.error("Error fetching user videos:", error);
		return [];
	}
}

export async function deleteVideo(videoId: string, userId: string, fileName: string): Promise<void> {
	try {
		// Remove the video from the storage bucket
		const storageRef = firebase.storage().ref(`videos/${videoId}/${fileName}`);
		await storageRef.delete();

		// Remove the video from the database
		await firebase.database().ref(`videos/${videoId}`).remove();
	} catch (error) {
		console.error("Error deleting video:", error);
		throw error;
	}
}
