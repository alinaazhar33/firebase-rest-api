import admin from "firebase-admin";
import { readFileSync } from "fs";

// Read the service account key JSON file
const serviceAccount = JSON.parse(
  readFileSync("./config/serviceAccountKey.json", "utf8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-first-app-b177b.firebaseio.com",
});

// Initialize Firestore
const db = admin.firestore();

export { admin, db };
