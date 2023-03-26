import { initializeApp } from "firebase/app";
import { limitToLast, orderByChild, DataSnapshot, equalTo, onValue, off, remove, query, serverTimestamp, getDatabase, ref, set, get, update, ref as databaseRef } from "firebase/database";
import { signInWithPopup, GoogleAuthProvider, reauthenticateWithCredential, EmailAuthProvider, updateEmail as updateAuthEmail, updatePassword as updateAuthPassword, getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, User, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
// import { httpsCallable } from "firebase/functions";
import { v4 as uuidv4 } from "uuid";
import config from "./firebaseCredentials";
// import { processVideo } from "../functions/src/index";

export const firebaseApp = initializeApp(config);
export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);

export function getCurrentUser(): Promise<User | null> {
	return new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, function (user) {
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
	return signOut(auth);
}

export async function loginUser(username: string, password: string) {
	const email = `${username}`;
	try {
		const res = await signInWithEmailAndPassword(auth, email, password);
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
		const res = await createUserWithEmailAndPassword(auth, username, password);
		const defaultAvatarUrl = "https://ionicframework.com/docs/img/demos/avatar.svg";

		await set(ref(database, `users/${res.user?.uid}`), {
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
		const snapshot = await get(ref(database, `users/${uid}`));
		return snapshot.val();
	} catch (error) {
		console.log(error);
		return null;
	}
}

export function getDbRef(path: string) {
	return ref(database, path);
}

export async function updateEmail(newEmail: string): Promise<void> {
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new Error('No authenticated user found');
	}

	await updateAuthEmail(currentUser, newEmail);
}

export async function updateUserPassword(newPassword: string) {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			throw new Error('No authenticated user found');
		}
		await updateAuthPassword(currentUser, newPassword);
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function reauthenticateUser(password: string) {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			throw new Error('No authenticated user found');
		}

		const credential = EmailAuthProvider.credential(currentUser.email!, password);
		await reauthenticateWithCredential(currentUser, credential);
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function updateUserData(updates: { [key: string]: any }, userId?: string) {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser && !userId) {
			throw new Error('No authenticated user found');
		}
		const targetUserId = userId || (currentUser ? currentUser.uid : '');
		if (!targetUserId) {
			throw new Error('No target user ID found');
		}
		const userRef = databaseRef(database, `users/${targetUserId}`);
		await update(userRef, updates);
		const snapshot = await get(userRef);
		return snapshot.val();
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function updateUserDataFree(uid: string, updates: { [key: string]: any }) {
	try {
		const userRef = databaseRef(database, `users/${uid}`);
		await update(userRef, updates);
		return updates;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function uploadVideo(
	file: File,
	title: string,
	user: User,
	onUploadProgress: (progress: number) => void
) {
	try {
		const videoId = uuidv4();
		const storage = getStorage(firebaseApp);
		const videoStorageRef = storageRef(storage, `videos/${videoId}/${file.name}`);

		const metadata = {
			contentType: file.type,
			customMetadata: {
				userId: user.uid,
			},
		};

		const uploadTask = uploadBytesResumable(videoStorageRef, file, metadata);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onUploadProgress(progress);
			},
			(error) => {
				console.log(error);
				throw error;
			},
			async () => {
				const downloadURL = await getDownloadURL(videoStorageRef);

				const videoData = {
					title,
					url: downloadURL,
					fileName: file.name,
					userId: user.uid,
					timestamp: serverTimestamp(),
				};

				await set(databaseRef(database, `videos/${videoId}`), videoData);

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
		const userVideosQuery = query(ref(database, "videos"), orderByChild("userId"), equalTo(userId));
		const snapshot = await new Promise((resolve) => {
			const listener = onValue(userVideosQuery, (snap) => {
				off(userVideosQuery, "value", listener);
				resolve(snap);
			});
		});
		const videos: any[] = [];
		(snapshot as DataSnapshot).forEach((childSnapshot: any) => {
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
		const videoStorageRef = storageRef(getStorage(firebaseApp), `videos/${videoId}/${fileName}`);
		await deleteObject(videoStorageRef);

		// Remove the video from the database
		await remove(ref(database, `videos/${videoId}`));
	} catch (error) {
		console.error("Error deleting video:", error);
		throw error;
	}
}

export async function getLatestVideos(limit: number): Promise<any[]> {
	try {
		const latestVideosQuery = query(ref(database, "videos"), orderByChild("timestamp"), limitToLast(limit));
		const snapshot = await new Promise((resolve) => {
			let listener: any;
			listener = onValue(latestVideosQuery, (snap) => {
				if (listener) {
					off(latestVideosQuery, "value", listener);
				}
				resolve(snap);
			});
		});
		const videos: any[] = [];
		(snapshot as DataSnapshot).forEach((childSnapshot: DataSnapshot) => {
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
		const videoRef = ref(database, `videos/${videoId}`);
		const snapshot = await get(videoRef);
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
	const provider = new GoogleAuthProvider();
	try {
		const auth = getAuth(firebaseApp);
		const result = await signInWithPopup(auth, provider);
		return result;
	} catch (error) {
		console.error("Error logging in with Google:", error);
		return null;
	}
}

export async function addUserToDatabase(user: User) {
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
		await set(ref(database, `users/${user.uid}`), userData);
	} catch (error) {
		console.error("Error adding user to database:", error);
	}
}

export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
	try {
		const profilePicRef = storageRef(getStorage(firebaseApp), `profile_pictures/${userId}`);
		await uploadBytesResumable(profilePicRef, file);
		const url = await getDownloadURL(profilePicRef);
		await update(ref(database, `users/${userId}`), { photoURL: url });
		return url;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export async function searchVideos(searchString: string): Promise<any[]> {
	try {
		const allVideosSnapshot = await get(ref(database, "videos"));
		const allVideos = allVideosSnapshot.val();
		const matchingVideos: any[] = [];

		for (const videoId in allVideos) {
			const video = allVideos[videoId];
			if (video.title.toLowerCase().includes(searchString.toLowerCase())) {
				matchingVideos.push({ ...video, id: videoId });
			}
		}

		return matchingVideos;
	} catch (error) {
		console.error("Error searching for videos:", error);
		return [];
	}
}
