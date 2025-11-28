use hiraoka

# 1) Categorías (opcional)
db.categories.insertMany([
  { name: "Televisores" },
  { name: "Laptops" },
  { name: "Audio" },
  { name: "Electrodomésticos" },
  { name: "Gaming" },
  { name: "Accesorios" }
]);

# 2) 30 productos (category_id es opcional → null)
db.products.insertOne({
  sku: "SKU-0001",
  name: 'Smart TV 55" 4K',
  brand: "HkBrand",
  category_id: ObjectId("691a0a9691cf91bfe0ec51db"),
  price: 1899.9,
  specs: {},
  images: ["/imgs/product-01.jpg"],
  primary_image: "/imgs/product-01.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

db.products.insertOne({
  sku: "SKU-0002",
  name: 'Smart TV 65" 4K',
  brand: "HkBrand",
  category_id: ObjectId("691a0a9691cf91bfe0ec51db"), # Televisores
  price: 2999.9,
  specs: {},
  images: ["/imgs/product-02.jpg"],
  primary_image: "/imgs/product-02.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0003
db.products.insertOne({
  sku: "SKU-0003",
  name: 'Smart TV 43" FHD',
  brand: "HkBrand",
  category_id: ObjectId("691a0a9691cf91bfe0ec51db"), # Televisores
  price: 899.9,
  specs: {},
  images: ["/imgs/product-03.jpg"],
  primary_image: "/imgs/product-03.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0004
db.products.insertOne({
  sku: "SKU-0004",
  name: 'Laptop 14" Ryzen 7',
  brand: "PeruTech",
  category_id: ObjectId("691a0a9691cf91bfe0ec51dc"),
  price: new Double(2699.0),
  specs: {},
  images: ["/imgs/product-04.jpg"],
  primary_image: "/imgs/product-04.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0005
db.products.insertOne({
  sku: "SKU-0005",
  name: 'Laptop 15" i7 16GB',
  brand: "PeruTech",
  category_id: ObjectId("691a0a9691cf91bfe0ec51dc"),
  price: new Double(3199.0),
  specs: {},
  images: ["/imgs/product-05.jpg"],
  primary_image: "/imgs/product-05.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0006
db.products.insertOne({
  sku: "SKU-0006",
  name: 'Ultrabook 13" i5',
  brand: "PeruTech",
  category_id: ObjectId("691a0a9691cf91bfe0ec51dc"),
  price: new Double(2499.0),
  specs: {},
  images: ["/imgs/product-06.jpg"],
  primary_image: "/imgs/product-06.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0007
db.products.insertOne({
  sku: "SKU-0007",
  name: "Auriculares Inalámbricos Pro",
  brand: "LimaSound",
  category_id: ObjectId("691a0a9691cf91bfe0ec51dd"),
  price: new Double(399.0),
  specs: {},
  images: ["/imgs/product-07.jpg"],
  primary_image: "/imgs/product-07.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0008
db.products.insertOne({
  sku: "SKU-0008",
  name: "Parlante Bluetooth 30W",
  brand: "LimaSound",
  category_id: ObjectId("691a0a9691cf91bfe0ec51dd"),
  price: new Double(249.0),
  specs: {},
  images: ["/imgs/product-08.jpg"],
  primary_image: "/imgs/product-08.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0009
db.products.insertOne({
  sku: "SKU-0009",
  name: "Barra de Sonido 2.1",
  brand: "LimaSound",
  category_id: ObjectId("691a0a9691cf91bfe0ec51dd"),
  price: new Double(679.0),
  specs: {},
  images: ["/imgs/product-09.jpg"],
  primary_image: "/imgs/product-09.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0010
db.products.insertOne({
  sku: "SKU-0010",
  name: "Refrigeradora 300L No Frost",
  brand: "InkaHome",
  category_id: ObjectId("691a0a9691cf91bfe0ec51de"),
  price: new Double(2199.0),
  specs: {},
  images: ["/imgs/product-10.jpg"],
  primary_image: "/imgs/product-10.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0011
db.products.insertOne({
  sku: "SKU-0011",
  name: "Cocina 5 Hornillas",
  brand: "InkaHome",
  category_id: ObjectId("691a0a9691cf91bfe0ec51de"),
  price: new Double(1599.0),
  specs: {},
  images: ["/imgs/product-11.jpg"],
  primary_image: "/imgs/product-11.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0012
db.products.insertOne({
  sku: "SKU-0012",
  name: "Microondas 25L",
  brand: "InkaHome",
  category_id: ObjectId("691a0a9691cf91bfe0ec51de"),
  price: new Double(449.0),
  specs: {},
  images: ["/imgs/product-12.jpg"],
  primary_image: "/imgs/product-12.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0013
db.products.insertOne({
  sku: "SKU-0013",
  name: "Consola Gaming Pro",
  brand: "AndesPro",
  category_id: ObjectId("691a0a9691cf91bfe0ec51df"),
  price: new Double(2499.0),
  specs: {},
  images: ["/imgs/product-13.jpg"],
  primary_image: "/imgs/product-13.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0014
db.products.insertOne({
  sku: "SKU-0014",
  name: "Control Inalámbrico",
  brand: "AndesPro",
  category_id: ObjectId("691a0a9691cf91bfe0ec51df"),
  price: new Double(249.0),
  specs: {},
  images: ["/imgs/product-14.jpg"],
  primary_image: "/imgs/product-14.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0015
db.products.insertOne({
  sku: "SKU-0015",
  name: "Silla Gamer RGB",
  brand: "AndesPro",
  category_id: ObjectId("691a0a9691cf91bfe0ec51df"),
  price: new Double(799.0),
  specs: {},
  images: ["/imgs/product-15.jpg"],
  primary_image: "/imgs/product-15.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0016
db.products.insertOne({
  sku: "SKU-0016",
  name: "Mouse Inalámbrico",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(99.0),
  specs: {},
  images: ["/imgs/product-16.jpg"],
  primary_image: "/imgs/product-16.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0017
db.products.insertOne({
  sku: "SKU-0017",
  name: "Teclado Mecánico",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(359.0),
  specs: {},
  images: ["/imgs/product-17.jpg"],
  primary_image: "/imgs/product-17.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0018
db.products.insertOne({
  sku: "SKU-0018",
  name: 'Monitor 27" 2K 144Hz',
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51df"),
  price: new Double(1499.0),
  specs: {},
  images: ["/imgs/product-18.jpg"],
  primary_image: "/imgs/product-18.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0019
db.products.insertOne({
  sku: "SKU-0019",
  name: "Smartwatch Deportivo",
  brand: "PeruTech",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(599.0),
  specs: {},
  images: ["/imgs/product-19.jpg"],
  primary_image: "/imgs/product-19.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0020
db.products.insertOne({
  sku: "SKU-0020",
  name: "Cámara de Seguridad Wi-Fi",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(329.0),
  specs: {},
  images: ["/imgs/product-20.jpg"],
  primary_image: "/imgs/product-20.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0021
db.products.insertOne({
  sku: "SKU-0021",
  name: 'Tablet 10" 64GB',
  brand: "PeruTech",
  category_id: ObjectId("691a0a9691cf91bfe0ec51dc"),
  price: new Double(799.0),
  specs: {},
  images: ["/imgs/product-21.jpg"],
  primary_image: "/imgs/product-21.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0022
db.products.insertOne({
  sku: "SKU-0022",
  name: "Disco SSD 1TB",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(379.0),
  specs: {},
  images: ["/imgs/product-22.jpg"],
  primary_image: "/imgs/product-22.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0023
db.products.insertOne({
  sku: "SKU-0023",
  name: "Memoria RAM 16GB",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(179.0),
  specs: {},
  images: ["/imgs/product-23.jpg"],
  primary_image: "/imgs/product-23.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0024
db.products.insertOne({
  sku: "SKU-0024",
  name: "Tarjeta Gráfica 8GB",
  brand: "AndesPro",
  category_id: ObjectId("691a0a9691cf91bfe0ec51df"),
  price: new Double(1899.0),
  specs: {},
  images: ["/imgs/product-24.jpg"],
  primary_image: "/imgs/product-24.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0025
db.products.insertOne({
  sku: "SKU-0025",
  name: "Aspiradora Robot",
  brand: "InkaHome",
  category_id: ObjectId("691a0a9691cf91bfe0ec51de"),
  price: new Double(999.0),
  specs: {},
  images: ["/imgs/product-25.jpg"],
  primary_image: "/imgs/product-25.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0026
db.products.insertOne({
  sku: "SKU-0026",
  name: "Licuadora 1.5L",
  brand: "InkaHome",
  category_id: ObjectId("691a0a9691cf91bfe0ec51de"),
  price: new Double(199.0),
  specs: {},
  images: ["/imgs/product-26.jpg"],
  primary_image: "/imgs/product-26.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0027
db.products.insertOne({
  sku: "SKU-0027",
  name: "Freidora de Aire 5L",
  brand: "InkaHome",
  category_id: ObjectId("691a0a9691cf91bfe0ec51de"),
  price: new Double(429.0),
  specs: {},
  images: ["/imgs/product-27.jpg"],
  primary_image: "/imgs/product-27.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0028
db.products.insertOne({
  sku: "SKU-0028",
  name: "Cargador Rápido 65W",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(149.0),
  specs: {},
  images: ["/imgs/product-28.jpg"],
  primary_image: "/imgs/product-28.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0029
db.products.insertOne({
  sku: "SKU-0029",
  name: "Cable USB-C 2m",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(39.0),
  specs: {},
  images: ["/imgs/product-29.jpg"],
  primary_image: "/imgs/product-29.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});

# 0030
db.products.insertOne({
  sku: "SKU-0030",
  name: "Estabilizador de Voltaje",
  brand: "CuscoGear",
  category_id: ObjectId("691a0a9691cf91bfe0ec51e0"),
  price: new Double(249.0),
  specs: {},
  images: ["/imgs/product-30.jpg"],
  primary_image: "/imgs/product-30.jpg",
  ratings: { avg: new Double(0), count: NumberInt(0), breakdown: null },
  reviews_count: NumberInt(0),
  created_at: new Date("2025-11-08T00:00:00Z"),
  updated_at: null
});





# 3) Usuarios (2 clientes con actividad + 1 admin sin actividad)
db.users.insertMany([
  {
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    password_hash: "$2b$10$abcDEFghiJKLmnopqrstu", # string corto "tipo bcrypt"
    role: "cliente",
    status: "active",
    created_at: new Date("2025-11-08T00:00:00Z"),
    updated_at: null
  },
  {
    name: "María López",
    email: "maria.lopez@example.com",
    password_hash: "$2b$12$stuVWXyzABCD123456789", # otro string corto
    role: "cliente",
    status: "active",
    created_at: new Date("2025-11-08T00:00:00Z"),
    updated_at: null
  },
  {
    name: "Admin Hiraoka",
    email: "admin@hiraoka.com",
    password_hash: "$2a$08$qwertyASDFghjkZXCVbnm", # y otro más
    role: "admin",
    status: "active",
    created_at: new Date("2025-11-08T00:00:00Z"),
    updated_at: null
  }
]);
# 4) Compras (2 órdenes por cliente)
use hiraoka;

# --- Resolver _id de usuarios ---
const juanDoc  = db.users.findOne({ email: "juan.perez@example.com" }, { _id: 1 });
const mariaDoc = db.users.findOne({ email: "maria.lopez@example.com" }, { _id: 1 });
if (!juanDoc)  { throw new Error("No existe usuario Juan Pérez"); }
if (!mariaDoc) { throw new Error("No existe usuario María López"); }
const JUAN  = juanDoc._id;
const MARIA = mariaDoc._id;

# --- Helper para resolver _id de productos por SKU ---
function PID(sku) {
  const doc = db.products.findOne({ sku }, { _id: 1 });
  if (!doc) { throw new Error("SKU no encontrado: " + sku); }
  return doc._id;
}

# Prefetch de SKUs usados
const P0001 = PID("SKU-0001");
const P0016 = PID("SKU-0016");
const P0004 = PID("SKU-0004");
const P0002 = PID("SKU-0002");
const P0009 = PID("SKU-0009");
const P0020 = PID("SKU-0020");

# --- Órdenes ---

# Juan #1
db.orders.insertOne({
  user_id: JUAN,
  items: [
    { product_id: P0001, name: 'Smart TV 55" 4K', photo: "/imgs/product-01.jpg", quantity: NumberInt(1), unit_price: new Double(1899.9), currency: "PEN", subtotal: new Double(1899.9) },
    { product_id: P0016, name: "Mouse Inalámbrico",  photo: "/imgs/product-16.jpg", quantity: NumberInt(2), unit_price: new Double(99.0),    currency: "PEN", subtotal: new Double(198.0) }
  ],
  totals: { subtotal: new Double(2097.9), discount: new Double(0), shipping: new Double(0), tax: new Double(0), grand_total: new Double(2097.9) },
  order_status: "Verificado",
  payment: { method: "yape", transaction_id: null, paid_at: new Date("2025-11-08T00:05:00Z") },
  notes: null,
  created_at: new Date("2025-11-08T00:04:00Z"),
  updated_at: null
});

# Juan #2
db.orders.insertOne({
  user_id: JUAN,
  items: [
    { product_id: P0004, name: 'Laptop 14" Ryzen 7', photo: "/imgs/product-04.jpg", quantity: NumberInt(1), unit_price: new Double(2699.0), currency: "PEN", subtotal: new Double(2699.0) }
  ],
  totals: { subtotal: new Double(2699.0), discount: new Double(0), shipping: new Double(0), tax: new Double(0), grand_total: new Double(2699.0) },
  order_status: "En Proceso",
  payment: { method: "tarjeta", transaction_id: null, paid_at: null },
  notes: null,
  created_at: new Date("2025-11-08T01:00:00Z"),
  updated_at: null
});

# María #1
db.orders.insertOne({
  user_id: MARIA,
  items: [
    { product_id: P0002, name: 'Smart TV 65" 4K',     photo: "/imgs/product-02.jpg", quantity: NumberInt(1), unit_price: new Double(2999.9), currency: "PEN", subtotal: new Double(2999.9) },
    { product_id: P0009, name: "Barra de Sonido 2.1", photo: "/imgs/product-09.jpg", quantity: NumberInt(1), unit_price: new Double(679.0),  currency: "PEN", subtotal: new Double(679.0) }
  ],
  totals: { subtotal: new Double(3678.9), discount: new Double(0), shipping: new Double(0), tax: new Double(0), grand_total: new Double(3678.9) },
  order_status: "Verificado",
  payment: { method: "plin", transaction_id: null, paid_at: new Date("2025-11-08T02:00:00Z") },
  notes: null,
  created_at: new Date("2025-11-08T01:30:00Z"),
  updated_at: null
});

# María #2
db.orders.insertOne({
  user_id: MARIA,
  items: [
    { product_id: P0020, name: "Cámara de Seguridad Wi-Fi", photo: "/imgs/product-20.jpg", quantity: NumberInt(2), unit_price: new Double(329.0), currency: "PEN", subtotal: new Double(658.0) }
  ],
  totals: { subtotal: new Double(658.0), discount: new Double(0), shipping: new Double(0), tax: new Double(0), grand_total: new Double(658.0) },
  order_status: "Verificado",
  payment: { method: "transferencia", transaction_id: null, paid_at: new Date("2025-11-08T03:00:00Z") },
  notes: null,
  created_at: new Date("2025-11-08T02:45:00Z"),
  updated_at: null
});


# 5) Reseñas (2 por cada cliente)

# Juan #1 sobre SKU-0001
db.reviews.insertOne({
  product_id: P0001,
  user_id: JUAN,
  title: "Excelente compra",
  body: "La imagen es nítida y el sonido cumple. Muy recomendado.",
  rating: NumberInt(5),
  pros: ["Imagen", "Facilidad de uso"],
  cons: [],
  purchase_verified: true,
  helpful_count: NumberInt(0),
  status: "published",
  moderation: null,
  created_at: new Date("2025-11-08T04:00:00Z"),
  updated_at: null
});

# Juan #2 sobre SKU-0004
db.reviews.insertOne({
  product_id: P0004,
  user_id: JUAN,
  title: "Buen rendimiento",
  body: "Rápida para estudio y trabajo. La batería podría durar más.",
  rating: NumberInt(4),
  pros: ["Rendimiento"],
  cons: ["Batería"],
  purchase_verified: true,
  helpful_count: NumberInt(0),
  status: "published",
  moderation: null,
  created_at: new Date("2025-11-08T05:00:00Z"),
  updated_at: null
});

# María #1 sobre SKU-0002
db.reviews.insertOne({
  product_id: P0002,
  user_id: MARIA,
  title: "Buen tamaño y colores",
  body: "Colores bien logrados y configuración sencilla.",
  rating: NumberInt(4),
  pros: ["Colores", "Configuración"],
  cons: [],
  purchase_verified: true,
  helpful_count: NumberInt(0),
  status: "published",
  moderation: null,
  created_at: new Date("2025-11-08T04:30:00Z"),
  updated_at: null
});

# María #2 sobre SKU-0009
db.reviews.insertOne({
  product_id: P0009,
  user_id: MARIA,
  title: "Potente para películas",
  body: "Suena fuerte y claro, suficientes puertos.",
  rating: NumberInt(5),
  pros: ["Potencia", "Claridad"],
  cons: [],
  purchase_verified: true,
  helpful_count: NumberInt(0),
  status: "published",
  moderation: null,
  created_at: new Date("2025-11-08T05:15:00Z"),
  updated_at: null
});

# 6) Comentarios (1 por cada cliente, sobre una de sus reseñas)
# --- Resolver productos ---
const tv55  = db.products.findOne({ sku: "SKU-0001" }, { _id: 1 });
const tv65  = db.products.findOne({ sku: "SKU-0002" }, { _id: 1 });
if (!tv55) { throw new Error("SKU-0001 no encontrado"); }
if (!tv65) { throw new Error("SKU-0002 no encontrado"); }

# --- Resolver reseñas objetivo ---
const revJuanTV55 = db.reviews.findOne({ user_id: JUAN,  product_id: tv55._id, title: "Excelente compra" }, { _id: 1 });
const revMariaTV65 = db.reviews.findOne({ user_id: MARIA, product_id: tv65._id, title: "Buen tamaño y colores" }, { _id: 1 });
if (!revJuanTV55)  { throw new Error("Reseña de Juan para SKU-0001 no encontrada"); }
if (!revMariaTV65) { throw new Error("Reseña de María para SKU-0002 no encontrada"); }

# --- Insertar comentarios ---

# Comentario de Juan en su reseña del TV 55"
db.comments.insertOne({
  review_id: revJuanTV55._id,
  product_id: tv55._id,
  user_id: JUAN,
  parent_id: null,
  body: "Después de 2 semanas, todo sigue perfecto 👍",
  status: "published",
  created_at: new Date("2025-11-08T06:00:00Z"),
  updated_at: null
});

# Comentario de María en su reseña del TV 65"
db.comments.insertOne({
  review_id: revMariaTV65._id,
  product_id: tv65._id,
  user_id: MARIA,
  parent_id: null,
  body: "Confirmo que el color es muy bueno en películas.",
  status: "published",
  created_at: new Date("2025-11-08T06:10:00Z"),
  updated_at: null
});