import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  //paste your firebase config here
};
// if a Firebase instance doesn't exist, create one
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const auth = firebase.auth();
export default firebase;
