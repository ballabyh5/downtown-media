// dt-config.js — public Firebase config.
//
// All values below are designed to be shipped to browsers. Their power is
// bounded by Firestore Security Rules (see firestore.rules), which is why
// authorization actually depends on the rules file, not on hiding these keys.
//
// Do NOT paste a Firebase Admin service-account JSON here. That key bypasses
// rules and belongs only on a server (Cloud Functions / Cloud Run).

window.DT_CONFIG = {
  apiKey:            "AIzaSyCnRHcxlQsHNsBoGALH0sSNiDR3isKe0Pc",
  authDomain:        "downtown-media.firebaseapp.com",
  projectId:         "downtown-media",
  storageBucket:     "downtown-media.firebasestorage.app",
  messagingSenderId: "905652592890",
  appId:             "1:905652592890:web:ce5b4076109c0fdcf92943",
  measurementId:     "G-SGECH65QH3",
};
