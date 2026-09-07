import { test, expect } from '../../src/fixtures/test-fixtures';
import { env } from '../../src/config/env';
import { allure } from 'allure-playwright';
import type { LoginResponse } from './types';
// SEGUIVAR
import { ROLE_TOKENS } from './clients/ApiClient';
/**
 * Pruebas del endpoint de autenticación del API (Demo App local).
 */
test.describe('Auth API', () => {
  test.beforeEach(async () => {
    await allure.epic('API');
    await allure.feature('Autenticación');
  });

  test('login válido devuelve token y usuario', async ({ apiClient }) => {
    await allure.severity('critical');
    const response = await apiClient.login(
      env.credentials.username,
      env.credentials.password,
    );

    expect(response.status()).toBe(200);
    const body = (await response.json()) as LoginResponse;
    expect(body.token).toBeTruthy();
    expect(body.user.username).toBe(env.credentials.username);
  });

  test('login inválido devuelve 401', async ({ apiClient }) => {
    const response = await apiClient.login('admin', 'clave-incorrecta');
    expect(response.status()).toBe(401);
  });

  test('login sin campos devuelve 400', async ({ apiClient }) => {
    const response = await apiClient.login('', '');
    expect(response.status()).toBe(400);
  });
  // TC-AUTH-N01 — Sprint 1 — Prioridad: Alta  - Responsable: Seguivar
  // Precondición: store reiniciado (POST /api/test/reset).
  // Pasos: 1) POST /api/auth/login con username="Admin", password="admin123".
  // Resultado esperado: Status 401. El sistema no debe tratar "Admin" como
  // equivalente a "admin" (username case-sensitive).
  test('TC-AUTH-N01 login con username en mayúsculas no autentica (case-sensitive)', async ({ apiClient }) => {
    await allure.severity('normal');

    // Precondición: store reiniciado (evita interferencia de otros tests)
    await apiClient.reset();

    // Pasos: login con "Admin" (mayúscula) en vez de "admin"
    const response = await apiClient.login('Admin', 'admin123');

    // Resultado esperado: 401, "Admin" no debe tratarse como equivalente a "admin"
    expect(response.status()).toBe(401);
    const body = (await response.json()) as { error: string };
    expect(body).toEqual({ error: 'Credenciales inválidas' });    
  });
 
  // TC-AUTH-N02 — Sprint 1 — Prioridad: Media - Responsable: Seguivar
  // Precondición: token válido de admin disponible (token-admin-123).
  // Pasos: 1) POST /api/products con el token válido SIN el prefijo "Bearer ".
  // Datos: Authorization: token-admin-123 (formato incorrecto).
  // Resultado esperado: Status 401 (No autenticado); no debe crear el producto.
  test('TC-AUTH-N02 header Authorization sin prefijo "Bearer" se trata como no autenticado', async ({
    request,
  }) => {
    await allure.severity('normal');
 
    const response = await request.post('/api/products', {
      data: {
        name: 'Producto sin auth válida',
        description: 'no debería crearse',
        price: 10,
        category: 'Accesorios',
        stock: 1,
      },
      headers: { Authorization: ROLE_TOKENS.admin }, // falta el prefijo "Bearer "
    });
 
    expect(response.status()).toBe(401);
    const body = (await response.json()) as { error: string };
    expect(body).toEqual({ error: 'No autenticado' });
  });

  // TC-AUTH-N03 — Sprint 1 — Prioridad: Media - Responsable: Seguivar
  // Precondición: ninguna.
  // Pasos: 1) POST /api/products con Authorization: Bearer token-que-no-existe-123.
  // Resultado esperado: Status 401 (no hay usuario cuyo token coincida);
  // no se crea el producto.
  test('TC-AUTH-N03 token con formato válido pero inexistente es rechazado', async ({ request }) => {
    await allure.severity('normal');
 
    const response = await request.post('/api/products', {
      data: {
        name: 'Producto con token inexistente',
        description: 'no debería crearse',
        price: 10,
        category: 'Accesorios',
        stock: 1,
      },
      headers: { Authorization: 'Bearer token-que-no-existe-123' },
    });
 
    expect(response.status()).toBe(401);
    const body = (await response.json()) as { error: string };
    expect(body).toEqual({ error: 'No autenticado' });    
  });
});
