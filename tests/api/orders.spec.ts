import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";

async function login(
  request: import("@playwright/test").APIRequestContext,
): Promise<string> {
  const response = await request.post("/api/login", {
    data: {
      email: `api-user-${randomUUID()}@example.test`,
      password: `local-test-${randomUUID()}`,
    },
  });
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as { token: string };
  return body.token;
}

test("authorized client can create an order @smoke", async ({ request }) => {
  const token = await login(request);
  const response = await request.post("/api/orders", {
    headers: { authorization: `Bearer ${token}` },
    data: { items: [{ productId: "p-102", quantity: 2 }] },
  });
  expect(response.status()).toBe(201);
  await expect(response).toBeOK();
  expect(await response.json()).toMatchObject({
    total: 178,
    status: "confirmed",
  });
});

test("unauthenticated order is rejected", async ({ request }) => {
  const response = await request.post("/api/orders", {
    data: { items: [{ productId: "p-100", quantity: 1 }] },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({ code: "UNAUTHORIZED" });
});

test("invalid order item returns a domain error", async ({ request }) => {
  const token = await login(request);
  const response = await request.post("/api/orders", {
    headers: { authorization: `Bearer ${token}` },
    data: { items: [{ productId: "p-103", quantity: 1 }] },
  });
  expect(response.status()).toBe(422);
  expect(await response.json()).toMatchObject({ code: "INVALID_ITEM" });
});
