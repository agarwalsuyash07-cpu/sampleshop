🔹 React Native / Expo Components & APIs (One-liners)

ActivityIndicator – Displays a platform-native loading spinner to indicate background processing.

KeyboardAvoidingView – Automatically adjusts the UI to prevent the keyboard from covering input fields.

Platform – Detects the current platform (iOS, Android, Web) to enable platform-specific logic or styling.

Pressable – A flexible touchable component that detects press interactions with better control than buttons.

Text – Renders readable text content on the screen with styling support.

TextInput – Captures user input such as email, password, or address fields.

View – A basic container component used to structure and layout UI elements.

ScrollView – Enables vertical or horizontal scrolling for content that exceeds screen size.

FlatList – Efficiently renders large, scrollable lists with optimized performance and lazy loading.

Image – Displays images from local assets or remote URLs.

Dimensions – Retrieves screen width and height to build responsive layouts.

SafeAreaView – Ensures content does not overlap system UI elements like notches and status bars.

🔹 React Hooks & State Management

useState – Manages local component state that triggers UI re-renders on updates.

useEffect – Executes side effects such as API calls or subscriptions during component lifecycle events.

useContext – Accesses shared global state provided by React Context without prop drilling.

createContext – Creates a global context object for sharing state across components.

🔹 Navigation (Expo Router)

router – Programmatically navigates between screens (push, replace, back).

Stack – Implements stack-based navigation where screens are pushed and popped like a call stack.

Drawer – Provides side-drawer navigation for switching between major sections of the app.

redirect – Automatically navigates users to another route during app initialization or auth checks.

🔹 UI Feedback & Utilities

Toast – Displays temporary, non-blocking notification messages for user feedback.

uuidv4 – Generates a universally unique identifier for safely identifying records like addresses or orders.

🔹 Networking & Data Handling

axios – Performs HTTP requests to fetch or send data to external APIs.

🔹 Firebase Authentication & Database

initializeApp – Initializes a Firebase application using project configuration.

getAuth – Retrieves the Firebase Authentication instance.

getFirestore – Retrieves the Firestore database instance.

signInWithEmailAndPassword – Authenticates a user using email and password credentials.

onAuthStateChanged – Listens for authentication state changes such as login or logout events.

These hooks and APIs collectively enable responsive UI rendering, global state management, navigation, authentication, and real-time user feedback in a modern React Native application.