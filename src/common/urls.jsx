const baseUrl = import.meta.env.VITE_API_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

export const urls = Object.freeze({
  baseUrl,
  vehicleGroup: {
    create: `${baseUrl}/vehicle-group/save`,
    get: `${baseUrl}/vehicle-group/fetch`,
    getById: `${baseUrl}/vehicle-group/getById/:id`,
    update: `${baseUrl}/vehicle-group/update/:id`,
    delete: `${baseUrl}/vehicle-group/delete/:id`
  },
  vehicle: {
    create: `${baseUrl}/vehicle/save`,
    get: `${baseUrl}/vehicle/fetch`,
    getById: `${baseUrl}/vehicle/getById/:id`,
    update: `${baseUrl}/vehicle/update/:id`,
    delete: `${baseUrl}/vehicle/delete/:id`,
    image: imageUrl
  },
  customer: {
    create: `${baseUrl}/customer/save`,
    get: `${baseUrl}/customer/fetch`,
    getById: `${baseUrl}/customer/getById/:id`,
    update: `${baseUrl}/customer/update/:id`,
    delete: `${baseUrl}/customer/delete/:id`,
  },
  driver: {
    create: `${baseUrl}/driver/save`,
    get: `${baseUrl}/driver/fetch`,
    getById: `${baseUrl}/driver/getById/:id`,
    update: `${baseUrl}/driver/update/:id`,
    delete: `${baseUrl}/driver/delete/:id`,
  },
  partsInventory: {
    create: `${baseUrl}/parts/save`,
    get: `${baseUrl}/parts/fetch`,
    getById: `${baseUrl}/parts/getById/:id`,
    update: `${baseUrl}/parts/update/:id`,
    delete: `${baseUrl}/parts/delete/:id`,
  },
  reminder: {
    create: `${baseUrl}/reminder/save`,
    get: `${baseUrl}/reminder/fetch`,
    getById: `${baseUrl}/reminder/getById/:id`,
    update: `${baseUrl}/reminder/update/:id`,
    delete: `${baseUrl}/reminder/delete/:id`,
  },
  fuel: {
    create: `${baseUrl}/fuel/save`,
    get: `${baseUrl}/fuel/fetch`,
    getById: `${baseUrl}/fuel/getById/:id`,
    update: `${baseUrl}/fuel/update/:id`,
    delete: `${baseUrl}/fuel/delete/:id`,
  },
  incomeExpense: {
    create: `${baseUrl}/income-expense/save`,
    get: `${baseUrl}/income-expense/fetch`,
    getById: `${baseUrl}/income-expense/getById/:id`,
    update: `${baseUrl}/income-expense/update/:id`,
    delete: `${baseUrl}/income-expense/delete/:id`,
  },
  maintenance: {
    create: `${baseUrl}/maintenance/save`,
    get: `${baseUrl}/maintenance/fetch`,
    getById: `${baseUrl}/maintenance/getById/:id`,
    updateStatus: `${baseUrl}/maintenance/updateStatus/:id`,
    delete: `${baseUrl}/maintenance/delete/:id`,
  },
  booking: {
    create: `${baseUrl}/booking/save`,
    get: `${baseUrl}/booking/fetch`,
    getById: `${baseUrl}/booking/getById/:id`,
    update: `${baseUrl}/booking/update/:id`,
    delete: `${baseUrl}/booking/delete/:id`,
  },
});
