import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 34,
  height: 20,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 22
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(14px)'
    }
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(14px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#30aa4c'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: theme.transitions.create(['width'], {
      duration: 200
    })
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor: '#dc3545',
    boxSizing: 'border-box'
  }
}));

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <AntSwitch
      checked={checked}
      onChange={onChange}
      icon={<CancelIcon style={{ color: 'white', fontSize: 16 }} />}
      checkedIcon={<CheckCircleIcon style={{ color: 'white', fontSize: 16 }} />}
    />
  );
};

export default ToggleSwitch;
