import { randomUUID } from "node:crypto";

const uniqueSuffix = randomUUID();

export default {
  valid: {
    email: `browser-user-${uniqueSuffix}@example.test`,
    password: `local-test-${randomUUID()}`,
  },
  invalid: {
    email: `browser-user-${uniqueSuffix}@example.test`,
    password: "short",
  },
};
