import { Ajv } from "ajv";
import { expect, test } from "@playwright/test";

const productResponseSchema = {
  type: "object",
  required: ["data", "count"],
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    data: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "category", "price", "inStock"],
        additionalProperties: false,
        properties: {
          id: { type: "string", pattern: "^p-[0-9]+$" },
          name: { type: "string", minLength: 1 },
          category: { type: "string", minLength: 1 },
          price: { type: "number", exclusiveMinimum: 0 },
          inStock: { type: "boolean" },
        },
      },
    },
  },
} as const;

test("product API satisfies its JSON contract @smoke", async ({ request }) => {
  const response = await request.get("/api/products");
  expect(response.status()).toBe(200);
  const body: unknown = await response.json();
  const validate = new Ajv({ allErrors: true }).compile(productResponseSchema);
  expect(validate(body), JSON.stringify(validate.errors, null, 2)).toBe(true);
});

test("product API supports case-insensitive filtering", async ({ request }) => {
  const response = await request.get("/api/products?search=KEYBOARD");
  const body = (await response.json()) as {
    count: number;
    data: Array<{ name: string }>;
  };
  expect(body.count).toBe(1);
  expect(body.data[0]?.name).toBe("Mechanical Keyboard");
});
