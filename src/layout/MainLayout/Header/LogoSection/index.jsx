import { useTheme } from '@mui/material/styles';
import { ButtonBase } from '@mui/material';
import LogoImage from 'assets/images/swift.png';

const LogoSection = () => {
  const theme = useTheme();

  return (
    <ButtonBase>
      <img
        alt="Company Logo"
        src={LogoImage}
        style={{ height: '50px', width: 'auto', objectFit: 'cover' }}
      />
    </ButtonBase>
  );
};

export default LogoSection;
