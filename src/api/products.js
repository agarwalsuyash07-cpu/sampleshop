import axios from "axios"; //imports http client
export const getProducts = async () => { //async function to get products from fake store api
  const res = await axios.get("https://fakestoreapi.com/products"); //makes get request to api, responds with json data, axios wraps up the data
  return res.data; //returns only the data portion of the response
};
