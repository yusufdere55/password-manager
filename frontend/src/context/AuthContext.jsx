import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    setUser({
                        ...data.user,
                        isActive: data.user.isActive // Ekle
                    })
                } else {
                    localStorage.removeItem('token')
                    setUser(null)
                }
            } catch (error) {
                console.error('Auth check error:', error)
                localStorage.removeItem('token')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])
    const updateUser = (userData) => {
        setUser(userData);
    };
    const login = async (email, password) => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`,{
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify({email, password})
            })

            const data = await response.json()
            if(response.ok) {
                setUser({...data.user,isActive: data.user.isActive})
                localStorage.setItem('token',data.token)
                return true
            }
            return false
        } catch (error) {
            console.error('Login eroor:', error)
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    const register = async ({email,password,name,surname,phone}) => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify({email,password,name,surname,phone})
            })

            if(response.ok)
                return true
            return false
        } catch (error) {
            console.error('Register error:' ,error)
            return false
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        updateUser
    }

    return(
        <AuthContext.Provider value={value}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context)
        throw new Error('useAuth must be used within an AuthProvider')
    return context
}