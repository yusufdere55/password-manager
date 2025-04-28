import { DashboardHome } from './pages/DashboardHome'
import { Passwords } from './pages/Passwords'
import { Categories } from './pages/Categories'

//Icons
import { BiSolidCategory } from 'react-icons/bi'
import { TbLayoutDashboardFilled, TbPasswordFingerprint } from 'react-icons/tb'
import { Profile } from '../Profile'
import { CgProfile } from 'react-icons/cg'

export const dashboardRoutes = [
    {
        path:'',
        element: <DashboardHome />,
        name:'Dashboard',
        icon:TbLayoutDashboardFilled
    },
    {
        path:'passwords',
        element: <Passwords />,
        name:'Passwords',
        icon:TbPasswordFingerprint,
    },
    {
        path:'categories',
        element: <Categories />,
        name:'Category',
        icon:BiSolidCategory
    },
    {
        path:'profile',
        element: <Profile />,
        name:'Profile',
        icon:CgProfile
    }
]