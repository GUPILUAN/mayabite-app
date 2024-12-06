import axios from "axios";
import { deleteData, getData, saveData } from "./userKey";
import { jwtDecode } from "jwt-decode";
import { replace } from "./NavigationService";

export const apiMayabite = process.env.EXPO_PUBLIC_API_URL;
const api = axios.create({
  baseURL: apiMayabite,
});

api.interceptors.request.use(
  async (config) => {
    if (
      config.url === "/user/login" ||
      config.url === "/user/register" ||
      config.url === "/user/refresh"
    ) {
      return config;
    }
    let access_token = await getData("access_token");
    if (!access_token || isTokenExpired(access_token)) {
      try {
        access_token = await refreshToken("refresh_token");
      } catch (error) {
        await logOut(false);
        throw error;
      }
    }
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const isTokenExpired = (token) => {
  try {
    const payload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 30;
    return payload.exp - bufferTime < currentTime;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return true;
  }
};

export const refreshToken = async (refresh_token) => {
  try {
    const refresh = await getData(refresh_token);
    if (!refresh) {
      throw new Error("No refresh token found");
    }
    if (isTokenExpired(refresh)) {
      throw new Error("Refresh token expired");
    }

    const createNewRefreshToken =
      refresh_token === "biometrics_token" ? { refresh: true } : {};

    const response = await api.post("/user/refresh", createNewRefreshToken, {
      headers: {
        Authorization: `Bearer ${refresh}`,
      },
    });

    const { access_token, new_refresh_token } = response.data;

    if (access_token) {
      await saveData("access_token", access_token);
    }

    if (new_refresh_token) {
      await saveData("refresh_token", new_refresh_token);
    }

    return access_token;
  } catch (error) {
    console.log("Error al refrescar el token:", error.response);
    throw error;
  }
};

export const loginUser = async (data, isResetting, isLogin) => {
  try {
    const url = isResetting
      ? "/user/reset_request"
      : isLogin
        ? "/user/login"
        : "/user/register";

    const response = await api.post(url, {
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
export const logOut = async (userLogOut) => {
  try {
    replace("AuthLoading");
    await deleteData("access_token");
    await deleteData("refresh_token");

    if (userLogOut) {
      await deleteData("biometrics_token");
    }
    console.log("Sesión expirada, redirigiendo al login...");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export const retrieveData = async (route) => {
  try {
    const response = await api.get(route);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error, route);
    return null;
  }
};

export const postData = async (route, data) => {
  try {
    const response = await api.post(route, data);
    return response.data;
  } catch (error) {
    console.error("Error al enviar datos:", error, route);

    console.log(error.response.data);
    return error.response;
  }
};

export const putData = async (route, data) => {
  try {
    const response = await api.put(route, data);
    return response.data;
  } catch (error) {
    console.error("Error al enviar datos:", error, route);
    console.log(error.response.data);
    return error.response.data;
  }
};
