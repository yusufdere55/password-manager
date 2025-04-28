import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export const Register = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [name,setName] = useState('')
    const [surname,setSurname] = useState('')
    const [phone,setPhone] = useState('')
    const { register, loading } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await register({email,password,name,surname,phone})
        if(success)
            navigate('/login')
    }

    return (
        <div className="p-2 h-screen">
            <title>Register</title>
            <div className="flex rounded-xl min-h-full bg-[#18181B] flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-200">Create your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-row justify-between gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm/6 font-medium text-gray-200">Name</label>
                        <div className="mt-2">
                            <input 
                                type="text" 
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                                className="block w-full rounded-md bg-[#242427] px-3 py-1.5 text-base text-gray-200 outline-1 -outline-offset-1 outline-[#242427] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="surname" className="block text-sm/6 font-medium text-gray-200">Surname</label>
                        <div className="mt-2">
                            <input 
                                type="text" 
                                id="surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required 
                                className="block w-full rounded-md bg-[#242427] px-3 py-1.5 text-base text-gray-200 outline-1 -outline-offset-1 outline-[#242427] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-200">Email address</label>
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
                        <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-200">Phone</label>
                        <div className="mt-2">
                            <input 
                                type="tel" 
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required 
                                className="block w-full rounded-md bg-[#242427] px-3 py-1.5 text-base text-gray-200 outline-1 -outline-offset-1 outline-[#242427] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-200">Password</label>
                        </div>
                        <div className="mt-2">
                            <input 
                                type="password" 
                                id="password"
                                autoComplete="false"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className="block w-full rounded-md bg-[#242427] px-3 py-1.5 text-base text-gray-200 outline-1 -outline-offset-1 outline-[#242427] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex w-full justify-center cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {loading ? 'Registering in...' : 'Register'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Are you a member? 
                    <a href="/Login" className="font-semibold text-indigo-600 hover:text-indigo-500"> Go to login</a>
                </p>
            </div>
            </div>
        </div>
    )
}