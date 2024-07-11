const admin = require("firebase-admin");
const serviceAccount = require("./firebaseConfig.json");
// 환경 변수에서 Firebase 설정 값을 읽어와 초기화합니다.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
