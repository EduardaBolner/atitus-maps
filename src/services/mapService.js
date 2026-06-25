import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/ws/point`;

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

export async function getPoints(token) {
  try {
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map(point => ({
      id: point.id,
      title: point.name,
      description: point.description,
      eventDate: point.eventDate,
      eventTime: point.eventTime,
      locationName: point.locationName,
      website: point.website,
      categories: point.categories,
      accessibility: point.accessibility,
      registrationType: point.registrationType,
      imageBase64: point.imageBase64,
      position: {
        lat: point.latitude,
        lng: point.longitude,
      },
    }));
  } catch (error) {
    throw new Error(extractMessage(error, 'Erro ao buscar eventos.'));
  }
}

export async function postPoint(token, pointData) {
  try {
    const response = await axios.post(BASE_URL, pointData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Erro ao cadastrar evento.'));
  }
}

export async function putPoint(token, id, pointData) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, pointData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Erro ao atualizar evento.'));
  }
}

export async function deletePoint(token, id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error(extractMessage(error, 'Erro ao remover evento.'));
  }
}
