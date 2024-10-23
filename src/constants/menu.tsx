import CalIcon from '@/icons/cal-icon'
import ChatIcon from '@/icons/chat-icon'
import { FileIcon } from '@/icons/content-icon'
import DashboardIcon from '@/icons/dashboard-icon'
import { DepositIcon } from '@/icons/deposit-icon'
import EmailIcon from '@/icons/email-icon'
import HelpDeskIcon from '@/icons/help-desk-icon'
import IntegrationsIcon from '@/icons/integrations-icon'
import { InvestmentIcon } from '@/icons/investment-icon'
import { MenuIcon } from '@/icons/menu-dashboard'
import { OurPlansIcon } from '@/icons/Ourplans-icon'
import { MyProfileIcon } from '@/icons/profile-icon'
import SettingsIcon from '@/icons/settings-icon'
import StarIcon from '@/icons/star-icon'
import TimerIcon from '@/icons/timer-icon'
import {TransactionsIcon}  from '@/icons/transactions-icon'
import { VerificationIcon } from '@/icons/verification-icon'
import { WithdrawalIcon } from '@/icons/withdrawal-icon'

type SIDE_BAR_MENU_PROPS = {
  label: string
  icon: JSX.Element
  path: string
}

export const SIDE_BAR_MENU:  SIDE_BAR_MENU_PROPS[] = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon/>,
    path: 'dashboard',
  },
  {
    label: 'Transaction',
    icon: <TransactionsIcon />,
    path: 'transaction',
  },
  {
    label: 'Investments',
    icon: <InvestmentIcon />,
    path: 'investments',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: 'settings',
  },
  {
    label: 'Profile',
    icon: <MyProfileIcon />,
    path: 'profile',
  },
  {
    label: 'Our Plans',
    icon: <OurPlansIcon />,
    path: 'plans',
  },
  {
    label: 'Deposit',
    icon: <DepositIcon />,
    path: 'deposit',
  },
  {
    label: 'Withdraw',
    icon: <WithdrawalIcon />,
    path: 'withdraw',
  },
]


export const ADMIN_SIDE_BAR_MENU:  SIDE_BAR_MENU_PROPS[] = [
  {
    label: 'Dashboard',
    icon: <MenuIcon/>,
    path: 'admin/dashboard',
  },

  {
    label: 'Deposit',
    icon: <DepositIcon />,
    path: 'admin/deposit',
  },
  {
    label: 'Withdraw',
    icon: <WithdrawalIcon />,
    path: 'admin/withdraw',
  },

  {
    label: 'Transaction',
    icon: <TransactionsIcon />,
    path: 'admin/transaction',
  },
  {
    label: 'Investments',
    icon: <InvestmentIcon />,
    path: 'admin/investments',
  },
  {
    label: 'Manage Users',
    icon: <MyProfileIcon />,
    path: 'admin/users',
  },

  {
    label: 'Verification Center',
    icon: <VerificationIcon />,
    path: 'admin/verify',
  },
  
  {
    label: 'Currency',
    icon: <MyProfileIcon />,
    path: 'admin/profile',
  },
  {
    label: 'Investment Plans',
    icon: <OurPlansIcon />,
    path: 'admin/plans',
  },
  {
    label: 'Main Settings',
    icon: <SettingsIcon />,
    path: 'admin/settings',
  },


]


type TABS_MENU_PROPS = {
  label: string
  icon?: JSX.Element
}

export const TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'unread',
    icon: <EmailIcon />,
  },
  {
    label: 'all',
    icon: <EmailIcon />,
  },
  {
    label: 'expired',
    icon: <TimerIcon />,
  },
  {
    label: 'starred',
    icon: <StarIcon />,
  },
]

export const HELP_DESK_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'help desk',
  },
  {
    label: 'questions',
  },
]

export const APPOINTMENT_TABLE_HEADER = [
  'Name',
  'RequestedTime',
  'Added Time',
  'Domain',
]

export const EMAIL_MARKETING_HEADER = ['Id', 'Email', 'Answers', 'Domain']

export const BOT_TABS_MENU: TABS_MENU_PROPS[] = [
  {
    label: 'chat',
    icon: <ChatIcon />,
  },
  {
    label: 'helpdesk',
    icon: <HelpDeskIcon />,
  },
]