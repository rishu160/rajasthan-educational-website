// Firebase Database Integration
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBvOyeRxsXnBtQpwf-wuBsAINEkFSMqTzg",
    authDomain: "rajasthan-education-platform.firebaseapp.com",
    projectId: "rajasthan-education-platform",
    storageBucket: "rajasthan-education-platform.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class FirebaseDB {
    // User Management
    async registerUser(userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;
            
            await setDoc(doc(db, 'users', user.uid), {
                name: userData.name,
                email: userData.email,
                role: userData.role || 'student',
                college: userData.college || '',
                createdAt: new Date()
            });
            
            return { success: true, user: { id: user.uid, ...userData } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();
            
            return { success: true, user: { id: user.uid, ...userData } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // College Management
    async addCollege(collegeData) {
        try {
            const docRef = await addDoc(collection(db, 'colleges'), {
                ...collegeData,
                createdAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getColleges() {
        try {
            const querySnapshot = await getDocs(collection(db, 'colleges'));
            const colleges = [];
            querySnapshot.forEach((doc) => {
                colleges.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, colleges };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Course Management
    async addCourse(courseData) {
        try {
            const docRef = await addDoc(collection(db, 'courses'), {
                ...courseData,
                createdAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getCourses() {
        try {
            const querySnapshot = await getDocs(collection(db, 'courses'));
            const courses = [];
            querySnapshot.forEach((doc) => {
                courses.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, courses };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Live Classes
    async createLiveClass(classData) {
        try {
            const docRef = await addDoc(collection(db, 'liveClasses'), {
                ...classData,
                students: [],
                status: 'scheduled',
                createdAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Payments
    async createPayment(paymentData) {
        try {
            const docRef = await addDoc(collection(db, 'payments'), {
                ...paymentData,
                status: 'pending',
                createdAt: new Date()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new FirebaseDB();