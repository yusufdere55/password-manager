import { Menu, Transition } from "@headlessui/react"
import { useAuth } from "../../context/AuthContext";
import { Fragment } from "react"
import { NavLink, Outlet } from "react-router";

//Icons
import { FaUnlockAlt } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { TbPasswordFingerprint } from "react-icons/tb";
import { BiSolidCategory } from "react-icons/bi";
import { dashboardRoutes } from "./routes";

export const Dashboard = () => {
    const { user, logout } = useAuth()

    const capitalize = (str) => {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    const sliceDashboard = dashboardRoutes.slice(0,3);

    return (
        <div className="min-h-screen w-full flex relative">
            {/* Sol Panel - Sticky */}
            <div className="w-1/6 sticky top-0 h-screen flex flex-col py-2 justify-between items-center">
                <div className="w-full">
                    <div className="font-semibold flex flex-row text-gray-300 pl-6 border-b-[#242427] border-b justify-start items-center h-16 gap-3 text-xl">
                        <FaUnlockAlt size={20}/>
                        <h4>My-Accounts</h4>
                    </div>
                    <div className="flex flex-col gap-2 justify-start px-4 py-4 items-center">
                        {sliceDashboard.map((route) => (
                            <NavLink
                                key={route.path}
                                to={route.path}
                                end
                                className={({ isActive }) => `
                                    flex flex-row rounded-xl text-gray-300 gap-2 items-center 
                                    justify-start text-base font-semibold p-2 w-full 
                                    hover:bg-white/10 
                                    ${isActive ? 'bg-white/10' : ''}
                                `}
                            >
                                <route.icon />
                                <h4>{route.name}</h4>
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="w-full px-2">
                    <Menu as="div" className="relative w-full">
                        <Menu.Button className="w-full focus:outline-0 ">
                            <div className="flex flex-row rounded-xl justify-between items-center p-4 px-6 hover:bg-[#242427] transition-colors">
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-row justify-start gap-1 truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                                            <p className="text-gray-200 text-base">{capitalize(user?.name)}</p>
                                            <p className="text-gray-200 text-base">{capitalize(user?.surname)}</p>
                                        </div>
                                        
                                    </div>
                                    <div className="block truncate text-xs/5 font-normal text-left text-zinc-500 dark:text-zinc-400">
                                        {user?.email}
                                    </div>
                                </div>

                                <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                            </div>
                        </Menu.Button>
                        
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute bottom-full left-0 w-full mb-1 origin-bottom-right bg-[#18181B] border border-[#242427] divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <NavLink
                                                className={`${
                                                    active ? 'bg-[#242427]' : ''
                                                } group cursor-pointer flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200`}
                                                to={"/dashboard/profile"}
                                            >
                                                Profile
                                            </NavLink>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active ? 'bg-[#242427]' : ''
                                                } group cursor-pointer flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200`}
                                                onClick={() => navigate('/settings')}
                                            >
                                                Settings
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active ? 'bg-[#242427]' : ''
                                                } group cursor-pointer flex w-full items-center rounded-md px-2 py-2 text-sm text-red-500`}
                                                onClick={logout}
                                            >
                                                Logout
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            {/* Sağ Panel - Scrollable */}
            <div className="w-5/6 min-h-screen pr-4 overflow-y-auto  ">
                <div className="py-4 h-full">
                    <div className="rounded-lg min-h-screen bg-[#18181B] border border-[#242427] p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}