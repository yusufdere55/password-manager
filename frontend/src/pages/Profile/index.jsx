import PhoneInput from "react-phone-input-2"
import 'react-phone-input-2/lib/style.css';
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { capitalize } from "../../utils/Capitalize";

export const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [ isActive, setIsActive ] = useState(null);
    const [ isAdmin, setIsAdmin] = useState(false);

    const [notification, setNotification] = useState({ type: '', message: '' });
    const [showNotification, setShowNotification] = useState(false);

    // Notification gösterme fonksiyonu
    const showNotificationMessage = (type, message) => {
        setNotification({ type, message });
        setShowNotification(true);
        // 3 saniye sonra notification'ı kaldır
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };
    
    useEffect(() => {
        // user verisi geldiğinde form alanlarını doldur
        if (user) {
            setFormData({
                firstName: capitalize(user.name) || '',
                lastName: capitalize(user.surname) || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }

        setIsActive(user.isActive || false); // varsayılan değer ekle
        setIsAdmin(user.isAdmin || false);
    }, [user]); // user değiştiğinde effect'i tekrar çalıştır

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.firstName.toLowerCase(),
                    surname: formData.lastName.toLowerCase(),
                    email: formData.email,
                    phone: formData.phone,
                })
            });

            const data = await response.json();

            if (response.ok) {
                showNotificationMessage('success', 'Profile updated successfully');
                // User state'ini güncelle
                updateUser({
                    ...user,
                    name: formData.firstName.toLowerCase(),
                    surname: formData.lastName.toLowerCase(),
                    email: formData.email,
                    phone: formData.phone,
                    isActive: isActive
                });
            } else {
                showNotificationMessage('error', data.message || 'Update failed');
            }
        } catch (error) {
            showNotificationMessage('error', 'An error occurred');
        }finally{
            setLoading(false)
        }
    }

    const handlePassiveAccount = async (e) => {
        e.preventDefault()
        
        // Kullanıcıya onay sor
        if (!confirm('Hesabınızı dondurmak istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ isActive : false})
            })

            const data = await  response.json()

            if(response.ok){
                showNotificationMessage('success', data.message || 'Hesap pasive alındı.');
                logout()
            }
            else    
                showNotificationMessage('error', data.message || 'Update failed');

        } catch (error) {
            showNotificationMessage('error', data.message || 'An error occurred');
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        
        // Kullanıcıya onay sor
        if (!confirm('Hesabınızı silmek istediğinizden emin misiniz?')) {
            return;
        }
        
        setLoading(true);
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/delete-account/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            const data = await response.json();
    
            if (response.ok) {
                showNotificationMessage('success', 'Hesap başarıyla silindi');
                setTimeout(() => {
                    logout();
                }, 2000);
            } else {
                showNotificationMessage('error', data.message || 'Hesap silme işlemi başarısız');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            showNotificationMessage('error', 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <title>Profile</title>
            {/* Notification Component */}
            {showNotification && (
                <div 
                    className={`
                        fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 
                        ${notification.type === 'success' ? 'bg-green-500/10 border border-green-500 text-green-500' : 'bg-red-500/10 border border-red-500 text-red-500'}
                    `}
                >
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-200 mb-4">Profile</h1>
                    {isAdmin && (
                        <h3 className="text-gray-200 text-base mt-[-1rem] px-3 py-2 font-semibold bg-gray-700 rounded">Admin</h3>
                    )}
                </div>

                <div className="border-b border-gray-900/10 pb-12 px-64">
                    <h2 className="text-base/7 font-semibold text-gray-300">Personal Information</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-300">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="first-name"
                                    name="first-name"
                                    type="text"
                                    value={capitalize(formData.firstName)}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full text-gray-200 bg-black/30 rounded-lg p-2 mt-1 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-300">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="last-name"
                                    name="last-name"
                                    type="text"
                                    value={capitalize(formData.lastName)}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full text-gray-200 bg-black/30 rounded-lg p-2 mt-1 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full text-gray-200 bg-black/30 rounded-lg p-2 mt-1 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-300">
                                Phone number
                            </label>
                            <div className="mt-2">
                                <PhoneInput
                                    country={'tr'}
                                    inputProps={{
                                        id: 'phone',
                                        name: 'phone',
                                    }}
                                    value={formData.phone}
                                    onChange={(phone) => setFormData({...formData, phone: phone})}
                                    inputClass="w-full text-gray-200 bg-black/30 rounded-lg py-5 mt-1 focus:outline-none"
                                    buttonClass="!bg-black/30 !border-0"
                                    dropdownClass="!bg-gray-800 !text-gray-200"
                                    containerClass="!bg-transparent"
                                    searchClass="!bg-gray-800 !text-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end px-64">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
                <div className="flex mt-4 justify-end items-center ">
                    <button onClick={handlePassiveAccount} className="bg-orange-700 m-auto py-2 px-4 rounded  cursor-pointer">
                        Hesabı dondur
                    </button>
                </div>
            </form>
            <button 
                onClick={handleDelete} 
                disabled={loading}
                className="absolute right-10 bottom-10 text-white/40 cursor-pointer hover:text-white transition-all disabled:opacity-50"
            >
                {loading ? 'Siliniyor...' : 'Hesabı Sil!'}
            </button>
        </div>
    )
}