import { initializeApp } from "firebase/app";
import { onChildRemoved, serverTimestamp, limitToLast, orderByChild, DataSnapshot, equalTo, onValue, off, remove, query, getDatabase, ref, set, get, update, ref as databaseRef } from "firebase/database";
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

export async function loginUser(username: string, password: string): Promise<User | null> {
	const email = `${username}`;
	try {
		const res = await signInWithEmailAndPassword(auth, email, password);
		return res.user;
	} catch (error) {
		console.log(error);
		return null;
	}
}

export async function loginWithGoogle(): Promise<User | null> {
	const provider = new GoogleAuthProvider();
	try {
		const auth = getAuth(firebaseApp);
		const result = await signInWithPopup(auth, provider);
		return result.user;
	} catch (error) {
		console.error("Error logging in with Google:", error);
		return null;
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


export async function readUserData(uid: string): Promise<any> {
	try {
		const db = getDatabase();
		const userRef = ref(db, `users/${uid}`);

		const userData = await new Promise((resolve, reject) => {
			const callback = (snapshot: DataSnapshot) => {
				const data = snapshot.val();
				off(userRef, 'value', callback);
				resolve(data);
			};

			const errorCallback = (error: Error) => {
				reject(error);
			};

			onValue(userRef, callback, errorCallback);
		});

		return userData;
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
	onUploadProgress: (progress: number) => void,
	onValidationResult: (isValid: boolean, message: string) => void
) {
	try {
		const videoId = uuidv4();
		const storage = getStorage(firebaseApp);
		const videoStorageRef = storageRef(storage, `videos/${videoId}/${file.name}`);

		const metadata = {
			contentType: file.type,
			customMetadata: {
				userId: user.uid,
				videoId: videoId,
				title: title,
			},
		};

		const uploadTask = uploadBytesResumable(videoStorageRef, file, metadata);

		const videoDatabaseRef = databaseRef(getDatabase(), `videos/${videoId}`);

		onChildRemoved(videoDatabaseRef, (snapshot) => {
			if (snapshot.exists()) {
			  onValidationResult(false, "Video does not meet the requirements and has been removed.");
			}
		  });
		
		  onValue(videoDatabaseRef, (snapshot) => {
			if (snapshot.exists()) {
			  off(videoDatabaseRef);
			  console.log("Upload complete");
			  onValidationResult(true, "Video has passed the validation and is successfully uploaded.");
			}
		  });

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onUploadProgress(progress);
			},
			(error) => {
				console.log(error);
				off(videoDatabaseRef);
				throw error;
			},
			async () => {
				const videoData = {
					title,
					url: await getDownloadURL(uploadTask.snapshot.ref),
					fileName: file.name,
					userId: user.uid,
					timestamp: serverTimestamp(),
				};

				await set(videoDatabaseRef, videoData);

				onValue(videoDatabaseRef, (snapshot) => {
					if (snapshot.exists()) {
						off(videoDatabaseRef);
						console.log("Upload complete");
					}
				});
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
		const db = getDatabase();
		const userVideosRef = ref(db, "videos");
		const q = query(userVideosRef, orderByChild("userId"), equalTo(userId));

		const snapshot = await get(q);
		const videos: any[] = [];

		snapshot.forEach((childSnapshot: DataSnapshot) => {
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
		const userRef = ref(database, `users/${user.uid}`);
		const snapshot = await get(userRef);

		// Check if the user exists in the database
		if (!snapshot.exists()) {
			// Add the user to the database only if the user does not exist
			await set(userRef, userData);
		}
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
