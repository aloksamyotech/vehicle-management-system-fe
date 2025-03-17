const baseUrl = 'http://localhost:3000';
const image_url = 'http://localhost:3000';
// let baseUrl = 'http://165.22.218.55:7200/api/'
export const urls = Object.freeze({
  baseUrl,
  vehicleGroup: {
    create: baseUrl + '/vehicle-group/save',
    get: baseUrl + '/vehicle-group/fetch',
    getById: baseUrl + '/vehicle-group/getById/:id',
    update: baseUrl + '/vehicle-group/update/:id',
    delete: baseUrl + '/vehicle-group/delete/:id'
  },
  vehicle: {
    create: baseUrl + '/vehicle/save',
    get: baseUrl + '/vehicle/fetch',
    getById: baseUrl + '/vehicle/getById/:id',
    update: baseUrl + '/vehicle/update/:id',
    delete: baseUrl + '/vehicle/delete/:id',
    image: image_url
  }
});
