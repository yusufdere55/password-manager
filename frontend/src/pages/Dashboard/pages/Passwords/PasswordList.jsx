import { useState } from 'react'
import { Eye, EyeOff, Copy, Trash,CircleArrowOutUpRight } from 'lucide-react'
import { useAuth } from '../../../../context/AuthContext'


export const PasswordList = ({ passwords = [], onRefresh }) => {
    const [visiblePasswords, setVisiblePasswords] = useState({})
    const { user } = useAuth()

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            // Burada bir toast notification gösterilebilir
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    if (!Array.isArray(passwords)) {
        return <div>No passwords found</div>
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this password?')) return

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/item/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.ok) {
                onRefresh()
            }
        } catch (error) {
            console.error('Error deleting password:', error)
        }
    }

    return (
        <div className="grid gap-4">
            {passwords.map(password => (
                <div key={password.id} className="bg-[#242427] p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-200">{password.name}</h3>
                            <p className="text-gray-400 text-sm">{password.username}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => togglePasswordVisibility(password.id)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                {visiblePasswords[password.id] ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>

                            <a
                                href={password.url}
                                target='_blank'
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <CircleArrowOutUpRight size={20} />
                            </a>
                            
                            <button
                                onClick={() => copyToClipboard(password.passwords)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <Copy size={20} />
                            </button>
                            
                            <button
                                onClick={() => handleDelete(password.id)}
                                className="text-red-400 hover:text-red-500"
                            >
                                <Trash size={20} />
                            </button>
                        </div>
                    </div>

                    {visiblePasswords[password.id] && (
                        <div className="mt-2 p-2 bg-[#18181B] rounded">
                            <p className="text-gray-200 font-mono">{password.passwords}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}