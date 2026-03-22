import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import App from "./App.tsx";
import { awsConfig } from "./integrations/aws/config";
import "./index.css";

Amplify.configure(awsConfig);
console.log("Amplify configured in main.tsx");
import { fetchAuthSession } from "aws-amplify/auth";
fetchAuthSession().then(s => console.log("Initial session in main.tsx:", s)).catch(e => console.error("Initial session error:", e));

createRoot(document.getElementById("root")!).render(<App />);
