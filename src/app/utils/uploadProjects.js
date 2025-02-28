import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; 

async function uploadProjects() {
    try {
        // Define the projects array
        const projects = [
            {
                "name": "Development Journal",
                "description": "Originally created as a group final project for the course CSE 110: Software Engineering. Worked with a team of 8 students to learn the Agile Scrum Methodology, implementing a functioning Continuous Integration / Continuous Development pipeline, and gave us experience with designing and building a full-stack web app. Personally oversaw the CI/CD pipeline leveraging GitHub actions for deployment, employing Junit and Jest testing, and ESlint for code quality control.",
                "languages": "HTML, CSS, Javascript, Node.js, Git, GitHub Actions, Miro, Junit, Jest",
                "image": "https://images.crazygames.com/games/2048/cover_16x9-1707828856995.png?auto=format,compress&q=75&cs=strip",
                "link": "https://cse110-sp24-group11.github.io/cse110-sp24-group11/assets/src/front-page/index.html"
            },
            {
                "name": "2048 Solver",
                "description": "Originally created for the course CSE 150B: AI Search and Reasoning. Designed and implemented an adversarial search algorithm to optimize the completion of the popular online game 2048. Leveraged the expectimax search algorithm to create search trees that explore different game states and exploit the best branches for the highest possible score. Recent updates include: an improvement to the heuristic search algorithm to achieve scores higher than 2048, user interface upgrades for cleaner and faster user experience, and inclusion of Pybag for usage of the python code on web applications.",
                "languages": "Python, Numpy, Pygame, Pybag",
                "image": "https://images.crazygames.com/games/2048/cover_16x9-1707828856995.png?auto=format,compress&q=75&cs=strip",
                "link": "https://example.com/"
            },
            {
                "name": "Blackjack Optimizer",
                "description": "Originally created for the course CSE 150B: AI Search and Reasoning. Implemented a reinforcement learning algorithm that used Monte Carlo Tree Search to simulate game states and establish scores for different hands. Used Temporal Difference Policy Evaluation and Q-Learning to maximize the Bellman Equation to iteratively figure out the best move to take, given the current game state. Recent upgrades include: Improving the UI to be more user friendly, Inclusion of Pybag for usage of the python code on web applications.",
                "languages": "Python, Numpy, Pygame, Pybag",
                "image": "https://cdn.hswstatic.com/gif/how-to-play-blackjack-lead.jpg",
                "link": "https://example.com/"
            },
            {
                "name": "Sudoku Solver",
                "description": "Originally created for the course CSE 150B: AI Search and Reasoning. Executed a constraint-solving algorithm for Sudoku, optimizing domain reduction to eliminate invalid possibilities and minimize data wastage. Utilized forward propagation to update domains based on constraints and applied backtracking to efficiently explore possible solutions, ensuring minimal mistakes during the solving process. Recent updates include: Creating an interactive user environment for manual play using Pygame and inclusion of Pybag for usage of the python code on web applications.",
                "languages": "Python, Numpy, Pygame, Scipy, Pybag",
                "image": "https://www.puzzlesociety.com/_next/image?url=https%3A%2F%2Fcmsassets.puzzlesociety.com%2Fstaging-assets%2Fassets%2FPivot_Game_Lander_Hero_Mobile_Sudoku_Mini_1000_efd54fdf62.png&w=2400&q=75",
                "link": "https://example.com/"
            },
            {
                "name": "Poverty Predictor Model",
                "description": "Originally created for the course CSE 158R: Data Science and Machine Learning. Developed a binary classification model to predict Health Inclusive Poverty Measure (HIPM) status, leveraging logistic regression with L2 regularization and balanced class weights to handle dataset imbalances. Conducted feature engineering, data preprocessing, and model evaluation to identify key socioeconomic factors influencing poverty classification. The model achieved 73% accuracy, providing insights that could aid data-driven policy decisions on healthcare and poverty.",
                "languages": "Python, Numpy, Pandas, Scikit-learn, matplotlib",
                "image": "https://i0.wp.com/federalsafetynet.com/wp-content/uploads/2024/09/ps000011.png?resize=960%2C720&ssl=1",
                "link": "https://docs.google.com/document/d/140T-F3hy8HARVfjZIojAdDXH6NzFwpvGdeRPAN3UmHk/edit?usp=sharing"
            },
            {
                "name": "RedShift LLM Jailbreak",
                "description": "Advanced an automated red-teaming framework to evaluate Large Language Model (LLM) vulnerabilities against jailbreak attacks. Optimized an adversarial attack system using LLMs as attackers, targets, and judges, drawing from the 'Distract Large Language Models for Automatic Jailbreak Attack' framework. Assessed diverse LLM architectures (Vicuna, Llama, DeBERTa, DeepSeek, Grok) for effectiveness, refining prompts iteratively to enhance security evaluation. Cleaned code base to reduce redundancy and error occurrence per local attack iteration by 40%.",
                "languages": "Python, Pytorch, Transformers, LLMs, Git",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC1AfannOk1TCpu4SuyYIUCTgWajCuQDD_ig&s",
                "link": "https://www.overleaf.com/read/ycmzdwcvzrwk#18656e"
            },
            {
                "name": "Neurolens | Eye Ray Tracking Model",
                "description": "During my internship in the Summer of 2024 I had the privilege of working at Neurolens, a medical device company that developed a product that is able to identify and correct eye misalignment. Developed a ray-tracking model for eye imagery in collaboration with a Senior Algorithm Engineer, optimizing data collection for proprietary medical devices. Processed eye-tracking and time-series data using OpenCV and TSFresh, achieving 84% accuracy in identifying suppressed measurements, improving data reliability.",
                "languages": "Python, Numpy, Pandas, Scikit-learn, matplotlib, seaborn, OpenCV, TSFresh",
                "image": "https://i.ytimg.com/vi/6XtaohnMih4/maxresdefault.jpg",
                "link": "https://www.neurolens.com/"
            },
            {
                "name": "Portfolio Site",
                "description": "Developed this website to showcase myself as a Software and ML engineer. Employed Next.js and Tailwind CSS to develop the front end and used Firebase for the server and database. This website serves as a glimpse into who I am professionally, showcasing some of the projects I have worked on through my academic career and in my personal time.",
                "languages": "Next.js, Node.js, Tailwind CSS, Firebase, ESlint, Vercel",
                "image": "https://researchcomputing.princeton.edu/sites/g/files/toruqf7036/files/styles/freeform_750w/public/2021-02/Github.png?h=0adafebd&itok=ifc6IOIP",
                "link": "https://nirvekpandey.com"
            },
            {
                "name": "eLoN Early Warning System (EEWS)",
                "description": "Assisted in the development and deployment of Recurrent Neural Network (RNN) for stock predictions. Applied a Long Short-Term Memory (LSTM) model leveraging Adaptive Moment Estimation (Adam) optimizer for gradient descent calculation. Future prospects include implementing data regarding Bollinger bands, trading volume, opening prices, and stochastic oscillators.",
                "languages": "Python, Pytorch, CUDA, cuDNN",
                "image": "https://www.darischen.com/markdown/eews-assets/predictions.png",
                "link": "https://github.com/DarisChen/EEWS"
            }
        ];

        // Get reference to Firestore collection
        const projectsCollection = collection(firestore, "projects");

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
