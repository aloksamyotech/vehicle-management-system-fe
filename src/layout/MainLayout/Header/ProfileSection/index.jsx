import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Fade, Button, ClickAwayListener, Paper, Popper, List, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import { text } from 'common/constant';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ProfileSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const logout = () => {
    setOpen(false); 
    localStorage.clear();
    toast.success(t('text.LOGOUT_SUCCESS'));
    navigate('/login');
  };

  const profile = () => {
    setOpen(false); 
    navigate('/profile');
  }

  return (
    <>
      <Button sx={{ minWidth: { sm: 50, xs: 35 } }} ref={anchorRef} onClick={handleToggle} color="inherit">
        <AccountCircleTwoToneIcon sx={{ fontSize: '1.5rem' }} />
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  <ListItemButton onClick={profile}>
                    <ListItemIcon>
                      <SettingsTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('text.SETTINGS')} />
                  </ListItemButton>
                  <ListItemButton onClick={profile}>
                    <ListItemIcon>
                      <PersonTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('text.PROFILE')} />
                  </ListItemButton>
                  <ListItemButton onClick={logout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('text.LOGOUT')} />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
