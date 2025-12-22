const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:11337';

const buildUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

export const toAbsoluteUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

const handleResponse = async (response) => {
  if (response.ok) return response.json();
  let message = `${response.status} ${response.statusText}`;
  try {
    const payload = await response.json();
    message = payload?.error?.message || message;
  } catch (err) {
    // Ignore JSON parsing errors and fall back to status text.
  }
  const error = new Error(message);
  error.status = response.status;
  throw error;
};

export const apiGet = async (path) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: 'application/json',
    },
  });
  return handleResponse(response);
};

export const apiPut = async (path, body) => {
  const response = await fetch(buildUrl(path), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  return handleResponse(response);
};

export const apiUploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  const response = await fetch(buildUrl('/api/upload'), {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
};

export const normalizeActivity = (item) => {
  if (!item) return null;
  if (item.attributes) {
    return { id: item.id, ...item.attributes };
  }
  return item;
};
