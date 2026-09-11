const loginPanel = document.querySelector("#login-panel");
const storePanel = document.querySelector("#store-panel");
const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");
const productsElement = document.querySelector("#products");
const searchInput = document.querySelector("#search");
const catalogStatus = document.querySelector("#catalog-status");
const cartCount = document.querySelector("#cart-count");
const checkoutButton = document.querySelector("#checkout");
const orderStatus = document.querySelector("#order-status");

let token = "";
let cart = [];
let searchTimer;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";
  const data = new FormData(loginForm);
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: data.get("email"),
      password: data.get("password"),
    }),
  });
  const body = await response.json();
  if (!response.ok) {
    loginError.textContent = body.message;
    return;
  }
  token = body.token;
  loginPanel.classList.add("hidden");
  storePanel.classList.remove("hidden");
  await loadProducts();
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => void loadProducts(searchInput.value), 200);
});

checkoutButton.addEventListener("click", async () => {
  orderStatus.textContent = "Submitting order…";
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: cart.map((productId) => ({ productId, quantity: 1 })),
    }),
  });
  const body = await response.json();
  if (!response.ok) {
    orderStatus.textContent = body.message;
    return;
  }
  orderStatus.textContent = `Order ${body.id} confirmed — $${body.total.toFixed(2)}`;
  cart = [];
  renderCart();
});

async function loadProducts(search = "") {
  catalogStatus.textContent = "Loading products…";
  productsElement.replaceChildren();
  try {
    const response = await fetch(
      `/api/products?search=${encodeURIComponent(search)}`,
    );
    if (!response.ok) throw new Error("Request failed");
    const body = await response.json();
    catalogStatus.textContent = `${body.count} product${body.count === 1 ? "" : "s"} found`;
    for (const product of body.data)
      productsElement.append(createProduct(product));
  } catch {
    catalogStatus.textContent =
      "Products are temporarily unavailable. Please try again.";
  }
}

function createProduct(product) {
  const article = document.createElement("article");
  article.className = "product";
  article.dataset.productId = product.id;

  const title = document.createElement("h2");
  title.textContent = product.name;
  const category = document.createElement("p");
  category.className = "category";
  category.textContent = product.category;
  const price = document.createElement("p");
  price.className = "price";
  price.textContent = `$${product.price.toFixed(2)}`;
  const add = document.createElement("button");
  add.type = "button";
  add.disabled = !product.inStock;
  add.textContent = product.inStock
    ? `Add ${product.name} to cart`
    : "Out of stock";
  add.addEventListener("click", () => {
    cart.push(product.id);
    renderCart();
  });
  article.append(title, category, price, add);
  return article;
}

function renderCart() {
  cartCount.textContent = String(cart.length);
  checkoutButton.disabled = cart.length === 0;
}
