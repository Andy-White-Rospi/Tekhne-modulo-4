import { test, expect } from '../../src/fixtures/test-fixtures';
import { allure } from 'allure-playwright';
import type { Product, CreateProductInput } from './types';
// SEGUIVAR
import { ROLE_TOKENS } from './clients/ApiClient';

/**
 * Pruebas de API del catálogo de productos (TechStore marketplace):
 * shape, búsqueda, filtro por categoría, ofertas y CRUD.
 */
test.describe('Products API (via ApiClient)', () => {
  test.beforeEach(async ({ apiClient }) => {
    await allure.epic('API');
    await allure.feature('Catálogo');
    await apiClient.reset();
  });

  test('GET de un producto devuelve el shape esperado', async ({ apiClient }) => {
    const response = await apiClient.getProduct(1);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const product = (await response.json()) as Product;
    expect(product).toMatchObject({
      id: 1,
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      originalPrice: expect.any(Number),
      category: expect.any(String),
      stock: expect.any(Number),
      rating: expect.any(Number),
      seller: expect.any(String),
      freeShipping: expect.any(Boolean),
    });
  });

  test('GET de un producto inexistente devuelve 404', async ({ apiClient }) => {
    const response = await apiClient.getProduct(9999);
    expect(response.status()).toBe(404);
  });

  test('GET de todos los productos devuelve el catálogo semilla', async ({ apiClient }) => {
    const response = await apiClient.listProducts();

    expect(response.ok()).toBeTruthy();
    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(10);
  });

  test('búsqueda por texto filtra nombre y descripción', async ({ apiClient }) => {
    const response = await apiClient.listProducts({ search: 'smart' });

    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(2);
    const names = products.map((p) => p.name);
    expect(names).toContain('Smartphone X12');
    expect(names).toContain('Smartwatch Fit 3');
  });

  test('búsqueda sin coincidencias devuelve lista vacía', async ({ apiClient }) => {
    const response = await apiClient.listProducts({ search: 'zzz-inexistente' });
    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(0);
  });

  test('filtro por categoría devuelve solo esa categoría', async ({ apiClient }) => {
    const response = await apiClient.listProducts({ category: 'Accesorios' });

    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(3);
    expect(products.every((p) => p.category === 'Accesorios')).toBeTruthy();
  });

  test('GET /products/deals devuelve solo productos en oferta', async ({ apiClient }) => {
    const response = await apiClient.listDeals();

    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(7);
    expect(products.every((p) => p.originalPrice > p.price)).toBeTruthy();
  });

  test('POST crea un nuevo producto', async ({ apiClient }) => {
    const response = await apiClient.createProduct({
      name: 'Dock USB-C',
      description: 'Hub con HDMI, USB 3.0 y lector SD.',
      price: 59.9,
      originalPrice: 79.9,
      category: 'Accesorios',
      stock: 30,
      rating: 4.2,
      seller: 'KeyMasters',
      freeShipping: true,
    });

    expect(response.status()).toBe(201);
    const created = (await response.json()) as Product;
    expect(created.name).toBe('Dock USB-C');
    expect(created.id).toBeGreaterThan(0);
  });

  test('POST sin campos obligatorios devuelve 400', async ({ apiClient }) => {
    const response = await apiClient.createProduct({ name: 'Incompleto' });
    expect(response.status()).toBe(400);
  });

  test('PUT actualiza un producto existente', async ({ apiClient }) => {
    const response = await apiClient.updateProduct(1, { price: 1199.0 });

    expect(response.status()).toBe(200);
    const updated = (await response.json()) as Product;
    expect(updated.price).toBe(1199.0);
  });

  test('DELETE elimina un producto', async ({ apiClient }) => {
    const response = await apiClient.deleteProduct(1);
    expect(response.status()).toBe(204);

    const check = await apiClient.getProduct(1);
    expect(check.status()).toBe(404);
  });

  // TC-PROD-N01 — Sprint 1 — Prioridad: Alta — Defecto esperado (NEW-01) -  SEGUIVAR
   // Título: Crear producto con precio negativo debe rechazarse
   // Precondición: Autenticado como admin.
   // Pasos: 1) POST /api/products con price = -50. ,resto de campos válidos
   // Resultado esperado: Esperado 400. Actual conocido: 201 (no valida). Defecto NEW-01.
   // defecto esperado
  test('TC-PROD-N01 crear producto con precio negativo debe rechazarse', async ({ apiClient }) => {
    test.fail();
    await allure.severity('critical');
 
    const response = await apiClient.createProduct({
      name: 'Producto precio negativo',
      description: 'Caso TC-PROD-N01',
      price: -50,
      category: 'Accesorios',
      stock: 10,
    });
 
    expect(response.status()).toBe(400);
  });
 
  // TC-PROD-N02 — Sprint 1 — Prioridad: Alta — Defecto esperado (NEW-01) -  SEGUIVAR
  // Título: Crear producto con stock negativo debe rechazarse
  // Precondición: Autenticado como admin.
  // Pasos: 1) POST /api/products con stock = -5.  resto de campos válidos
  // Resultado esperado: Esperado 400. Actual conocido: 201. Defecto NEW-01.
  // defecto esperado  
  test('TC-PROD-N02 crear producto con stock negativo debe rechazarse', async ({ apiClient }) => {
    test.fail();
    await allure.severity('critical');
 
    const response = await apiClient.createProduct({
      name: 'Producto stock negativo',
      description: 'Caso TC-PROD-N02',
      price: 50,
      category: 'Accesorios',
      stock: -5,
    });
 
    expect(response.status()).toBe(400);
  });
 
  // TC-PROD-N03 — Sprint 1 — Prioridad: Media — Defecto esperado (NEW-01) -  SEGUIVAR
  // Título: Crear producto con precio no numérico debe rechazarse
  // Precondición: Autenticado como admin.
  // Pasos: 1) POST /api/products con price = "gratis" (string).
  // Resultado esperado: Esperado 400. Actual conocido: 201 con price como string.
  // defecto esperado  
  test('TC-PROD-N03 crear producto con precio no numérico debe rechazarse', async ({ apiClient }) => {
    test.fail();
    await allure.severity('normal');
 
    const response = await apiClient.createProduct({
      name: 'Producto precio inválido',
      description: 'Caso TC-PROD-N03',
      // "gratis" viola el tipo Product.price (number) a propósito: es lo
      // que hoy la API acepta sin validar.
      price: 'gratis' as unknown as number,
      category: 'Accesorios',
      stock: 10,
    } as Partial<CreateProductInput>);
 
    expect(response.status()).toBe(400);
  });
 
  // TC-PROD-N04 — Sprint 1 — Prioridad: Media -  SEGUIVAR
  test('TC-PROD-N04  filtrar por una categoría inexistente devuelve lista vacía', async ({ apiClient }) => {
    await allure.severity('normal');
 
    const response = await apiClient.listProducts({ category: 'CategoriaQueNoExiste' });
 
    expect(response.status()).toBe(200);
    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(0);
  });
 
  // TC-PROD-N05 — Sprint 1 — Prioridad: Media -  SEGUIVAR
  test('TC-PROD-N05 combina búsqueda de texto + categoría + filtro de ofertas', async ({ apiClient }) => {
    await allure.severity('normal');
 
    // "Mouse ergonómico" (id 5) pertenece a Accesorios y está en oferta.
    const response = await apiClient.listProducts({
      search: 'ergonómico',
      category: 'Accesorios',
      deals: true,
    });
 
    expect(response.ok()).toBeTruthy();
    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({ name: 'Mouse ergonómico', category: 'Accesorios' });
  });
 
  // TC-PROD-N06 — Sprint 1 — Prioridad: Media -  SEGUIVAR
  test('TC-PROD-N06 PUT sobre un producto inexistente devuelve 404', async ({ apiClient }) => {
    await allure.severity('normal');
 
    const response = await apiClient.updateProduct(9999, { price: 10 });
 
    expect(response.status()).toBe(404);
    const body = (await response.json()) as { error: string };
    expect(body).toEqual({ error: 'Producto no encontrado' });
  });
 
  // TC-PROD-N07 — Sprint 1 — Prioridad: Media -  SEGUIVAR
  test('TC-PROD-N07 DELETE sobre un producto inexistente devuelve 404', async ({ apiClient }) => {
    await allure.severity('normal');
 
    const response = await apiClient.deleteProduct(9999);
 
    expect(response.status()).toBe(404);
    const body = (await response.json()) as { error: string };
    expect(body).toEqual({ error: 'Producto no encontrado' });
  });
 
  // TC-PROD-N08 — Sprint 1 — Prioridad: Media  -  SEGUIVAR
  // La ruta /products/deals no debe interpretarse como /products/:id.
  // Protege contra una regresión de enrutamiento en Express: si alguien
  // reordena las rutas y "/:id" queda declarada antes que "/deals",
  // "deals" se tomaría como id y respondería 404 en vez de la lista.
  test('TC-PROD-N08 la ruta /products/deals no se interpreta como un id de producto', async ({
    apiClient,
  }) => {
    await allure.severity('normal');
 
    const response = await apiClient.listDeals();
 
    expect(response.status()).toBe(200);
    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(7);
  });
  
  // TC-PROD-N10- — Sprint 2 — Prioridad: Media  -  SEGUIVAR
  // Titulo: PUT no debería permitir sobrescribir el id del producto
  // Precondición: Autenticado como admin. Producto existente (id 1).
  // Pasos: 1) PUT /api/products/1 con body { id: 999, price: 10 }.
  // Resultado Esperado: el id sigue siendo 1. Actual conocido: Object.assign() lo sobrescribe a 999. Defecto NEW-05.
  test('PUT no debería permitir sobrescribir el id del producto', async ({ request }) => {
    test.fail();
    await allure.severity('critical');
 
    const response = await request.put('/api/products/1', {
      data: { id: 999, price: 10 },
      headers: { Authorization: `Bearer ${ROLE_TOKENS.admin}` },
    });
 
    expect(response.ok()).toBeTruthy();
    const updated = (await response.json()) as Product;
    // Esperado: el id sigue siendo 1. Actual conocido: Object.assign()
    // lo sobrescribe a 999 (defecto NEW-05).
    expect(updated.id).toBe(1);
  });

// TC-PROD-N11	Sprint 2	Productos	API	Alta	
// Titulo:  PUT debería rechazar editar un producto a precio/stock negativo	Autenticado como admin. 
// Precondición: Producto existente y válido.	
// Pasos: 1) PUT /api/products/1 con { price: -100 }.	price: -100	Esperado 400. Actual conocido: 200, queda con precio negativo. 
// BUG NEW-06.
  test('PUT debería rechazar editar un producto a precio negativo', async ({ apiClient }) => {
    test.fail();
    await allure.severity('critical');
 
    const response = await apiClient.updateProduct(1, { price: -100 });
 
    expect(response.status()).toBe(400);
  });

//TC-PROD-N12	Sprint 2	Productos	API	Baja	
// Titulo:  El filtro de categoría es case-insensitive	
//  Precondición: Store reiniciado.	
// Pasos: 1) GET /api/products?category=accesorios (minúscula).	category: accesorios	
// Resultado Esperado:  Devuelve los mismos 3 productos que category=Accesorios.

  test('el filtro de categoría es case-insensitive', async ({ apiClient }) => {
    await allure.severity('minor');
 
    const lower = await apiClient.listProducts({ category: 'accesorios' });
    const exact = await apiClient.listProducts({ category: 'Accesorios' });
 
    expect(lower.status()).toBe(200);
    const lowerProducts = (await lower.json()) as Product[];
    const exactProducts = (await exact.json()) as Product[];
 
    expect(lowerProducts).toHaveLength(3);
    expect(lowerProducts.map((p) => p.id)).toEqual(exactProducts.map((p) => p.id));
  });

//TC-PROD-N13	Sprint 2	Productos	API	Baja	
// Titulo:  La búsqueda de texto es case-insensitive	
// Precondición: Store reiniciado.	
// Pasos: 1) GET /api/products?search=MOUSE (mayúsculas).	search: MOUSE	
// Resultado Esperado:  Devuelve 'Mouse ergonómico' igual que con search=mouse en minúscula.
  test('la búsqueda de texto es case-insensitive', async ({ apiClient }) => {
    await allure.severity('minor');
 
    const response = await apiClient.listProducts({ search: 'MOUSE' });
 
    expect(response.status()).toBe(200);
    const products = (await response.json()) as Product[];
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Mouse ergonómico');
  });

});

