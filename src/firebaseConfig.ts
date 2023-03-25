
import 'firebase/database';
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import config from "./firebaseCredentials";
// import { processVideo } from "../functions/src/index";

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
		const defaultAvatarUrl = "https://ionicframework.com/docs/img/demos/avatar.svg";

		await firebase.database().ref(`users/${res.user?.uid}`).set({
			firstName,
			lastName,
			phoneNumber,
			photoURL: defaultAvatarUrl,
			bio: "Your bio here",
			userType: "Enthusiast"
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

export async function updateUserData(updates: { [key: string]: any }, userId?: string) {
	try {
		const currentUser = firebase.auth().currentUser;
		if (!currentUser && !userId) {
			throw new Error('No authenticated user found');
		}
		const targetUserId = userId || (currentUser ? currentUser.uid : '');
		if (!targetUserId) {
			throw new Error('No target user ID found');
		}
		const userRef = firebase.database().ref(`users/${targetUserId}`);
		await userRef.update(updates);
		const snapshot = await userRef.once('value');
		return snapshot.val();
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function updateUserDataFree(uid: string, updates: { [key: string]: any }) {
	try {
		const userRef = firebase.database().ref(`users/${uid}`);
		await userRef.update(updates);
		return updates;
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

				try {
					const response = await firebase.functions().httpsCallable("processVideo")({
						videoPath: downloadURL,
					});

					if (response.data.success) {
						console.log("Video processed successfully");
					} else {
						console.log("Video processing failed:", response.data.message);
					}
				} catch (error) {
					console.log("Error calling processVideo function:", error);
				}

				const videoData = {
					title,
					url: downloadURL,
					fileName: file.name,
					userId: user.uid,
					timestamp: firebase.database.ServerValue.TIMESTAMP,
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

export async function getLatestVideos(limit: number): Promise<any[]> {
	try {
		const latestVideosRef = firebase.database().ref("videos").orderByChild("timestamp").limitToLast(limit);
		const snapshot = await latestVideosRef.once("value");
		const videos: any[] = [];
		snapshot.forEach((childSnapshot) => {
			videos.push({ ...childSnapshot.val(), id: childSnapshot.key });
		});

		videos.reverse();

		return videos;
	} catch (error) {
		console.error("Error fetching latest videos:", error);
		return [];
	}
}

export async function getVideoById(videoId: string): Promise<any | null> {
	try {
		const videoRef = firebase.database().ref(`videos/${videoId}`);
		const snapshot = await videoRef.once('value');
		if (snapshot.exists()) {
			const videoData = snapshot.val();
			return { ...videoData, id: snapshot.key };
		} else {
			throw new Error('Video not found');
		}
	} catch (error) {
		console.error('Error fetching video: ', error);
		return null;
	}
}

export async function loginWithGoogle() {
	const provider = new firebase.auth.GoogleAuthProvider();
	try {
		const result = await firebase.auth().signInWithPopup(provider);
		return result;
	} catch (error) {
		console.error("Error logging in with Google:", error);
		return null;
	}
}

export async function addUserToDatabase(user: firebase.User) {
	const nameParts = user.displayName?.split(" ") || [];

	const userData = {
		firstName: nameParts.shift() || "",
		lastName: nameParts.join(" ") || "",
		phoneNumber: user.phoneNumber || "",
		photoURL: user.photoURL || "",
		bio: "", // default bio
		userType: "amateur", // default userType
	};

	try {
		await firebase.database().ref(`users/${user.uid}`).set(userData);
	} catch (error) {
		console.error("Error adding user to database:", error);
	}
}

export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
	try {
		const storageRef = firebase.storage().ref();
		const profilePicRef = storageRef.child(`profile_pictures/${userId}`);
		await profilePicRef.put(file);
		const url = await profilePicRef.getDownloadURL();
		await firebase.database().ref(`users/${userId}`).update({ photoURL: url });
		return url;
	} catch (error) {
		console.log(error);
		return null;
	}
};

