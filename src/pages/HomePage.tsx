import { useEffect, useState } from "react";
import {
    getRepositories,
    deleteRepository,
} from "../api/repositoryApi";
import RepositoryCard from "../components/repository/RepositoryCard";
import type { Repository } from "../types/Temp";
import { toast } from "sonner";


export default function HomePage() {

    const [repositories, setRepositories] = useState<Repository[]>([]);

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