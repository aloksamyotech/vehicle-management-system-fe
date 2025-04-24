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
import SummarizeIcon from '@mui/icons-material/Summarize';
import i18n from 'i18n';

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
  VerifiedUserIcon: VerifiedUserIcon,
  SummarizeIcon: SummarizeIcon
};

const data = JSON.parse(localStorage.getItem('user'));
const permissions = JSON.parse(localStorage.getItem('permissions'));

export const dashboard = {
  title: i18n.t('Dashboard-Menu'),

  items: [
    {
      id: 'navigation',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'DASHBOARD_READ',
          title: i18n.t('DASHBOARD'),
          type: 'item',
          icon: icons['HomeIcon'],
          url: '/dashboard/default'
        },
        {
          id: 'AVAILABILITY_READ',
          title: i18n.t('Availability'),
          type: 'item',
          icon: icons['CalendarMonthIcon'],
          url: '/vehicleavailability'
        },
        {
          id: 'VEHICLES_READ',
          title: i18n.t('Vehicles'),
          type: 'collapse',
          icon: icons['LocalShippingIcon'],
          children: [
            {
              id: 'VEHICLES_READ',
              title: i18n.t('Vehicle List'),
              type: 'item',
              url: '/vehicles'
            },
            {
              id: 'VEHICLES_READ',
              title: i18n.t('Vehicle Group'),
              type: 'item',
              url: '/vehiclegroup'
            }
          ]
        },
        {
          id: 'DRIVERS_READ',
          title: i18n.t('Drivers'),
          type: 'item',
          url: '/drivers',
          icon: icons['ContactEmergencyIcon']
        },
        {
          id: 'BOOKINGS_READ',
          title: i18n.t('Bookings'),
          type: 'item',
          url: '/booking',
          icon: icons['BookOnlineIcon']
        },
        {
          id: 'CUSTOMER_READ',
          title: i18n.t('Customer'),
          type: 'item',
          url: '/customer',
          icon: icons['Person2Icon']
        },
        {
          id: 'MAINTENANCE_READ',
          title: i18n.t('Maintenance'),
          type: 'item',
          url: '/maintenance',
          icon: icons['BuildIcon']
        },
        {
          id: 'PARTS_INVENTORY_READ',
          title: i18n.t('Parts Inventory'),
          type: 'item',
          url: '/partsinventory',
          icon: icons['InventoryIcon']
        },
        {
          id: 'FUEL_READ',
          title: i18n.t('Fuel'),
          type: 'item',
          url: '/fuel',
          icon: icons['LocalGasStationIcon']
        },
        {
          id: 'VEHICLE_BREAKDOWN',
          title: i18n.t('Vehicle Breakdown'),
          type: 'item',
          url: '/breakdown',
          icon: icons['CampaignIcon']
        },
        {
          id: 'REMINDER_READ',
          title: i18n.t('Reminder'),
          type: 'item',
          url: '/reminder',
          icon: icons['CampaignIcon']
        },
        {
          id: 'INCOME_EXPENSE_READ',
          title: i18n.t('Income & Expense'),
          type: 'item',
          url: '/finance',
          icon: icons['AttachMoneyIcon']
        },
        {
          id: 'DRIVER_ALERT',
          title: i18n.t('Driver Alert'),
          type: 'item',
          url: '/driver-alert',
          icon: icons['CampaignIcon']
        },
        {
          id: 'REPORTS_READ',
          title: i18n.t('Reports'),
          type: 'item',
          url: '/reports',
          icon: icons['SummarizeIcon']
        },
        {
          id: 'USERS',
          title: i18n.t('User Management'),
          type: 'item',
          url: '/users',
          icon: icons['VerifiedUserIcon']
        }
      ]
    }
  ]
};


export const filterMenuItems = (menuItems, permissions) => {
  if (!Array.isArray(menuItems)) return [];

  return menuItems
    .map((item) => {
      if (item.type === 'item') {
        const hasPermission = permissions.some((perm) => perm.startsWith(item.id));
        return hasPermission ? item : null;
      }

      if (item.children) {
        const filteredChildren = filterMenuItems(item.children, permissions);
        if (filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren
          };
        }
      }

      return null;
    })
    .filter(Boolean);
};

let finalMenu = [];

if (data?.role === 'ADMIN') {
  finalMenu = dashboard;
} else if (data?.role === 'USER') {
  finalMenu = {
    ...dashboard,
    items: dashboard.items.map((group) => ({
      ...group,
      children: filterMenuItems(group.children, permissions)
    }))
  };
}

export default finalMenu;
