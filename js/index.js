// Import basic UI dependencies (keeping your original imports)
import "jsvectormap/dist/jsvectormap.min.css";
import "flatpickr/dist/flatpickr.min.css";
import "dropzone/dist/dropzone.css";
import "../css/style.css";

import Alpine from "alpinejs";
import persist from "@alpinejs/persist";

// --- FIREBASE INTEGRATION START ---
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Your exact config
const firebaseConfig = {
  apiKey: "AIzaSyCwvC1MlB-_7cmV-Hmi8MyXthGrFUGbwkY",
  authDomain: "fscomerce.firebaseapp.com",
  databaseURL: "https://fscomerce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fscomerce",
  storageBucket: "fscomerce.firebasestorage.app",
  messagingSenderId: "977420297543",
  appId: "1:977420297543:web:b005a014795112c24a9862",
  measurementId: "G-QHW4J71NNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
// --- FIREBASE INTEGRATION END ---

Alpine.plugin(persist);
window.Alpine = Alpine;
Alpine.start();

document.addEventListener("DOMContentLoaded", () => {
  
  // --- STORE CREATION LOGIC ---
  const signupForm = document.getElementById("storeSignupForm");
  const createStoreBtn = document.getElementById("createStoreBtn");
  const errorMsg = document.getElementById("errorMsg");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Get Values
      const fname = document.getElementById("fname").value;
      const lname = document.getElementById("lname").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const storeName = document.getElementById("storeNameInput").value;
      const storeType = document.getElementById("storeType").value;
      const storeSubType = document.getElementById("storeSubType").value;

      // Generate the clean URL string
      const storeId = storeName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const fullUrl = `${storeId}.fsc.js.org`;

      try {
        createStoreBtn.textContent = "Provisioning Store...";
        createStoreBtn.disabled = true;

        // 1. Create User in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save Store Data to Realtime Database
        await set(ref(database, 'stores/' + storeId), {
          ownerId: user.uid,
          ownerName: `${fname} ${lname}`,
          email: email,
          storeName: storeName,
          storeUrl: fullUrl,
          storeType: storeType,
          storeCategory: storeSubType,
          createdAt: new Date().toISOString(),
          status: "active"
        });

        // Success! Redirect to the Admin Dashboard
        alert(`Store Created! Your URL will be: ${fullUrl}`);
        window.location.href = "index.html"; // Replace with your dashboard URL

      } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove("hidden");
        createStoreBtn.textContent = "Create My Store";
        createStoreBtn.disabled = false;
      }
    });
  }
});
