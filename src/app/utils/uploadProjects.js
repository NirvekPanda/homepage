import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";




async function uploadProjects() {
    try {

        // Fetch projects from public/project_list.json
        const response = await fetch('/public/project_list.json');
        const projects = await response.json();

        // Get reference to Firestore collection
        const projectsCollection = collection(firestore, "projects");

        // Clear existing projects in the collection
        const querySnapshot = await getDocs(projectsCollection);
        const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // Upload each project to Firestore
        const promises = projects.map(async (project) => {
            const docRef = await addDoc(projectsCollection, project);
            console.log("Document written with ID:", docRef.id);
        });

        await Promise.all(promises);
        console.log("All projects uploaded successfully.");
    } catch (error) {
        console.error("Error uploading projects:", error);
    }
}

export default uploadProjects;
