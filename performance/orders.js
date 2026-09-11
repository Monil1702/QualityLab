import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 10 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<300"],
  },
};

const baseUrl = __ENV.BASE_URL || "http://127.0.0.1:3000";

export function setup() {
  const response = http.post(
    `${baseUrl}/api/login`,
    JSON.stringify({
      email: `load-user-${Date.now()}@example.test`,
      password: `local-load-test-${Date.now()}`,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
  check(response, { "login succeeds": (result) => result.status === 200 });
  return { token: response.json("token") };
}

export default function (data) {
  const response = http.post(
    `${baseUrl}/api/orders`,
    JSON.stringify({ items: [{ productId: "p-102", quantity: 1 }] }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    },
  );
  check(response, { "order created": (result) => result.status === 201 });
  sleep(0.5);
}
