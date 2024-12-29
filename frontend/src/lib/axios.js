// Axios is a popular JavaScript library
//  used for making HTTP requests
// from a web browser or Node. js.
// It simplifies the process of sending
// asynchronous HTTP requests to a server,
//  and also handles the response.


import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api/", // port on which the backend is running
    withCredentials: true, // to send cookies along with the request
});