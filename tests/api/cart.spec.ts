import { test, expect } from '../../src/fixtures/test-fixtures';
import { allure } from 'allure-playwright';
import type { Cart, Product } from './types';

/**
 * Pruebas de API del carrito de TechStore usando el fixture ApiClient.
 * El carrito vive en el store en memoria compartido; cada test reinicia
 * el estado antes de ejecutarse para mantenerlos independientes.
 */
test.describe('Cart API (via ApiClient)', () => {
  test.beforeEach(async ({ apiClient }) => {
    await allure.epic('API');
    await allure.feature('Carrito');
    await apiClient.reset();
    await apiClient.clearCart();
  });

  test('el carrito arranca vacío', async ({ apiClient }) => {
    const response = await apiClient.getCart();
    expect(response.ok()).toBeTruthy();

    const cart = (await response.json()) as Cart;
    expect(cart.items).toHaveLength(0);
    expect(cart.totalItems).toBe(0);
    expect(cart.totalPrice).toBe(0);
  });

  test('agrega un producto y calcula los totales', async ({ apiClient }) => {
    const response = await apiClient.addToCart(1, 2);
    expect(response.status()).toBe(201);

    const cart = (await response.json()) as Cart;
    expect(cart.items).toHaveLength(1);
    expect(cart.totalItems).toBe(2);
    expect(cart.totalPrice).toBe(2598.0);
  });

  test('TC-CART-N01: agrega varios productos distintos y calcula el total combinado', async ({
    apiClient,
  }) => {
    const firstResponse = await apiClient.addToCart(2, 1);
    expect(firstResponse.status()).toBe(201);

    const secondResponse = await apiClient.addToCart(5, 3);
    expect(secondResponse.status()).toBe(201);

    const cart = (await secondResponse.json()) as Cart;
    expect(cart.items).toHaveLength(2);
    expect(cart.totalItems).toBe(4);
    expect(cart.totalPrice).toBe(304.69);
  });
  //DESCOMENTAR

  test('TC-CART-N02: agrega cantidad mayor al stock disponible y es rechazado', async ({
    apiClient,
  }) => {
    const response = await apiClient.addToCart(1, 1000);
    expect([400, 409]).toContain(response.status());
  });

  test('TC-CART-N03: vacia el carrito completo', async ({
    apiClient,
  }) => {
    const firstResponse = await apiClient.addToCart(2, 1);
    expect(firstResponse.status()).toBe(201);

    const secondResponse = await apiClient.addToCart(5, 3);
    expect(secondResponse.status()).toBe(201);

    const clearResponse = await apiClient.clearCart();
    expect(clearResponse.status()).toBe(200);

    const cart = (await clearResponse.json()) as Cart;
    expect(cart.items).toHaveLength(0);
    expect(cart.totalItems).toBe(0);
    expect(cart.totalPrice).toBe(0);
  });
  //DESCOMENTAR

  test('TC-CART-N04: realiza checkout y valida el stock', async ({
    apiClient,
  }) => {
    const initialResponse = await apiClient.getProduct(4);
    expect(initialResponse.status()).toBe(200);
    const initialProduct = (await initialResponse.json()) as Product;

    const addResponse = await apiClient.addToCart(4, 2);
    expect(addResponse.status()).toBe(201);

    const checkoutResponse = await apiClient.checkout('qa');
    expect(checkoutResponse.status()).toBe(201);

    const finalResponse = await apiClient.getProduct(4);
    expect(finalResponse.status()).toBe(200);
    const finalProduct = (await finalResponse.json()) as Product;

    expect(finalProduct.stock).toBe(initialProduct.stock - 2);
  });

  test('agregar el mismo producto acumula la cantidad', async ({ apiClient }) => {
    await apiClient.addToCart(3, 1);
    const response = await apiClient.addToCart(3, 2);

    const cart = (await response.json()) as Cart;
    expect(cart.items).toHaveLength(1);
    expect(cart.totalItems).toBe(3);
    expect(cart.totalPrice).toBe(268.5);
  });

  test('agregar un producto inexistente devuelve 404', async ({ apiClient }) => {
    const response = await apiClient.addToCart(9999, 1);
    expect(response.status()).toBe(404);
  });

  test('agregar con quantity inválida devuelve 400', async ({ apiClient }) => {
    const response = await apiClient.addToCart(1, 0);
    expect(response.status()).toBe(400);
  });

  test('quita un producto del carrito', async ({ apiClient }) => {
    await apiClient.addToCart(1, 1);
    const response = await apiClient.removeFromCart(1);

    expect(response.status()).toBe(200);
    const cart = (await response.json()) as Cart;
    expect(cart.items).toHaveLength(0);
  });

  test('quitar un producto que no está en el carrito devuelve 404', async ({ apiClient }) => {
    const response = await apiClient.removeFromCart(2);
    expect(response.status()).toBe(404);
  });
});
