import { test, expect } from '@playwright/test';
import type { Cart, Order } from './types';

/**
 * Pruebas de API del checkout de TechStore usando el fixture nativo
 * `request`. baseURL y headers se heredan del proyecto `api`.
 * El carrito/pedidos viven en el store en memoria: se ejecutan en serie
 * y se resetea el estado antes de cada test.
 */

test.describe('Orders API (checkout, request nativo)', () => {
  test.beforeEach(async ({ request }) => {
    await request.post('/api/test/reset');
  });

  test('checkout con carrito vacío devuelve 400', async ({ request }) => {
    const response = await request.post('/api/orders', { data: { customer: 'admin' } });
    expect(response.status()).toBe(400);
  });

  test('checkout crea un pedido y vacía el carrito', async ({ request }) => {
    // Prepara el carrito.
    await request.post('/api/cart/items', { data: { productId: 1, quantity: 1 } });
    await request.post('/api/cart/items', { data: { productId: 4, quantity: 2 } });

    const response = await request.post('/api/orders', { data: { customer: 'admin' } });
    expect(response.status()).toBe(201);

    const order = (await response.json()) as Order;
    expect(order.id).toBe(1);
    expect(order.customer).toBe('admin');
    expect(order.items).toHaveLength(2);
    // 1299.00 + (449.00 * 2) = 2197.00
    expect(order.totalPrice).toBe(2197.0);
    expect(order.createdAt).toBeTruthy();

    // El carrito quedó vacío tras el checkout.
    const cartRes = await request.get('/api/cart');
    const cart = (await cartRes.json()) as Cart;
    expect(cart.items).toHaveLength(0);
  });

  test('TC-ORD-N01: el historial acumula pedidos con ids incrementales únicos', async ({
    request,
  }) => {
    await request.post('/api/cart/items', { data: { productId: 1, quantity: 1 } });
    const firstCheckout = await request.post('/api/orders', { data: { customer: 'ana' } });
    expect(firstCheckout.status()).toBe(201);

    await request.post('/api/cart/items', { data: { productId: 2, quantity: 1 } });
    const secondCheckout = await request.post('/api/orders', { data: { customer: 'beto' } });
    expect(secondCheckout.status()).toBe(201);

    const ordersResponse = await request.get('/api/orders');
    expect(ordersResponse.status()).toBe(200);

    const orders = (await ordersResponse.json()) as Order[];
    expect(orders).toHaveLength(2);
    expect(orders.map((order) => order.customer)).toEqual(['ana', 'beto']);
    expect(orders.map((order) => order.id)).toEqual([1, 2]);
    expect(new Set(orders.map((order) => order.id)).size).toBe(orders.length);
  });

  test('TC-ORD-N02: customer sin permiso no puede listar todos los pedidos', async ({
    request,
  }) => {
    const response = await request.get('/api/orders', {
      headers: { Authorization: 'Bearer token-customer-123' },
    });

    expect(response.status()).toBe(403);
  });

  test('TC-ORD-N03: el pedido queda asociado al usuario que compra', async ({ request }) => {
    await request.post('/api/cart/items', { data: { productId: 1, quantity: 1 } });

    const checkoutResponse = await request.post('/api/orders', {
      headers: { Authorization: 'Bearer token-customer-123' },
      data: { customer: 'customer' },
    });
    expect(checkoutResponse.status()).toBe(201);

    const createdOrder = (await checkoutResponse.json()) as Order;
    const orderResponse = await request.get(`/api/orders/${createdOrder.id}`);
    expect(orderResponse.status()).toBe(200);

    const order = (await orderResponse.json()) as Order;
    expect(order.customer).toBe('customer');
  });

  test('TC-ORD-N04: checkout normaliza espacios del customer', async ({ request }) => {
    await request.post('/api/cart/items', { data: { productId: 2, quantity: 1 } });
    const blankCustomerResponse = await request.post('/api/orders', {
      data: { customer: ' ' },
    });
    expect(blankCustomerResponse.status()).toBe(201);

    const blankCustomerOrder = (await blankCustomerResponse.json()) as Order;
    expect(blankCustomerOrder.customer).toBe('invitado');

    await request.post('/api/cart/items', { data: { productId: 3, quantity: 1 } });
    const paddedCustomerResponse = await request.post('/api/orders', {
      data: { customer: ' ana ' },
    });
    expect(paddedCustomerResponse.status()).toBe(201);

    const paddedCustomerOrder = (await paddedCustomerResponse.json()) as Order;
    expect(paddedCustomerOrder.customer).toBe('ana');
  });

  test('GET /orders/:id devuelve el pedido creado', async ({ request }) => {
    await request.post('/api/cart/items', { data: { productId: 2, quantity: 1 } });
    await request.post('/api/orders', { data: { customer: 'admin' } });

    const response = await request.get('/api/orders/1');
    expect(response.ok()).toBeTruthy();
    const order = (await response.json()) as Order;
    expect(order.id).toBe(1);
    expect(order.totalPrice).toBe(199.99);
  });

  test('GET /orders/:id inexistente devuelve 404', async ({ request }) => {
    const response = await request.get('/api/orders/9999');
    expect(response.status()).toBe(404);
  });

  test('checkout sin customer usa "invitado" por defecto', async ({ request }) => {
    await request.post('/api/cart/items', { data: { productId: 3, quantity: 1 } });
    const response = await request.post('/api/orders', { data: {} });

    expect(response.status()).toBe(201);
    const order = (await response.json()) as Order;
    expect(order.customer).toBe('invitado');
  });
});
