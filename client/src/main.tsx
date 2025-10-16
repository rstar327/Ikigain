import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/config";

// Remove loading spinner when React starts
const removeLoadingSpinner = () => {
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    spinner.remove();
    console.log('✅ Loading spinner removed by React');
  }
};

// Remove spinner immediately when React initializes
removeLoadingSpinner();

createRoot(document.getElementById("root")!).render(<App />);
