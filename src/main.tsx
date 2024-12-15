import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { PrimeReactProvider } from "primereact/api";

import "primereact/resources/themes/lara-light-cyan/theme.css";

createRoot(document.getElementById("root")!).render(
    <PrimeReactProvider>
        <App />
    </PrimeReactProvider>
);
