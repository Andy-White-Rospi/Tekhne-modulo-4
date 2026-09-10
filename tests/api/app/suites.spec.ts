import { test, expect } from '@playwright/test';

test('valida que suites existe y contiene 4 elementos', async ({ request }) => {
    const response = await request.get('/api/qa/suites');

    // Validar Status Code
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Verificar que la propiedad "suites" existe
    expect(responseBody).toHaveProperty('suites');

    // Verificar que "suites" sea un array
    expect(Array.isArray(responseBody.suites)).toBe(true);

    // Verificar que "suites" tenga 4 elementos
    expect(responseBody.suites).toHaveLength(4);

    // Verificar que ningún elemento sea null
    responseBody.suites.forEach((suite: unknown, index: number) => {
        expect(suite, `suites[${index}] no debe ser null`).not.toBeNull();
    });
});

test('Ejecutar una suite inválida debe devolver 400', async ({ request }) => {
    const response = await request.post('/api/qa/run', {
        data: {
            suite: 'other',
            bugs: true,
        },
    });

    expect(response.status()).toBe(400);
});

test('Ejecutar una suite con grep inválido debe devolver 400', async ({ request }) => {
    const response = await request.post('/api/qa/run', {
        data: {
            suite: 'api',
            bugs: true,
            grep: '; rm -rf / #',
        },
    });

    expect(response.status()).toBe(400);
});

test('Habilitar bugs debe devolver bugs en true', async ({ request }) => {
    const response = await request.post('/api/config/bugs', {
        data: {
            enabled: true,
        },
    }); // Validar código de respuesta

    expect(response.status()).toBe(200);

    // Obtener y validar el body
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('bugs');
    expect(responseBody.bugs).toBe(true);
});

test('El estado de bugs debe ser false', async ({ request }) => {
    // Activar modo bugs
    const enableResponse = await request.post('/api/config/bugs', {
        data: {
            enabled: true,
        },
    });

    expect(enableResponse.status()).toBe(200);

    // Desactivar modo bugs
    const disableResponse = await request.post('/api/config/bugs', {
        data: {
            enabled: false,
        },
    });

    expect(disableResponse.status()).toBe(200);

    // Consultar configuración actual
    const response = await request.get('/api/config');

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // En Postman: JSON.parse(response.bugs)
    const bugsMode = JSON.parse(responseBody.bugs);

    // Verificar que el estado sea false
    expect(bugsMode).toBe(false);
});
