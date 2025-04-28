import { useState } from "react"

export const ForgotPassword = () => {
    const [email,setEmail] = useState('');
    const [loading , setLoading ] = useState(false)
    const [message, setMessage ] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        setError(null)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email})
            })

            const data = await response.json()

            if(response.ok)
                setMessage(data.message)
            else
                setError(data.message)
        } catch (error) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen p-2">
            <title>Forgot Password</title>
            <div className="flex rounded-xl min-h-full bg-[#18181B] flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-200">
                        Şifremi Unuttum
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Email adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                    </p>
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
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-200">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Giriş yapmak için{' '}
                        <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            buraya tıklayın
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}