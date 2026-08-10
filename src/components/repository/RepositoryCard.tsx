import { useNavigate } from "react-router-dom";
import type { Repository } from "../../types/Temp";

interface RepositoryCardProps {
    repository: Repository;
    onDelete: (repositoryId: number) => void;
}

export default function RepositoryCard({
    repository,
    onDelete,
}: RepositoryCardProps) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                navigate(`/repositories/${repository.repositoryId}`)
            }
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
        >

            <div className="flex justify-between items-start mb-4">

                <h2 className="text-2xl font-semibold text-gray-800">
                    📦 {repository.repositoryName}
                </h2>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(repository.repositoryId);
                    }}
                    className="text-red-500 hover:text-red-700 text-xl transition-colors"
                    title="Delete Repository"
                >
                    🗑
                </button>

            </div>

            <p className="text-gray-500 break-all">
                {repository.repositoryUrl}
            </p>

            <p className="text-sm text-gray-400 mt-4">
                Created:{" "}
                {new Date(repository.createdAt).toLocaleDateString()}
            </p>

        </div>
    );
}