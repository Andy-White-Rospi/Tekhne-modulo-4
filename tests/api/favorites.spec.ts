import { test, expect } from '../../src/fixtures/test-fixtures';
import { allure } from 'allure-playwright';
import type { Product } from './types';

/**
 * Pruebas de API de favoritos (wishlist) de TechStore. Los favoritos
 * viven en el store en memoria compartido: se ejecutan en serie y se
 * resetea el estado antes de cada test.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Favorites API (via ApiClient)', () => {
  test.beforeEach(async ({ apiClient }) => {
    await allure.epic('API');
    await allure.feature('Favoritos');
    await apiClient.reset();
  });

  test('la lista de favoritos arranca vacía', async ({ apiClient }) => {
    const response = await apiClient.listFavorites();
    expect(response.ok()).toBeTruthy();
    const favorites = (await response.json()) as Product[];
    expect(favorites).toHaveLength(0);
  });

  test('agrega un producto a favoritos', async ({ apiClient }) => {
    const response = await apiClient.addFavorite(1);
    expect(response.status()).toBe(201);

    const favorites = (await response.json()) as Product[];
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(1);
  });

  test('agregar el mismo favorito dos veces no lo duplica', async ({ apiClient }) => {
    await apiClient.addFavorite(2);
    const response = await apiClient.addFavorite(2);

    const favorites = (await response.json()) as Product[];
    expect(favorites).toHaveLength(1);
  });

  test('agregar un producto inexistente a favoritos devuelve 404', async ({ apiClient }) => {
    const response = await apiClient.addFavorite(9999);
    expect(response.status()).toBe(404);
  });

  test('agregar sin productId devuelve 400', async ({ request }) => {
    const response = await request.post('/api/favorites', { data: {} });
    expect(response.status()).toBe(400);
  });

  test('quita un producto de favoritos', async ({ apiClient }) => {
    await apiClient.addFavorite(3);
    const response = await apiClient.removeFavorite(3);

    expect(response.status()).toBe(200);
    const favorites = (await response.json()) as Product[];
    expect(favorites).toHaveLength(0);
  });

  test('quitar un favorito que no está devuelve 404', async ({ apiClient }) => {
    const response = await apiClient.removeFavorite(5);
    expect(response.status()).toBe(404);
  });

  test('TC-FAV-N01: Lista respeta el orden de favoritos', async ({ apiClient }) => {
    const responseFirstFavorite = await apiClient.addFavorite(6);
    expect(responseFirstFavorite.status()).toBe(201);
    const responseSecondFavorite = await apiClient.addFavorite(2);
    expect(responseSecondFavorite.status()).toBe(201);
    const responseThirdFavorite = await apiClient.addFavorite(9);
    expect(responseThirdFavorite.status()).toBe(201);

    const response = await apiClient.listFavorites();
    expect(response.ok()).toBeTruthy();
    const favorites = (await response.json()) as Product[];
    const favoriteIds = favorites.map((favorite) => favorite.id);
    expect(favoriteIds).toEqual([6, 2, 9]);
  });

  test('TC-FAV-N02: favorito se mantiene a pesar de cambiar el filtro', async ({ apiClient }) => {
    const responseFirstFavorite = await apiClient.addFavorite(1);
    expect(responseFirstFavorite.status()).toBe(201);

    const responseFirstFilter = await apiClient.listProducts({ category: 'Accesorios' });
    const products = (await responseFirstFilter.json()) as Product[];
    expect(products.every((p) => p.category === 'Accesorios')).toBeTruthy();
    
    const responseLastFilter = await apiClient.listProducts({ category: 'Laptop' });
    const productsSecond = (await responseLastFilter.json()) as Product[];
    expect(productsSecond.every((p) => p.category === 'Laptop')).toBeTruthy();

    const responseFavorites = await apiClient.listFavorites();
    const favorites = (await responseFavorites.json()) as Product[];
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(1);
  });

  test('TC-FAV-N03: eliminar un producto favorito lo quita de la lista', async ({ apiClient }) => {
    const favoriteResponse = await apiClient.addFavorite(8);
    expect(favoriteResponse.status()).toBe(201);

    const deleteResponse = await apiClient.deleteProduct(8);
    expect(deleteResponse.status()).toBe(204);

    const favoritesResponse = await apiClient.listFavorites();
    expect(favoritesResponse.status()).toBe(200);

    const favorites = (await favoritesResponse.json()) as Product[];
    expect(favorites).toEqual([]);
  });
});
