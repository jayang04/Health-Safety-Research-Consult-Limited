// Firebase configuration and contact form handler
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_VQUats6gQzQdhZA-YoHw4nOwkGliHfM",
    authDomain: "web-health-and-safety-research.firebaseapp.com",
    projectId: "web-health-and-safety-research",
    storageBucket: "web-health-and-safety-research.firebasestorage.app",
    messagingSenderId: "673762406167",
    appId: "1:673762406167:web:5c3590bef064e990551152",
    measurementId: "G-ZZ354FZS04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Contact form handler
export async function handleContactForm(formData) {
    try {
        // Add document to Firestore
        const docRef = await addDoc(collection(db, "contact-submissions"), {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            company: formData.company || '',
            message: formData.message,
            timestamp: serverTimestamp(),
            status: 'new',
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
        });
        
        console.log("Document written with ID: ", docRef.id);
        
        // Optional: Trigger cloud function to send email (if configured)
        try {
            await fetch('https://us-central1-web-health-and-safety-research.cloudfunctions.net/sendContactEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    docId: docRef.id,
                    ...formData
                })
            });
        } catch (emailError) {
            console.warn("Email function not available:", emailError);
            // Continue anyway - the submission is still saved
        }
        
        return { 
            success: true, 
            message: "Your message has been sent successfully!",
            submissionId: docRef.id
        };
        
    } catch (error) {
        console.error("Error adding document: ", error);
        return { 
            success: false, 
            message: "There was an error sending your message. Please try again." 
        };
    }
}
