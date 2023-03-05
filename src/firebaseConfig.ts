import firebase from "firebase/app";
import 'firebase/database';
import { toast } from "./toast";

const config = {
  apiKey: "AIzaSyByFnJuj8qpCj-DxNa7OvSHfgHbWmy76B4",
  authDomain: "altitudecinematix.firebaseapp.com",
  databaseURL: 'https://altitudecinematix-default-rtdb.europe-west1.firebasedatabase.app/',
  projectId: "altitudecinematix",
  storageBucket: "altitudecinematix.appspot.com",
  messagingSenderId: "149776768071",
  appId: "1:149776768071:web:cca25ad9f043b59f28a562",
  measurementId: "G-3WHKJQZ9SZ"
};

firebase.initializeApp(config);

export function getCurrentUser() {
	return new Promise((resolve, reject) => {
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
		toast(error.message, 4000);
		return false;
	}
}

export const registerUser = async (username: string, password: string, firstName: string, lastName: string, phoneNumber: string) => {
	try {
	  const res = await firebase.auth().createUserWithEmailAndPassword(username, password);
	  await firebase.database().ref(`users/${res.user?.uid}`).set({
		email: username,
		firstName,
		lastName,
		phoneNumber,
		userId: res.user?.uid,
	  });
	  return res;
	} catch (error) {
	  console.log(error);
	  return null;
	}
  };
  
