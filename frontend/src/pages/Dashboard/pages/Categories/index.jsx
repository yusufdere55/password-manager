import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { CategoryList } from './CategoryList'
import { CreateCategoryModal } from './CreateCategoryModal'
import { EmptyState } from './EmptyState'

export const Categories = () => {
    const [categories, setCategories] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchCategories = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/category`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch categories')
            }

            const data = await response.json()
            setCategories(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching categories:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    if (loading) {
        return <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>
    }

    return (
        <div className="space-y-6">
            <title>Categories</title>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-200">Categories</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            {categories.length === 0 ? (
                <EmptyState onCreateClick={() => setShowCreateModal(true)} />
            ) : (
                <CategoryList categories={categories} onRefresh={fetchCategories} />
            )}

            {showCreateModal && (
                <CreateCategoryModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        fetchCategories()
                    }}
                />
            )}
        </div>
    )
}