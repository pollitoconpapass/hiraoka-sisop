use hiraoka

# ============================
# users
# ============================
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name","email","password_hash","role","created_at","status"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^[^@]+@[^@]+\\.[^@]+$" },
        password_hash: { bsonType: "string" },
        role: { enum: ["admin","cliente"] },
        status: { enum: ["active","blocked"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: ["date","null"] },
        meta: { bsonType: ["object","null"] }
      }
    }
  }
});
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

# ============================
# categories
# ============================
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        parent_id: { bsonType: ["objectId","null"] },
        path: { bsonType: ["array","null"], items: { bsonType: "objectId" } }
      }
    }
  }
});
db.categories.createIndex({ name: 1 }, { unique: false });
db.categories.createIndex({ parent_id: 1 });

# ============================
# products
# ============================
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sku","name","price","created_at","images"],
      properties: {
        _id: { bsonType: "objectId" },
        sku: { bsonType: "string" },
        name: { bsonType: "string" },
        brand: { bsonType: ["string","null"] },
        category_id: { bsonType: ["objectId","null"] },
        price: { bsonType: "double" },
        specs: { bsonType: ["object","null"] },
        images: { bsonType: "array", minItems: 1, items: { bsonType: "string" } },
        primary_image: { bsonType: ["string","null"] },
        ratings: {
          bsonType: "object",
          required: ["avg","count"],
          properties: {
            avg: { bsonType: "double" },
            count: { bsonType: "int" },
            breakdown: { bsonType: ["object","null"] }
          }
        },
        reviews_count: { bsonType: ["int","null"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: ["date","null"] }
      }
    }
  }
});
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ name: "text" }, { default_language: "spanish" });
db.products.createIndex({ category_id: 1 });

# ============================
# reviews
# ============================
db.createCollection("reviews", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id","user_id","rating","body","status","created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        product_id: { bsonType: "objectId" },
        user_id: { bsonType: "objectId" },
        title: { bsonType: ["string","null"] },
        body: { bsonType: "string" },
        rating: { bsonType: "int", minimum: 1, maximum: 5 },
        pros: { bsonType: ["array","null"], items: { bsonType: "string" } },
        cons: { bsonType: ["array","null"], items: { bsonType: "string" } },
        purchase_verified: { bsonType: ["bool","null"] },
        helpful_count: { bsonType: ["int","null"] },
        status: { enum: ["pending","published","rejected"] },
        moderation: {
          bsonType: ["object","null"],
          properties: {
            flags: { bsonType: ["array","null"], items: { bsonType: "string" } },
            reason: { bsonType: ["string","null"] },
            by_user_id: { bsonType: ["objectId","null"] },
            at: { bsonType: ["date","null"] }
          }
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: ["date","null"] }
      }
    }
  }
});
db.reviews.createIndex({ product_id: 1, created_at: -1 });
db.reviews.createIndex({ rating: 1 });
db.reviews.createIndex({ status: 1 });

# ============================
# comments
# ============================
db.createCollection("comments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id","body","status","created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        review_id: { bsonType: ["objectId","null"] },
        product_id: { bsonType: ["objectId","null"] },
        user_id: { bsonType: "objectId" },
        parent_id: { bsonType: ["objectId","null"] },
        body: { bsonType: "string" },
        status: { enum: ["pending","published","rejected"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: ["date","null"] }
      }
    }
  }
});
db.comments.createIndex({ review_id: 1, created_at: 1 });
db.comments.createIndex({ product_id: 1, created_at: 1 });
db.comments.createIndex({ parent_id: 1 });

# ============================
# review_votes
# ============================
db.createCollection("review_votes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["review_id","user_id","value","created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        review_id: { bsonType: "objectId" },
        user_id: { bsonType: "objectId" },
        value: { enum: [1,-1] },
        created_at: { bsonType: "date" }
      }
    }
  }
});
db.review_votes.createIndex({ review_id: 1, user_id: 1 }, { unique: true });

# ============================
# orders
# ============================
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id","items","order_status","payment","created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        user_id: { bsonType: "objectId" },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["product_id","name","photo","quantity","unit_price"],
            properties: {
              product_id: { bsonType: "objectId" },
              name: { bsonType: "string" },
              photo: { bsonType: "string" },
              quantity: { bsonType: "int", minimum: 1 },
              unit_price: { bsonType: "double" },
              currency: { bsonType: ["string","null"] },
              subtotal: { bsonType: ["double","null"] }
            }
          }
        },
        totals: {
          bsonType: "object",
          properties: {
            subtotal: { bsonType: "double" },
            discount: { bsonType: ["double","null"] },
            shipping: { bsonType: ["double","null"] },
            tax: { bsonType: ["double","null"] },
            grand_total: { bsonType: "double" }
          }
        },
        order_status: { enum: ["Verificado","En Proceso","Cancelado"] },
        payment: {
          bsonType: "object",
          required: ["method"],
          properties: {
            method: { enum: ["tarjeta","yape","plin","transferencia","efectivo","otro"] },
            transaction_id: { bsonType: ["string","null"] },
            paid_at: { bsonType: ["date","null"] }
          }
        },
        notes: { bsonType: ["string","null"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: ["date","null"] }
      }
    }
  }
});
db.orders.createIndex({ user_id: 1, created_at: -1 });
db.orders.createIndex({ order_status: 1 });
db.orders.createIndex({ "items.product_id": 1 });