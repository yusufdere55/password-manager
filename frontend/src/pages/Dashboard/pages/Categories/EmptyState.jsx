import { FolderPlus, Plus } from 'lucide-react'

export const EmptyState = ({ onCreateClick }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="bg-[#242427] p-4 rounded-full">
                <FolderPlus size={40} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200">No categories yet</h2>
            <p className="text-gray-400 text-center max-w-md">
                Create categories to organize your passwords better.
                Click the button below to create your first category.
            </p>
            <button
                onClick={onCreateClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
                <Plus size={20} />
                Create First Category
            </button>
        </div>
    )
}