import { initializeApp } from "firebase/app";
import { onChildRemoved, serverTimestamp, limitToLast, push, orderByChild, DataSnapshot, equalTo, onValue, off, remove, query, getDatabase, ref, set, get, update, ref as databaseRef, child } from "firebase/database";
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

export async function getLatestVideos(limit: number, userId: string): Promise<any[]> {
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
		}) as DataSnapshot;
		const videos: any[] = [];
		(snapshot as DataSnapshot).forEach((childSnapshot: DataSnapshot) => {
			videos.push({ ...childSnapshot.val(), id: childSnapshot.key });
		});

		videos.reverse();

		const videosWithUserRating = await Promise.all(
			videos.map(async (video) => {
				const userRatingQuery = query(ref(database, `ratings/${video.id}/${userId}`));
				const userRatingSnapshot = await new Promise((resolve) => {
					let listener: any;
					listener = onValue(userRatingQuery, (snap) => {
						if (listener) {
							off(userRatingQuery, "value", listener);
						}
						resolve(snap);
					});
				}) as DataSnapshot;
				const userRating = userRatingSnapshot.exists() ? userRatingSnapshot.val() : null;
				return { ...video, userRating };
			})
		);

		return videosWithUserRating;
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

export const createPlaylist = async (playlistName: string, playlistDescription: string, videoIds: string[] = []) => {
	const auth = getAuth();
	const currentUser = auth.currentUser;
	if (!currentUser) return;

	const database = getDatabase();
	const newPlaylistRef = push(ref(database, `playlists/${currentUser.uid}`));
	const newPlaylistData = {
		name: playlistName,
		description: playlistDescription,
		videos: videoIds.reduce((acc, videoId) => ({ ...acc, [videoId]: true }), {}),
	};
	await set(newPlaylistRef, newPlaylistData);
};

export const getRecentVideos = async () => {
	const database = getDatabase();
	const videosRef = ref(database, "videos");
	const recentVideosQuery = query(videosRef, orderByChild("uploadDate"), limitToLast(20));
	const recentVideosSnapshot = await get(recentVideosQuery);
	const recentVideosVal = recentVideosSnapshot.val();

	if (!recentVideosVal) return [];

	const recentVideos = Object.entries(recentVideosVal).map(([id, videoData]) => ({
		id,
		...(typeof videoData === 'object' ? videoData : {}),
	}));

	return recentVideos;
};

export const getUserPlaylists = async () => {
	const auth = getAuth();
	const currentUser = auth.currentUser;
	if (!currentUser) return [];

	const database = getDatabase();
	const userPlaylistsRef = ref(database, `playlists/${currentUser.uid}`);
	const userPlaylistsSnapshot = await get(userPlaylistsRef);
	const userPlaylistsVal = userPlaylistsSnapshot.val();

	if (!userPlaylistsVal) return [];

	const playlists = Object.entries(userPlaylistsVal).map(([id, playlistData]) => {
		const typedPlaylistData = playlistData as { name: string; description: string; videos?: { [key: string]: boolean } };
		return {
			id,
			...(typeof playlistData === 'object' ? playlistData : {}),
			videos: typedPlaylistData.videos ? Object.keys(typedPlaylistData.videos).map(videoId => ({ id: videoId })) : [],
		};
	});

	return playlists;
};

export const getVideosByIds = async (videoIds: string[]) => {
	const database = getDatabase();
	const videosRef = ref(database, "videos");

	const videoPromises = videoIds.map(async (videoId) => {
		const singleVideoRef = child(videosRef, videoId);
		const singleVideoSnapshot = await get(singleVideoRef);
		const videoData = singleVideoSnapshot.val();
		return {
			id: videoId,
			...(typeof videoData === 'object' ? videoData : {}),
		};
	});

	const videos = await Promise.all(videoPromises);
	return videos;
};

export async function deletePlaylist(playlistId: string, userId: string): Promise<void> {
	try {
		const database = getDatabase();
		const playlistRef = ref(database, `playlists/${userId}/${playlistId}`);
		await remove(playlistRef);
	} catch (error) {
		console.error("Error deleting playlist:", error);
		throw error;
	}
}

export const getUserRatingForVideo = async (userId: string, videoId: string) => {
	try {
		const ratingSnapshot = await get(ref(database, `ratings/${userId}/${videoId}`));
		if (ratingSnapshot.exists()) {
			return ratingSnapshot.val();
		} else {
			return 0;
		}
	} catch (error) {
		console.log("Error fetching user rating for video:", error);
		return 0;
	}
};

export const rateVideo = async (userId: string, videoId: string, rating: number) => {
	try {
		await set(ref(database, `ratings/${userId}/${videoId}`), rating);
		console.log('Rating submitted successfully');
	} catch (error) {
		console.log('Failed to submit rating:', error);
	}
};

interface VideoRating {
	videoId: string;
	rating: number;
}

export const fetchRatingsAndCalculateAverages = async (): Promise<Map<string, number>> => {
	const ratingsRef = ref(database, 'ratings');
	const videoRatings: VideoRating[] = [];

	const snapshot = await get(ratingsRef);
	const allUserRatings = snapshot.val();
	for (const userId in allUserRatings) {
		for (const videoId in allUserRatings[userId]) {
			const rating = allUserRatings[userId][videoId];
			videoRatings.push({ videoId, rating });
		}
	}

	const videoRatingSums = new Map<string, number>();
	const videoRatingCounts = new Map<string, number>();

	for (const ratingData of videoRatings) {
		const { videoId, rating } = ratingData;
		videoRatingSums.set(videoId, (videoRatingSums.get(videoId) || 0) + rating);
		videoRatingCounts.set(videoId, (videoRatingCounts.get(videoId) || 0) + 1);
	}

	const videoRatingAverages = new Map<string, number>();

	videoRatingSums.forEach((sum, videoId) => {
		const count = videoRatingCounts.get(videoId) || 1;
		videoRatingAverages.set(videoId, sum / count);
	});

	return videoRatingAverages;
};

