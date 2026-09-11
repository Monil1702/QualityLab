import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import { randomUUID } from "node:crypto";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
};

type OrderItem = { productId: string; quantity: number };
type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: "confirmed";
};

const products: Product[] = [
  {
    id: "p-100",
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 119.99,
    inStock: true,
  },
  {
    id: "p-101",
    name: "Noise-Cancelling Headphones",
    category: "Audio",
    price: 249.5,
    inStock: true,
  },
  {
    id: "p-102",
    name: "USB-C Dock",
    category: "Accessories",
    price: 89.0,
    inStock: true,
  },
  {
    id: "p-103",
    name: "4K Monitor",
    category: "Displays",
    price: 429.99,
    inStock: false,
  },
];

const orders: Order[] = [];
// Tokens are ephemeral and exist only for the lifetime of the demo server.
const validToken = randomUUID();
const app = express();
const port = Number(process.env.PORT ?? 3000);
const publicDirectory = path.resolve(process.cwd(), "app/public");

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(express.static(publicDirectory));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/login", (request, response) => {
  const { email, password } = request.body as {
    email?: string;
    password?: string;
  };
  const isDemoUser =
    typeof email === "string" &&
    email.endsWith("@example.test") &&
    typeof password === "string" &&
    password.length >= 12;
  if (isDemoUser) {
    response.json({ token: validToken, user: { name: "QA Engineer", email } });
    return;
  }
  response.status(401).json({
    code: "INVALID_CREDENTIALS",
    message: "Email or password is incorrect",
  });
});

app.get("/api/products", (request, response) => {
  const search = String(request.query.search ?? "")
    .trim()
    .toLowerCase();
  const result = search
    ? products.filter((product) =>
        `${product.name} ${product.category}`.toLowerCase().includes(search),
      )
    : products;
  response.json({ data: result, count: result.length });
});

function requireAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (request.header("authorization") !== `Bearer ${validToken}`) {
    response.status(401).json({
      code: "UNAUTHORIZED",
      message: "A valid bearer token is required",
    });
    return;
  }
  next();
}

app.post("/api/orders", requireAuthentication, (request, response) => {
  const items = (request.body as { items?: OrderItem[] }).items;
  if (!Array.isArray(items) || items.length === 0) {
    response
      .status(400)
      .json({ code: "EMPTY_ORDER", message: "At least one item is required" });
    return;
  }

  let total = 0;
  for (const item of items) {
    const product = products.find(
      (candidate) => candidate.id === item.productId,
    );
    if (
      !product ||
      !product.inStock ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      response.status(422).json({
        code: "INVALID_ITEM",
        message: `Invalid item: ${item.productId}`,
      });
      return;
    }
    total += product.price * item.quantity;
  }

  const order: Order = {
    id: `order-${String(orders.length + 1).padStart(4, "0")}`,
    items,
    total: Number(total.toFixed(2)),
    status: "confirmed",
  };
  orders.push(order);
  response.status(201).json(order);
});

app.use((_request, response) => {
  response.status(404).json({ code: "NOT_FOUND", message: "Route not found" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`QualityLab demo app listening on http://127.0.0.1:${port}`);
});
