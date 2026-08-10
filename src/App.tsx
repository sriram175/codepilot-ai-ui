import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RepositoryPage from "./pages/RepositoryPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
                path="/repositories/:repositoryId"
                element={<RepositoryPage />}
            />
        </Routes>
    );
}