import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState('en');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng); 
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '10px', borderRadius: '8px' }}>
      <LanguageIcon sx={{ color: '#ffff' }} />
      <FormControl variant="outlined" size="small" sx={{ backgroundColor: 'white', borderRadius: '5px' }}>
        <Select
          value={lang} 
          onChange={(e) => changeLanguage(e.target.value)}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            '& .MuiSelect-icon': { color: 'black' },
            '& fieldset': { borderColor: 'gray' }
          }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="de">Deutsch</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSwitcher;
