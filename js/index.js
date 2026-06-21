// --- Make sure these are imported at the top of js/index.js ---
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signInBtn = document.getElementById("signInBtn");
  const loginErrorMsg = document.getElementById("loginErrorMsg");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        signInBtn.textContent = "Authenticating...";
        signInBtn.disabled = true;

        // Firebase Login Magic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Success! Go to dashboard page (Update URL if your dashboard page name is different)
        window.location.href = "dashboard.html"; 
        
      } catch (error) {
        // Handle Error (Wrong password, user not found, etc.)
        loginErrorMsg.textContent = "Invalid email or password. Please try again.";
        loginErrorMsg.classList.remove("hidden");
        signInBtn.textContent = "Sign In to Dashboard";
        signInBtn.disabled = false;
      }
    });
  }
});
