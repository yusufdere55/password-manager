import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { token } = useParams()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor')
            return
        }

        setLoading(true)
        setMessage(null)
        setError(null)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('Şifreniz başarıyla güncellendi')
                // Kullanıcıyı 3 saniye sonra login sayfasına yönlendir
                setTimeout(() => navigate('/login'), 3000)
            } else {
                setError(data.message)
            }
        } catch (error) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen p-2">
            <title>Reset Password</title>
            <div className="flex rounded-xl min-h-full bg-[#18181B] flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-200">
                        Yeni Şifre Belirle
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {message && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-500 rounded">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-200">
                                Yeni Şifre
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-[#242427] px-3 py-1.5 text-base text-gray-200 outline-1 -outline-offset-1 outline-[#242427] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-200">
                                Şifre Tekrar
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-[#242427] px-3 py-1.5 text-base text-gray-200 outline-1 -outline-offset-1 outline-[#242427] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}