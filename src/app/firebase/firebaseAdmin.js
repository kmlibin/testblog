import * as admin from "firebase-admin";

//  If you're using the service account key file (recommended for security):
const serviceAccount = require("../../../../serviceaccountkey.json");

export function initializeAdminApp() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}.firebaseio.com`, // This is optional, but recommended for better clarity
      projectId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
}

const db = admin.firestore(); // Get a reference to Firestore
// ... other Firebase services can be accessed like this: admin.auth(), admin.messaging(), etc.

export { db, admin }; // Export the database and admin instance for use elsewhere
