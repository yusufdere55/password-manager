import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../../../../context/AuthContext'
import { PasswordList } from './PasswordList'
import { CreatePasswordModal } from './CreatePasswordModal'
import { EmptyState } from './EmptyState'

export const Passwords = () => {
    const [passwords, setPasswords] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    const fetchPasswords = async () => {
        if (!user?.id) {
            setError('User not found')
            setLoading(false)
            return
        }
    
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/item/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('API Error:', errorData)
                throw new Error(errorData.message || response.statusText || 'Failed to fetch passwords')
            }
    
            const data = await response.json()
            setPasswords(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching passwords:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchPasswords()
        }
    }, [user?.id])
    
    if (loading) {
        return <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>
    }

    if (loading) {
        return <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    return (
        <div className="space-y-6">
            <title>Passwords</title>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-200">Passwords</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={20} />
                    Add Password
                </button>
            </div>

            {passwords.length === 0 ? (
                <EmptyState onCreateClick={() => setShowCreateModal(true)} />
            ) : (
                <PasswordList passwords={passwords} onRefresh={fetchPasswords} />
            )}

            {showCreateModal && (
                <CreatePasswordModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false)
                        fetchPasswords()
                    }}
                />
            )}
        </div>
    )
}