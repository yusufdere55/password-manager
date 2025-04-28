import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'

export const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalPasswords: 0,
        totalCategories: 0,
        recentPasswords: []
    })
    const { user } = useAuth()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [passwordsResponse, categoriesResponse] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/item/${user.id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/category`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                ])
                
                const passwordsData = await passwordsResponse.json()
                const categoriesData = await categoriesResponse.json()

                setStats({
                    totalPasswords: Array.isArray(passwordsData) ? passwordsData.length : 0,
                    totalCategories: Array.isArray(categoriesData) ? categoriesData.length : 0,
                    recentPasswords: Array.isArray(passwordsData) ? passwordsData.slice(0, 5) : []
                })
            } catch (error) {
                console.error('Stats fetch error:', error)
            }
        }

        if (user?.id) {
            fetchStats()
        }
    }, [user?.id])

    return (
        <div className="space-y-6">
            <title>Dasboard</title>
            <h1 className="text-2xl font-bold text-gray-200 mb-4">Dashboard Overview</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#242427] p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Total Passwords</h3>
                    <p className="text-2xl font-bold text-gray-200">{stats.totalPasswords}</p>
                </div>
                <div className="bg-[#242427] p-4 rounded-lg">
                    <h3 className="text-gray-400 text-sm">Total Categories</h3>
                    <p className="text-2xl font-bold text-gray-200">{stats.totalCategories}</p>
                </div>
            </div>

            {/* Recent Passwords */}
            <div className="bg-[#242427] p-4 rounded-lg">
                <h3 className="text-gray-200 font-semibold mb-4">Recent Passwords</h3>
                <div className="space-y-2">
                    {stats.recentPasswords.map(password => (
                        <div key={password.id} className="flex items-center justify-between p-2 hover:bg-[#18181B] rounded">
                            <div className="flex items-center gap-2">
                                {password.icon && <img src={password.icon} alt="" className="w-6 h-6" />}
                                <span className="text-gray-200">{password.name}</span>
                            </div>
                            <span className="text-gray-400 text-sm">{password.username}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}