import { useEffect, useState } from "react";
import {
    getRepositories,
    deleteRepository,
    ingestRepository,
} from "../api/repositoryApi";
import RepositoryCard from "../components/repository/RepositoryCard";
import type { Repository } from "../types/Temp";
import { toast } from "sonner";


export default function HomePage() {

    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        loadRepositories();
    }, []);

    async function loadRepositories() {
        try {
            const data = await getRepositories();
            setRepositories(data);
        } catch (error) {
            console.error("Failed to load repositories", error);
        }
    }
    async function handleAddRepository() {
        if (!repositoryUrl.trim()) {
            toast.error("Please enter a repository URL.");
            return;
        }

        console.log("Repository URL being sent:", repositoryUrl);

        try {
            setIsAdding(true);

            await ingestRepository(repositoryUrl.trim());

            toast.success("Repository ingestion started.");
            setRepositoryUrl("");

            setTimeout(() => {
                loadRepositories();
            }, 3000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to start repository ingestion.");
        } finally {
            setIsAdding(false);
        }
    }
    async function handleDeleteRepository(repositoryId: number) {

        const confirmed = window.confirm(
            "Delete this repository?"
        );

        if (!confirmed) {
            return;
        }
        try {
            await deleteRepository(repositoryId);

            setRepositories(prev =>
                prev.filter(repository =>
                    repository.repositoryId !== repositoryId
                )
            );
        }
        catch (error) {

            console.error(error);

            toast.error("Failed to delete repository.");

        }
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-800">
                CodePilot
            </h1>

            <p className="text-gray-500 mt-2">
                Chat with your code repositories
            </p>
            <div className="flex gap-3 mt-6">
                <input
                    type="text"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="Enter GitHub repository URL"
                    className="flex-1 border rounded-lg px-4 py-3"
                />

                <button
                    onClick={handleAddRepository}
                    disabled={isAdding}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                    {isAdding ? "Adding..." : "Add Repository"}
                </button>
            </div>

            <div className="grid gap-4 mt-8">
                {repositories.map((repository) => (
                    <RepositoryCard
                        key={repository.repositoryId}
                        repository={repository}
                        onDelete={handleDeleteRepository}
                    />
                ))}
            </div>
        </div>
    );
}