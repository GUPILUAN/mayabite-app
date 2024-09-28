import { API_URL } from "@env";

export const apiMayabite = API_URL;

import pizzaImagen from "../assets/images/categories/Pizza.png";
import hamburguesaImagen from "../assets/images/categories/Hamburguesas.png";
import asiaticaImagen from "../assets/images/categories/Asiática.png";
import bebidasImagen from "../assets/images/categories/Bebidas.png";
import postresImagen from "../assets/images/categories/Postres.png";
import pastaImagen from "../assets/images/categories/Pasta.png";
import mariscosImagen from "../assets/images/categories/Mariscos.png";
import axios from "axios";

// Importa todas las imágenes necesarias

const imageMap = {
  Pizza: pizzaImagen,
  Hamburguesas: hamburguesaImagen,
  Asiática: asiaticaImagen,
  Bebidas: bebidasImagen,
  Postres: postresImagen,
  Pasta: pastaImagen,
  Mariscos: mariscosImagen,
};

export const loginUser = async (data, isResetting, isLogin) => {
  try {
    const url = isResetting
      ? `${apiMayabite}/user/reset_request`
      : isLogin
        ? `${apiMayabite}/user/login`
        : `${apiMayabite}/user/register`;

    const response = await axios.post(url, {
      email: data.email,
      ...(isResetting ? {} : { password: data.password }),
      ...(isLogin ? {} : { username: data.username }), // Solo para el registro
      ...(isLogin ? {} : { phone: data.phone }), // Solo para el registro
    });

    return response;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else if (error.request) {
      return { message: "No se recibió respuesta del servidor" };
    } else {
      return { message: "Error al hacer la solicitud" };
    }
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${apiMayabite}/category/getall`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const manipulatedData = data.map((categorie) => ({
      ...categorie,
      image: imageMap[categorie.name] || null,
    }));
    return manipulatedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getCategoriesStore = async (isStore) => {
  try {
    const response = await fetch(`${apiMayabite}/category/get/${isStore}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const manipulatedData = data.map((categorie) => ({
      ...categorie,
      image: imageMap[categorie.name] || null,
    }));
    return manipulatedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getStores = async () => {
  try {
    const response = await fetch(`${apiMayabite}/store/getall`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getStore = async (store_id) => {
  try {
    const response = await fetch(`${apiMayabite}/store/${store_id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getProduct = async (product_id) => {
  try {
    const response = await fetch(`${apiMayabite}/product/${product_id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getProducts = async (store_id) => {
  try {
    const response = await fetch(`${apiMayabite}/product/getfrom/${store_id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getFeatured = async () => {
  try {
    const response = await fetch(`${apiMayabite}/featured/getfrom/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
