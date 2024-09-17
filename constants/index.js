import { API_URL } from "@env";

export const apiMayabite = API_URL;

import pizzaImagen from "../assets/images/categories/pizza.png";
import hamburguesaImagen from "../assets/images/categories/hamburguesa.png";
import asiaticaImagen from "../assets/images/categories/asiatica.png";
import bebidasImagen from "../assets/images/categories/bebidas.png";
import postresImagen from "../assets/images/categories/postres.png";
import pastaImagen from "../assets/images/categories/pasta.png";
import mariscosImagen from "../assets/images/categories/mariscos.png";

// Importa todas las imágenes necesarias

const imageMap = {
  pizza: pizzaImagen,
  hamburguesa: hamburguesaImagen,
  asiatica: asiaticaImagen,
  bebidas: bebidasImagen,
  postres: postresImagen,
  pasta: pastaImagen,
  mariscos: mariscosImagen,
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
