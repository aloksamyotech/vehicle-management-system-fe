export const fetchCurrencySymbol = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.currencySymbol;
  };