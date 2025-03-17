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
  }
});
