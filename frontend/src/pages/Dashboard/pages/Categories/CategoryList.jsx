import { useState } from 'react'
import { Folder, Trash } from 'lucide-react'

export const CategoryList = ({ categories, onRefresh }) => {
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.ok) {
                onRefresh()
            }
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(category => (
                <div key={category.id} className="bg-[#242427] p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {category.icon ? (
                                <img src={category.icon} alt="" className="w-6 h-6" />
                            ) : (
                                <Folder className="w-6 h-6 text-blue-500" />
                            )}
                            <h3 className="text-lg font-medium text-gray-200">{category.name}</h3>
                        </div>
                        
                        <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-400 hover:text-red-500"
                        >
                            <Trash size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}