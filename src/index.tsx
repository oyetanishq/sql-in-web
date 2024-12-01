import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./pages/index.tsx";

const root = document.getElementById("root")!;
createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>
);
