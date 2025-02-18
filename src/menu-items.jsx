// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Person2Icon from '@mui/icons-material/Person2';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import CampaignIcon from '@mui/icons-material/Campaign';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeIcon: HomeIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  LocalShippingIcon: LocalShippingIcon,
  Person2Icon: Person2Icon,
  ContactEmergencyIcon: ContactEmergencyIcon,
  CalendarMonthIcon: CalendarMonthIcon,
  BookOnlineIcon: BookOnlineIcon,
  BuildIcon: BuildIcon,
  InventoryIcon: InventoryIcon,
  LocalGasStationIcon: LocalGasStationIcon,
  CampaignIcon: CampaignIcon,
  AttachMoneyIcon: AttachMoneyIcon,
  VerifiedUserIcon: VerifiedUserIcon
};

export default {
  items: [
    {
      id: 'navigation',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeIcon'],
          url: '/dashboard/default'
        },
        {
          id: 'availability',
          title: 'Availability',
          type: 'item',
          icon: icons['CalendarMonthIcon'],
          url: '/vehicleavailability'
        },
        {
          id: 'vehicle',
          title: 'Vehicles',
          type: 'collapse',
          icon: icons['LocalShippingIcon'],
          children: [
            {
              id: 'vehicles',
              title: 'Vehicle List',
              type: 'item',
              url: '/vehicles'
            },
            {
              id: 'vehiclegroup',
              title: 'Vehicle Group',
              type: 'item',
              url: '/vehiclegroup'
            }
          ]
        },
        {
          id: 'drivers',
          title: 'Drivers',
          type: 'item',
          url: '/drivers',
          icon: icons['ContactEmergencyIcon']
        },
        {
          id: 'booking',
          title: 'Bookings',
          type: 'item',
          url: '/booking',
          icon: icons['BookOnlineIcon']
        },
        {
          id: 'customer',
          title: 'Customer',
          type: 'item',
          url: '/customer',
          icon: icons['Person2Icon']
        },
        {
          id: 'maintenance',
          title: 'Maintenance',
          type: 'item',
          url: '/maintenance',
          icon: icons['BuildIcon']
        },
        {
          id: 'partsinventory',
          title: 'Parts Inventory',
          type: 'item',
          url: '/partsinventory',
          icon: icons['InventoryIcon']
        },
        {
          id: 'fuel',
          title: 'Fuel',
          type: 'item',
          url: '/fuel',
          icon: icons['LocalGasStationIcon']
        },
        {
          id: 'reminder',
          title: 'Reminder',
          type: 'item',
          url: '/reminder',
          icon: icons['CampaignIcon']
        },
        {
          id: 'finance',
          title: 'Income & Expense',
          type: 'item',
          url: '/finance',
          icon: icons['AttachMoneyIcon']
        },
        {
          id: 'users',
          title: 'User Management',
          type: 'item',
          url: '/users',
          icon: icons['VerifiedUserIcon']
        },
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: icons['SecurityOutlinedIcon'],
          children: [
            {
              id: 'login-1',
              title: 'Login',
              type: 'item',
              url: '/login',
              target: true
            },
            {
              id: 'register',
              title: 'Register',
              type: 'item',
              url: '/register',
              target: true
            }
          ]
        }
      ]
    }
  ]
};
