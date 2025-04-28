import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../../../../context/AuthContext'


export const CreatePasswordModal = ({ onClose, onSuccess }) => {
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '', 
        password: '',
        icon:'',
        url: '',
        categoryId: ''
    })
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

     // Kategorileri yükle
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/category`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    setCategories(Array.isArray(data) ? data : [])
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }

        fetchCategories()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/item/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    passwords: formData.password,
                    url: formData.url,
                    icon: formData.icon,
                    categoryId: parseInt(formData.categoryId)
                })
            })
    
            if (!response.ok) {
                throw new Error('Failed to create password')
            }
    
            onSuccess()
        } catch (error) {
            console.error('Error creating password:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#242427] rounded-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-200">Add New Password</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-[#18181B] text-gray-200 rounded-lg p-2 mt-1"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full bg-[#18181B] text-gray-200 rounded-lg p-2 mt-1"
                            
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-[#18181B] text-gray-200 rounded-lg p-2 mt-1"
                            
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full bg-[#18181B] text-gray-200 rounded-lg p-2 mt-1"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Website URL (optional)</label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                            className="w-full bg-[#18181B] text-gray-200 rounded-lg p-2 mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Icon URL</label>
                        <input
                            type="url"
                            value={formData.icon}
                            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                            className="w-full bg-[#18181B] text-gray-200 rounded-lg p-2 mt-1"
                            placeholder="https://example.com/icon.png"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Category</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                            className="w-full bg-[#18181B] text-gray-200 rounded-lg p-2 cursor-pointer mt-1 focus:outline-0"
                        >
                            <option value="" className='cursor-pointer'>Select a category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id} className='cursor-pointer'>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}