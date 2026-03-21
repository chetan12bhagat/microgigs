import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import App from "./App.tsx";
import { awsConfig } from "./integrations/aws/config";
import "./index.css";

Amplify.configure(awsConfig);

createRoot(document.getElementById("root")!).render(<App />);
