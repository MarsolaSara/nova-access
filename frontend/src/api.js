// Cookies HTTP-only guardam a sessão; o React nunca armazena a senha.
async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      credentials: 'same-origin',
      cache: 'no-store',
      ...options,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o Spring Boot está aberto.');
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || 'Não foi possível concluir a operação.');
    error.status = response.status;
    throw error;
  }
  return data;
}

async function csrfToken() {
  const data = await request('/api/auth/csrf');
  return data.token;
}

export async function currentUser() {
  try {
    return await request('/api/auth/me');
  } catch (error) {
    if (error.status === 401) return null;
    throw error;
  }
}

export async function login(email, password) {
  const token = await csrfToken();
  return request('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-CSRF-TOKEN': token,
    },
    body: new URLSearchParams({ username: email.trim(), password }),
  });
}

export async function logout() {
  const token = await csrfToken();
  await request('/api/auth/logout', {
    method: 'POST',
    headers: { 'X-CSRF-TOKEN': token },
  });
}
