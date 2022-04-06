import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    return axios.create({
      baseURL: "http://www.completamania.com.br/",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({ baseURL: "/" });
  }
};

export default buildClient;
