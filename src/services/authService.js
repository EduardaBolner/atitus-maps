import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

function extractMessage(error, fallback) {
  if (error.response) {
    const data = error.response.data;
    return typeof data === 'string' && data.trim() ? data : fallback;
  }
  if (error.request) {
    return 'Servidor indisponível. Verifique sua conexão e tente novamente.';
  }
  return fallback;
}

export async function signIn(email, password) {
  try {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 401) {
      throw new Error('E-mail ou senha incorretos.');
    }
    throw new Error(extractMessage(error, 'Erro ao fazer login. Tente novamente.'));
  }
}

export async function signUp(name, email, password) {
  try {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Erro ao criar conta. Verifique os dados e tente novamente.'));
  }
}
