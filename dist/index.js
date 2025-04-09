var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/models/user.model.ts
var user_model_exports = {};
__export(user_model_exports, {
  User: () => User
});
import { Schema } from "mongoose";
var userSchema, User;
var init_user_model = __esm({
  "server/models/user.model.ts"() {
    "use strict";
    init_mongodb();
    userSchema = new Schema({
      name: { type: String, required: true },
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      role: { type: String, enum: ["admin", "seller", "buyer"], default: "buyer" },
      createdAt: { type: Date, default: Date.now }
    }, {
      timestamps: true
    });
    User = mongoose2.model("User", userSchema);
  }
});

// server/config/mongodb.ts
import mongoose2 from "mongoose";
import MongoStore from "connect-mongo";
async function connectToDatabase() {
  const maxRetries = 5;
  const retryDelay = 5e3;
  let retryCount = 0;
  const cleanupListeners = () => {
    if (connectionListeners) {
      mongoose2.connection.off("error", connectionListeners.error);
      mongoose2.connection.off("disconnected", connectionListeners.disconnected);
      connectionListeners = null;
    }
  };
  const tryConnect = async () => {
    try {
      if (isConnecting) {
        console.log("Connection attempt already in progress...");
        return true;
      }
      if (mongoose2.connection.readyState === 1) {
        console.log("MongoDB is already connected.");
        return true;
      }
      isConnecting = true;
      console.log("Attempting to connect to MongoDB...");
      cleanupListeners();
      const errorHandler = async (err) => {
        console.error("MongoDB connection error:", err);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          await tryConnect();
        } else {
          console.error("Max retries reached. Could not connect to MongoDB.");
          process.exit(1);
        }
      };
      const disconnectHandler = async () => {
        console.log("MongoDB disconnected. Attempting to reconnect...");
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          await tryConnect();
        } else {
          console.error("Max retries reached. Could not reconnect to MongoDB.");
          process.exit(1);
        }
      };
      connectionListeners = {
        error: errorHandler,
        disconnected: disconnectHandler
      };
      mongoose2.connection.on("error", errorHandler);
      mongoose2.connection.on("disconnected", disconnectHandler);
      await mongoose2.connect(MONGODB_URL, {
        ...mongooseOptions,
        serverSelectionTimeoutMS: 5e3,
        heartbeatFrequencyMS: 2e3,
        // Enable connection pooling
        maxPoolSize: 50,
        minPoolSize: 10
      });
      if (mongoose2.connection.readyState !== 1) {
        throw new Error(`MongoDB connection failed. Connection state: ${mongoose2.connection.readyState}`);
      }
      console.log("Successfully connected to MongoDB.");
      if (process.env.NODE_ENV === "development") {
        await insertSampleData();
      }
      isConnecting = false;
      return true;
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      isConnecting = false;
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return tryConnect();
      } else {
        console.error("Max retries reached. Could not connect to MongoDB.");
        throw error;
      }
    }
  };
  return tryConnect();
}
async function insertSampleData() {
  try {
    const { User: User2 } = (init_user_model(), __toCommonJS(user_model_exports));
    const count = await User2.countDocuments();
    if (count === 0) {
      const sampleUsers = [
        { name: "John Doe", email: "john@example.com", role: "buyer" },
        { name: "Jane Smith", email: "jane@example.com", role: "seller" }
      ];
      await User2.insertMany(sampleUsers);
      console.log("Inserted sample users.");
    } else {
      console.log("Sample data already exists.");
    }
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
}
async function closeDatabaseConnection() {
  try {
    await mongoose2.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
}
var MONGODB_URL, mongooseOptions, isConnecting, connectionListeners, sessionStore;
var init_mongodb = __esm({
  "server/config/mongodb.ts"() {
    "use strict";
    MONGODB_URL = process.env.MONGODB_URL;
    mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
      ssl: true,
      tlsAllowInvalidCertificates: false,
      maxPoolSize: 50,
      socketTimeoutMS: 45e3,
      family: 4
    };
    isConnecting = false;
    connectionListeners = null;
    sessionStore = MongoStore.create({
      mongoUrl: MONGODB_URL,
      ttl: 24 * 60 * 60,
      // Session TTL (1 day)
      autoRemove: "native"
    });
  }
});

// server/index.ts
import express6 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/storage/mongodb.ts
init_mongodb();
import mongoose4 from "mongoose";

// server/models/index.ts
init_user_model();

// server/db.ts
init_mongodb();

// server/models/category.model.ts
import { Schema as Schema2 } from "mongoose";
var categorySchema = new Schema2({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema2.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});
var Category = mongoose2.model("Category", categorySchema);

// server/models/brand.model.ts
import { Schema as Schema3 } from "mongoose";
var brandSchema = new Schema3({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema3.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});
var Brand = mongoose2.model("Brand", brandSchema);

// server/models/product.model.ts
import { Schema as Schema4 } from "mongoose";
var productVariantSchema = new Schema4({
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    default: null
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true
  }
});
var nutritionalInfoSchema = new Schema4({
  calories: { type: Number },
  protein: { type: Number },
  carbohydrates: { type: Number },
  fat: { type: Number },
  fiber: { type: Number },
  vitamins: { type: String },
  minerals: { type: String },
  additionalInfo: { type: String }
});
var shippingDetailsSchema = new Schema4({
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  shippingCharges: { type: Number, default: null },
  deliveryTime: { type: String },
  returnPolicy: {
    allowed: { type: Boolean, default: false },
    conditions: { type: String }
  }
});
var legalCertificationsSchema = new Schema4({
  fssaiLicense: { type: String },
  organicCertification: { type: String },
  batchNumber: { type: String },
  manufactureDate: { type: Date },
  expiryDate: { type: Date }
});
var seoDetailsSchema = new Schema4({
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }]
});
var productSchema = new Schema4({
  // Basic Product Information
  name: {
    type: String,
    required: true
  },
  category: {
    type: Schema4.Types.ObjectId,
    ref: "Category",
    required: true
  },
  brand: {
    type: Schema4.Types.ObjectId,
    ref: "Brand",
    default: null
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  productType: {
    type: String,
    enum: ["Simple", "Variable"],
    default: "Simple"
  },
  tags: [{
    type: String
  }],
  isOrganic: {
    type: Boolean,
    default: true
  },
  // Product Variants
  variants: [productVariantSchema],
  // Media
  mainImage: {
    type: String,
    required: true
  },
  additionalImages: [{
    type: String
  }],
  video: {
    type: String,
    default: null
  },
  // Description
  shortDescription: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String,
    required: true
  },
  nutritionalInfo: {
    type: nutritionalInfoSchema,
    default: null
  },
  ingredients: {
    type: String
  },
  shelfLife: {
    type: String
  },
  // Shipping & Delivery
  shippingDetails: {
    type: shippingDetailsSchema,
    default: () => ({})
  },
  // Legal & Certifications
  legalCertifications: {
    type: legalCertificationsSchema,
    default: null
  },
  // SEO Details
  seoDetails: {
    type: seoDetailsSchema,
    default: () => ({})
  },
  // Other Details
  sellerId: {
    type: Schema4.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
  // Automatically manage createdAt and updatedAt
});
var product_model_default = mongoose2.model("Product", productSchema);
var Product = mongoose2.model("Product", productSchema);

// server/models/heroSlider.model.ts
import { Schema as Schema5 } from "mongoose";
var heroSliderSchema = new Schema5({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema5.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});
var HeroSlider = mongoose2.model("HeroSlider", heroSliderSchema);

// server/models/promoAd.model.ts
import { Schema as Schema6 } from "mongoose";
var promoAdSchema = new Schema6({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  image: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema6.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});
var PromoAd = mongoose2.model("PromoAd", promoAdSchema);

// server/models/ebook.model.ts
import { Schema as Schema7 } from "mongoose";
var ebookSchema = new Schema7({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  fileUrl: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema7.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});
var Ebook = mongoose2.model("Ebook", ebookSchema);

// server/models/order.model.ts
import { Schema as Schema8 } from "mongoose";
var orderSchema = new Schema8({
  buyerId: {
    type: Schema8.Types.ObjectId,
    ref: "User",
    required: true
  },
  address: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
var Order = mongoose2.model("Order", orderSchema);

// server/models/orderItem.model.ts
import { Schema as Schema9 } from "mongoose";
var orderItemSchema = new Schema9({
  orderId: {
    type: Schema9.Types.ObjectId,
    ref: "Order",
    required: true
  },
  productId: {
    type: Schema9.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
var OrderItem = mongoose2.model("OrderItem", orderItemSchema);

// server/models/cart.model.ts
import { Schema as Schema10 } from "mongoose";
var cartSchema = new Schema10({
  userId: {
    type: Schema10.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
cartSchema.virtual("items", {
  ref: "CartItem",
  localField: "_id",
  foreignField: "cartId"
});
cartSchema.set("toObject", { virtuals: true });
cartSchema.set("toJSON", { virtuals: true });
var Cart = mongoose2.model("Cart", cartSchema);

// server/models/cartItem.model.ts
import { Schema as Schema11 } from "mongoose";
var cartItemSchema = new Schema11({
  cartId: {
    type: Schema11.Types.ObjectId,
    ref: "Cart",
    required: true
  },
  productId: {
    type: Schema11.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, {
  timestamps: true
});
cartItemSchema.index({ cartId: 1, productId: 1 }, { unique: true });
var CartItem = mongoose2.model("CartItem", cartItemSchema);

// server/models/review.model.ts
import { Schema as Schema12 } from "mongoose";
var reviewSchema = new Schema12({
  userId: {
    type: Schema12.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: Schema12.Types.ObjectId,
    ref: "Product",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
var Review = mongoose2.model("Review", reviewSchema);

// server/models/wishlist.model.ts
import mongoose3, { Schema as Schema13 } from "mongoose";
var wishlistSchema = new Schema13({
  userId: { type: Schema13.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema13.Types.ObjectId, ref: "Product", required: true }
}, { timestamps: true });
var Wishlist = mongoose3.model("Wishlist", wishlistSchema);

// server/models/payment.model.ts
import { Schema as Schema14 } from "mongoose";
var paymentSchema = new Schema14({
  orderId: {
    type: Schema14.Types.ObjectId,
    ref: "Order",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  method: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer", "cash_on_delivery"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "refunded"],
    default: "pending"
  },
  transactionId: {
    type: String,
    sparse: true
  },
  paymentDetails: {
    type: Schema14.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});
var Payment = mongoose2.model("Payment", paymentSchema);

// server/storage/mongodb.ts
var MongoDBStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = sessionStore;
  }
  // User operations
  async getUser(id) {
    try {
      if (!id) {
        console.error("Invalid user ID provided");
        return void 0;
      }
      const user = await User.findById(id).exec();
      if (!user) {
        console.log(`No user found with ID: ${id}`);
        return void 0;
      }
      return user.toObject();
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }
  async getUserByUsername(username) {
    try {
      if (!username) {
        console.error("Invalid username provided");
        return void 0;
      }
      const user = await User.findOne({ username }).exec();
      if (!user) {
        console.log(`No user found with username: ${username}`);
        return void 0;
      }
      return user.toObject();
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw new Error("Failed to fetch user from MongoDB");
    }
  }
  async getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user ? user.toObject() : void 0;
  }
  async createUser(user) {
    const newUser = new User(user);
    await newUser.save();
    return newUser.toObject();
  }
  async updateUser(id, user) {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser ? updatedUser.toObject() : void 0;
  }
  async deleteUser(id) {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
  async getAllUsers() {
    const users = await User.find();
    return users.map((user) => user.toObject());
  }
  async getUsersByRole(role) {
    const users = await User.find({ role });
    return users.map((user) => user.toObject());
  }
  // Category operations
  async getCategory(id) {
    try {
      if (!mongoose4.Types.ObjectId.isValid(id)) {
        console.error("Invalid category ID format");
        return void 0;
      }
      const category = await Category.findById(id).populate("createdBy", "name username").exec();
      if (!category) {
        console.log(`No category found with ID: ${id}`);
        return void 0;
      }
      return category.toObject();
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to fetch category from database");
    }
  }
  async getCategoryByName(name) {
    const category = await Category.findOne({ name });
    return category ? category.toObject() : void 0;
  }
  async createCategory(category) {
    try {
      if (!category.name || !category.image || !category.description || !category.createdBy) {
        throw new Error("Missing required fields");
      }
      let createdById = category.createdBy;
      if (typeof createdById === "number" || typeof createdById === "string" && !isNaN(Number(createdById))) {
        createdById = createdById.toString();
      }
      let createdByObjectId;
      try {
        if (mongoose4.Types.ObjectId.isValid(createdById)) {
          createdByObjectId = createdById;
        } else {
          createdByObjectId = new mongoose4.Types.ObjectId(createdById);
        }
      } catch (error) {
        console.error("Failed to convert user ID to ObjectId:", error);
        throw new Error("Invalid user ID format");
      }
      const categoryData = {
        name: category.name,
        description: category.description,
        image: category.image,
        createdBy: createdByObjectId
        // Use the validated/converted ObjectId
      };
      const newCategory = new Category(categoryData);
      await newCategory.save();
      return newCategory.toObject();
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof Error) {
        if (error.code === 11e3) {
          throw new Error("Category with this name already exists");
        }
        if (error.name === "ValidationError") {
          const validationError = Object.values(error.errors).map((err) => err.message).join(", ");
          throw new Error(`Validation failed: ${validationError}`);
        }
      }
      throw new Error("Failed to create category");
    }
  }
  async updateCategory(id, category) {
    const updatedCategory = await Category.findByIdAndUpdate(id, category, { new: true });
    return updatedCategory ? updatedCategory.toObject() : void 0;
  }
  async deleteCategory(id) {
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }
  async getAllCategories() {
    const categories = await Category.find();
    return categories.map((category) => category.toObject());
  }
  // Brand operations
  async getBrand(id) {
    try {
      if (!mongoose4.Types.ObjectId.isValid(id)) {
        console.error("Invalid brand ID format");
        return void 0;
      }
      const brand = await Brand.findById(id).populate("createdBy", "name username").exec();
      if (!brand) {
        console.log(`No brand found with ID: ${id}`);
        return void 0;
      }
      return brand.toObject();
    } catch (error) {
      console.error("Error fetching brand:", error);
      throw new Error("Failed to fetch brand from database");
    }
  }
  async getBrandByName(name) {
    const brand = await Brand.findOne({ name });
    return brand ? brand.toObject() : void 0;
  }
  async createBrand(brand) {
    const newBrand = new Brand(brand);
    await newBrand.save();
    return newBrand.toObject();
  }
  async updateBrand(id, brand) {
    const updatedBrand = await Brand.findByIdAndUpdate(id, brand, { new: true });
    return updatedBrand ? updatedBrand.toObject() : void 0;
  }
  async deleteBrand(id) {
    const result = await Brand.findByIdAndDelete(id);
    return !!result;
  }
  async getAllBrands() {
    const brands = await Brand.find();
    return brands.map((brand) => brand.toObject());
  }
  // Product operations
  async getProduct(id) {
    try {
      if (!mongoose4.Types.ObjectId.isValid(id)) {
        console.error("Invalid product ID format");
        return void 0;
      }
      const product = await Product.findById(id).populate("category").populate("brand").exec();
      if (!product) {
        console.log(`No product found with ID: ${id}`);
        return void 0;
      }
      return product.toObject();
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new Error("Failed to fetch product from database");
    }
  }
  async createProduct(product) {
    const newProduct = new Product(product);
    await newProduct.save();
    return newProduct.toObject();
  }
  async updateProduct(id, product) {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    return updatedProduct ? updatedProduct.toObject() : void 0;
  }
  async deleteProduct(id) {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
  async getAllProducts() {
    const products = await Product.find();
    return products.map((product) => product.toObject());
  }
  async getProductsByCategory(categoryId) {
    const products = await Product.find({ categoryId });
    return products.map((product) => product.toObject());
  }
  async getProductsByBrand(brandId) {
    const products = await Product.find({ brandId });
    return products.map((product) => product.toObject());
  }
  async getProductsBySeller(sellerId) {
    const products = await Product.find({ sellerId });
    return products.map((product) => product.toObject());
  }
  // HeroSlider operations
  async getHeroSlider(id) {
    const heroSlider = await HeroSlider.findById(id);
    return heroSlider ? heroSlider.toObject() : void 0;
  }
  async createHeroSlider(heroSlider) {
    const newHeroSlider = new HeroSlider(heroSlider);
    await newHeroSlider.save();
    return newHeroSlider.toObject();
  }
  async updateHeroSlider(id, heroSlider) {
    const updatedHeroSlider = await HeroSlider.findByIdAndUpdate(id, heroSlider, { new: true });
    return updatedHeroSlider ? updatedHeroSlider.toObject() : void 0;
  }
  async deleteHeroSlider(id) {
    const result = await HeroSlider.findByIdAndDelete(id);
    return !!result;
  }
  async getAllHeroSliders() {
    const heroSliders = await HeroSlider.find();
    return heroSliders.map((heroSlider) => heroSlider.toObject());
  }
  async getActiveHeroSliders() {
    const heroSliders = await HeroSlider.find({ isActive: true });
    return heroSliders.map((heroSlider) => heroSlider.toObject());
  }
  // PromoAd operations
  async getPromoAd(id) {
    const promoAd = await PromoAd.findById(id);
    return promoAd ? promoAd.toObject() : void 0;
  }
  async createPromoAd(promoAd) {
    const newPromoAd = new PromoAd(promoAd);
    await newPromoAd.save();
    return newPromoAd.toObject();
  }
  async updatePromoAd(id, promoAd) {
    const updatedPromoAd = await PromoAd.findByIdAndUpdate(id, promoAd, { new: true });
    return updatedPromoAd ? updatedPromoAd.toObject() : void 0;
  }
  async deletePromoAd(id) {
    const result = await PromoAd.findByIdAndDelete(id);
    return !!result;
  }
  async getAllPromoAds() {
    const promoAds = await PromoAd.find();
    return promoAds.map((promoAd) => promoAd.toObject());
  }
  async getActivePromoAds() {
    const promoAds = await PromoAd.find({ isActive: true });
    return promoAds.map((promoAd) => promoAd.toObject());
  }
  // Ebook operations
  async getEbook(id) {
    const ebook = await Ebook.findById(id);
    return ebook ? ebook.toObject() : void 0;
  }
  async createEbook(ebook) {
    const newEbook = new Ebook(ebook);
    await newEbook.save();
    return newEbook.toObject();
  }
  async updateEbook(id, ebook) {
    const updatedEbook = await Ebook.findByIdAndUpdate(id, ebook, { new: true });
    return updatedEbook ? updatedEbook.toObject() : void 0;
  }
  async deleteEbook(id) {
    const result = await Ebook.findByIdAndDelete(id);
    return !!result;
  }
  async getAllEbooks() {
    const ebooks = await Ebook.find();
    return ebooks.map((ebook) => ebook.toObject());
  }
  // Order operations
  async getOrder(id) {
    const order = await Order.findById(id);
    return order ? order.toObject() : void 0;
  }
  async createOrder(order) {
    const newOrder = new Order(order);
    await newOrder.save();
    return newOrder.toObject();
  }
  async updateOrder(id, order) {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, { new: true });
    return updatedOrder ? updatedOrder.toObject() : void 0;
  }
  async deleteOrder(id) {
    const result = await Order.findByIdAndDelete(id);
    return !!result;
  }
  async getAllOrders() {
    const orders = await Order.find();
    return orders.map((order) => order.toObject());
  }
  async getOrdersByBuyer(buyerId) {
    const orders = await Order.find({ buyerId });
    return orders.map((order) => order.toObject());
  }
  async getOrdersByStatus(status) {
    const orders = await Order.find({ status });
    return orders.map((order) => order.toObject());
  }
  // OrderItem operations
  async getOrderItem(id) {
    const orderItem = await OrderItem.findById(id);
    return orderItem ? orderItem.toObject() : void 0;
  }
  async createOrderItem(orderItem) {
    const newOrderItem = new OrderItem(orderItem);
    await newOrderItem.save();
    return newOrderItem.toObject();
  }
  async updateOrderItem(id, orderItem) {
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(id, orderItem, { new: true });
    return updatedOrderItem ? updatedOrderItem.toObject() : void 0;
  }
  async deleteOrderItem(id) {
    const result = await OrderItem.findByIdAndDelete(id);
    return !!result;
  }
  async getOrderItemsByOrder(orderId) {
    const orderItems = await OrderItem.find({ orderId });
    return orderItems.map((orderItem) => orderItem.toObject());
  }
  // Cart operations
  async getCart(id) {
    const cart = await Cart.findById(id);
    return cart ? cart.toObject() : void 0;
  }
  async getCartByUser(userId) {
    const cart = await Cart.findOne({ userId });
    return cart ? cart.toObject() : void 0;
  }
  async createCart(cart) {
    const newCart = new Cart(cart);
    await newCart.save();
    return newCart.toObject();
  }
  async deleteCart(id) {
    const result = await Cart.findByIdAndDelete(id);
    return !!result;
  }
  // CartItem operations
  async getCartItem(id) {
    const cartItem = await CartItem.findById(id);
    return cartItem ? cartItem.toObject() : void 0;
  }
  async createCartItem(cartItem) {
    const newCartItem = new CartItem(cartItem);
    await newCartItem.save();
    return newCartItem.toObject();
  }
  async updateCartItem(id, cartItem) {
    const updatedCartItem = await CartItem.findByIdAndUpdate(id, cartItem, { new: true });
    return updatedCartItem ? updatedCartItem.toObject() : void 0;
  }
  async deleteCartItem(id) {
    const result = await CartItem.findByIdAndDelete(id);
    return !!result;
  }
  async getCartItemsByCart(cartId) {
    const cartItems = await CartItem.find({ cartId });
    return cartItems.map((cartItem) => cartItem.toObject());
  }
  // Review operations
  async getReview(id) {
    const review = await Review.findById(id);
    return review ? review.toObject() : void 0;
  }
  async createReview(review) {
    const newReview = new Review(review);
    await newReview.save();
    return newReview.toObject();
  }
  async updateReview(id, review) {
    const updatedReview = await Review.findByIdAndUpdate(id, review, { new: true });
    return updatedReview ? updatedReview.toObject() : void 0;
  }
  async deleteReview(id) {
    const result = await Review.findByIdAndDelete(id);
    return !!result;
  }
  async getReviewsByProduct(productId) {
    const reviews = await Review.find({ productId });
    return reviews.map((review) => review.toObject());
  }
  async getReviewsByUser(userId) {
    const reviews = await Review.find({ userId });
    return reviews.map((review) => review.toObject());
  }
  // Wishlist operations
  async getWishlist(id) {
    const wishlist = await Wishlist.findById(id);
    return wishlist ? wishlist.toObject() : void 0;
  }
  async createWishlist(wishlist) {
    const newWishlist = new Wishlist(wishlist);
    await newWishlist.save();
    return newWishlist.toObject();
  }
  async deleteWishlist(id) {
    const result = await Wishlist.findByIdAndDelete(id);
    return !!result;
  }
  async getWishlistsByUser(userId) {
    const wishlists = await Wishlist.find({ userId });
    return wishlists.map((wishlist) => wishlist.toObject());
  }
};

// server/storage.ts
var storage = new MongoDBStorage();

// server/auth.ts
var scryptAsync = promisify(_scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) return false;
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
async function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "orgpick-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24,
      // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        let user;
        try {
          user = await storage.getUserByUsername(username);
          if (!user) {
            console.log(`Login failed: User '${username}' not found`);
            return done(null, false, { message: "Invalid username or password" });
          }
        } catch (error) {
          console.error("Database error during login:", error);
          if (error.name === "MongoServerError") {
            return done(null, false, { message: "Database connection error. Please try again later." });
          }
          return done(null, false, { message: "Unable to fetch user data. Please try again later." });
        }
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          console.log(`Login failed: Invalid password for user '${username}'`);
          return done(null, false, { message: "Invalid username or password" });
        }
        console.log(`User '${username}' logged in successfully`);
        return done(null, user);
      } catch (error) {
        console.error("Login error:", error);
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user._id || user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUserByUsername = await storage.getUserByUsername(req.body.username);
      const existingUserByEmail = await storage.getUserByEmail(req.body.email);
      if (existingUserByUsername || existingUserByEmail) {
        return res.status(400).json({
          error: "Username or email already exists"
        });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const userResponse = { ...user };
        delete userResponse.password;
        res.status(201).json(userResponse);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          error: info?.message || "Login failed: Unable to fetch user data"
        });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const userResponse = { ...user };
        delete userResponse.password;
        return res.status(200).json(userResponse);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }
    const userResponse = { ...req.user };
    delete userResponse.password;
    res.json(userResponse);
  });
}

// server/routes/payment.routes.ts
import express from "express";

// server/services/payment.service.ts
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
var PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
var PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
var paymentService = {
  // Process a credit card payment
  processCreditCardPayment: async (amount, cardDetails) => {
    try {
      if (cardDetails.number) {
        const isValid = cardDetails.number.length >= 13 && cardDetails.number.length <= 19 && cardDetails.expiry && cardDetails.cvv;
        if (!isValid) {
          return {
            success: false,
            error: "Invalid card details",
            status: "failed"
          };
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return {
        success: true,
        transactionId: `cc_${Date.now()}`,
        status: "completed"
      };
    } catch (error) {
      console.error("Credit card payment processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process credit card payment",
        status: "failed"
      };
    }
  },
  // Process a PayPal payment
  processPayPalPayment: async (amount, paypalDetails) => {
    try {
      if (paypalDetails.email) {
        const isValid = paypalDetails.email.includes("@") && paypalDetails.email.includes(".");
        if (!isValid) {
          return {
            success: false,
            error: "Invalid PayPal account details",
            status: "failed"
          };
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return {
        success: true,
        transactionId: `pp_${Date.now()}`,
        status: "completed"
      };
    } catch (error) {
      console.error("PayPal payment processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process PayPal payment",
        status: "failed"
      };
    }
  },
  // Process a bank transfer payment
  processBankTransfer: async (amount, transferDetails) => {
    try {
      const referenceNumber = `BT${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1e3)}`;
      return {
        success: true,
        transactionId: `bt_${Date.now()}`,
        referenceNumber,
        status: "pending",
        instructions: {
          accountNumber: "1234567890",
          ifscCode: "ABCD0001234",
          bankName: "National Bank",
          accountName: "Organic Marketplace"
        }
      };
    } catch (error) {
      console.error("Bank transfer processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process bank transfer",
        status: "failed"
      };
    }
  },
  // Verify a bank transfer payment (manual process)
  verifyBankTransfer: async (paymentId, verificationDetails) => {
    try {
      if (!verificationDetails.referenceNumber || !verificationDetails.transferDate) {
        return {
          success: false,
          verified: false,
          error: "Incomplete verification details",
          status: "pending"
        };
      }
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return {
        success: true,
        verified: true,
        verificationId: `verify_${Date.now()}`,
        status: "completed",
        verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      console.error("Bank transfer verification error:", error);
      return {
        success: false,
        verified: false,
        error: error instanceof Error ? error.message : "Failed to verify bank transfer",
        status: "failed"
      };
    }
  },
  // Process cash on delivery payment
  processCashOnDelivery: async (amount, codDetails = {}) => {
    try {
      const codFee = codDetails.codFee || 0;
      const totalAmount = amount + codFee;
      return {
        success: true,
        transactionId: `cod_${Date.now()}`,
        status: "processing",
        totalAmount,
        codFee
      };
    } catch (error) {
      console.error("Cash on delivery processing error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process cash on delivery",
        status: "failed"
      };
    }
  },
  // Generate payment receipt
  generateReceipt: async (paymentId) => {
    try {
      return {
        receiptId: `rcpt_${Date.now()}`,
        paymentId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        receiptUrl: `/receipts/${paymentId}.pdf`
      };
    } catch (error) {
      console.error("Receipt generation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate receipt"
      };
    }
  }
};

// server/controllers/payment.controller.ts
var paymentController = {
  // Process a new payment
  processPayment: async (req, res) => {
    try {
      const { orderId, method, amount } = req.body;
      if (!orderId || !method || !amount) {
        return res.status(400).json({ error: "Missing required payment information" });
      }
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const payment = new Payment({
        orderId,
        method,
        amount,
        currency: "INR",
        // Default currency
        status: "pending"
      });
      try {
        switch (method) {
          case "credit_card":
            const cardDetails = req.body.cardDetails || {};
            if (cardDetails.number) {
              if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
                return res.status(400).json({ error: "Incomplete card details provided" });
              }
            }
            const ccResult = await paymentService.processCreditCardPayment(amount, cardDetails);
            if (ccResult.success) {
              payment.status = ccResult.status;
              payment.transactionId = ccResult.transactionId;
              payment.paymentDetails = {
                ...payment.paymentDetails,
                lastFour: cardDetails.number ? cardDetails.number.slice(-4) : "xxxx",
                cardType: cardDetails.type || "Unknown"
              };
            } else {
              payment.status = "failed";
            }
            break;
          case "paypal":
            const paypalDetails = req.body.paypalDetails || {};
            const ppResult = await paymentService.processPayPalPayment(amount, paypalDetails);
            if (ppResult.success) {
              payment.status = ppResult.status;
              payment.transactionId = ppResult.transactionId;
            } else {
              payment.status = "failed";
            }
            break;
          case "bank_transfer":
            const btResult = await paymentService.processBankTransfer(amount, {
              orderId,
              customerName: req.body.customerName || "Customer"
            });
            if (btResult.success) {
              payment.status = btResult.status;
              payment.transactionId = btResult.transactionId;
              payment.paymentDetails = {
                instructions: "Please transfer to account #1234567890, IFSC Code: ABCD0001234",
                accountName: "Organic Marketplace",
                accountNumber: "1234567890",
                ifscCode: "ABCD0001234",
                bankName: "National Bank",
                reference: `Order-${orderId}`,
                referenceNumber: btResult.referenceNumber,
                note: "Please include your Order ID as reference when making the transfer",
                verificationRequired: true
              };
            } else {
              payment.status = "failed";
              payment.paymentDetails = { error: btResult.error };
            }
            break;
          case "cash_on_delivery":
            const codFee = 0;
            const codResult = await paymentService.processCashOnDelivery(amount, { codFee });
            if (codResult.success) {
              payment.status = codResult.status;
              payment.transactionId = codResult.transactionId;
              payment.paymentDetails = {
                codFee: codResult.codFee,
                payableAmount: codResult.totalAmount,
                instructions: "Payment will be collected at the time of delivery",
                note: "Please keep exact change ready for a smooth delivery experience",
                deliveryVerification: "Signature required on delivery"
              };
            } else {
              payment.status = "failed";
              payment.paymentDetails = { error: codResult.error };
            }
            break;
          default:
            return res.status(400).json({ error: "Invalid payment method" });
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        payment.status = "failed";
        payment.paymentDetails = { error: error.message };
      }
      await payment.save();
      if (payment.status === "completed") {
        order.status = "processing";
        await order.save();
      } else if (payment.status === "failed") {
        order.status = "pending";
        await order.save();
      } else if (payment.status === "processing") {
        order.status = "processing";
        await order.save();
      }
      return res.status(201).json({
        success: true,
        payment: {
          id: payment._id,
          orderId: payment.orderId,
          amount: payment.amount,
          method: payment.method,
          status: payment.status,
          createdAt: payment.createdAt
        }
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      return res.status(500).json({ error: "Failed to process payment" });
    }
  },
  // Get payment by ID
  getPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      return res.status(200).json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      return res.status(500).json({ error: "Failed to fetch payment details" });
    }
  },
  // Get payments for an order
  getPaymentsByOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const payments = await Payment.find({ orderId });
      return res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching order payments:", error);
      return res.status(500).json({ error: "Failed to fetch order payments" });
    }
  },
  // Update payment status (for admin/webhook callbacks)
  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      payment.status = status;
      if (transactionId) {
        payment.transactionId = transactionId;
      }
      await payment.save();
      if (status === "completed") {
        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = "processing";
          await order.save();
        }
      }
      return res.status(200).json({
        success: true,
        payment: {
          id: payment._id,
          status: payment.status,
          transactionId: payment.transactionId
        }
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      return res.status(500).json({ error: "Failed to update payment status" });
    }
  }
};

// server/routes/payment.routes.ts
var router = express.Router();
router.post("/", paymentController.processPayment);
router.get("/:id", paymentController.getPayment);
router.get("/order/:orderId", paymentController.getPaymentsByOrder);
router.patch("/:id/status", paymentController.updatePaymentStatus);
var payment_routes_default = router;

// server/routes/category.routes.ts
import express2 from "express";

// server/controllers/category.controller.ts
import mongoose5 from "mongoose";
var categoryController = {
  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  },
  // Get category by ID
  getCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      return res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      return res.status(500).json({ error: "Failed to fetch category details" });
    }
  },
  // Create a new category
  createCategory: async (req, res) => {
    try {
      const { name, image, description } = req.body;
      if (!req.user) {
        return res.status(401).json({
          error: "Unauthorized",
          details: "User must be authenticated to create a category"
        });
      }
      const userId = req.user.id;
      try {
        const userObjectId = mongoose5.Types.ObjectId.isValid(userId) ? userId : new mongoose5.Types.ObjectId(userId);
        const category = await storage.createCategory({
          name,
          image,
          description,
          createdBy: userObjectId
          // Use the validated ObjectId
        });
        return res.status(201).json(category);
      } catch (error) {
        console.error("Error processing user ID:", error);
        return res.status(400).json({
          error: "Invalid user ID format",
          details: "The user ID is not in a valid format"
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof Error) {
        if (error.code === 11e3) {
          return res.status(409).json({
            error: "Category already exists",
            details: "A category with this name already exists"
          });
        }
        if (error.name === "ValidationError") {
          return res.status(400).json({
            error: "Validation error",
            details: error.message
          });
        }
      }
      return res.status(500).json({
        error: "Internal server error",
        details: "Failed to create category due to an unexpected error"
      });
    }
  },
  // Update a category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      if (name && name !== category.name) {
        const existingCategory = await storage.getCategoryByName(name);
        if (existingCategory && existingCategory.id !== id) {
          return res.status(400).json({ error: "Category with this name already exists" });
        }
      }
      const updatedCategory = await storage.updateCategory(id, {
        name,
        image
      });
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({ error: "Failed to update category" });
    }
  },
  // Delete a category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      const deleted = await storage.deleteCategory(id);
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(500).json({ error: "Failed to delete category" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Failed to delete category" });
    }
  },
  // Get products by category
  getProductsByCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      const products = await storage.getProductsByCategory(id);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching category products:", error);
      return res.status(500).json({ error: "Failed to fetch category products" });
    }
  }
};

// server/middleware/auth.ts
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};
var isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};
var isAdminOrSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user && (req.user.role === "admin" || req.user.role === "seller")) {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

// server/routes/category.routes.ts
var router2 = express2.Router();
router2.get("/", categoryController.getAllCategories);
router2.get("/:id", categoryController.getCategory);
router2.get("/:id/products", categoryController.getProductsByCategory);
router2.post("/", isAdminOrSeller, categoryController.createCategory);
router2.put("/:id", isAdminOrSeller, categoryController.updateCategory);
router2.delete("/:id", isAdmin, categoryController.deleteCategory);
var category_routes_default = router2;

// server/routes/seller.routes.ts
import express3 from "express";

// server/models/seller.model.ts
import mongoose6, { Schema as Schema15 } from "mongoose";
var sellerSchema = new Schema15({
  userId: { type: Schema15.Types.ObjectId, ref: "User", required: true },
  personalDetails: { type: Object, required: true },
  businessDetails: { type: Object, required: true }
}, { timestamps: true });
var Seller = mongoose6.model("Seller", sellerSchema);
var seller_model_default = Seller;

// server/controllers/seller.controller.ts
init_user_model();
import mongoose7 from "mongoose";
var registerSeller = async (req, res) => {
  try {
    const { personalDetails, businessDetails } = req.body;
    const userId = req.user?.id || "000000000000000000000001";
    try {
      await User.findByIdAndUpdate(userId, { role: "seller" });
    } catch (error) {
      console.warn("Could not update user role, possibly using mock ID:", error);
    }
    const seller = new seller_model_default({
      userId,
      personalDetails,
      businessDetails: {
        ...businessDetails,
        status: "pending"
      }
    });
    await seller.save();
    res.status(201).json({
      message: "Seller registration successful",
      seller
    });
  } catch (error) {
    console.error("Seller registration error:", error);
    res.status(500).json({
      message: "Failed to register seller",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var getSellerStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const seller = await seller_model_default.findOne({ userId });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json({
      status: seller.businessDetails?.status || "Unknown",
      seller
    });
  } catch (error) {
    console.error("Get seller status error:", error);
    res.status(500).json({
      message: "Failed to get seller status",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var checkMongoDBConnection = async (_req, res) => {
  try {
    const isConnected = mongoose7.connection.readyState === 1;
    res.status(200).json({ connected: isConnected });
  } catch (error) {
    console.error("Error checking MongoDB connection:", error);
    res.status(500).json({
      connected: false,
      error: error instanceof Error ? error.message : "Failed to check MongoDB connection"
    });
  }
};

// server/routes/seller.routes.ts
var router3 = express3.Router();
router3.post("/register", registerSeller);
router3.get("/status", isAuthenticated, getSellerStatus);
router3.get("/check-db", checkMongoDBConnection);
var seller_routes_default = router3;

// server/routes/product.routes.ts
import express4 from "express";

// server/controllers/product.controller.ts
var getAllProducts = async (req, res) => {
  try {
    const products = await product_model_default.find().populate("category").populate("brand");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await product_model_default.find({ sellerId }).populate("category").populate("brand");
    res.json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({
      message: "Failed to fetch seller products",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await product_model_default.findById(productId).populate("category").populate("brand");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Failed to fetch product",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    productData.sellerId = productData.sellerId || userId;
    if (productData.category && typeof productData.category === "string") {
      try {
        if (!mongoose.Types.ObjectId.isValid(productData.category)) {
          productData.category = new mongoose.Types.ObjectId(productData.category);
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid category ID format" });
      }
    }
    if (productData.brand && typeof productData.brand === "string") {
      try {
        if (!mongoose.Types.ObjectId.isValid(productData.brand)) {
          productData.brand = new mongoose.Types.ObjectId(productData.brand);
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid brand ID format" });
      }
    }
    if (req.files) {
      const files = req.files;
      if (files.mainImage && files.mainImage[0]) {
        productData.mainImage = files.mainImage[0].path;
      }
      if (files.additionalImages) {
        productData.additionalImages = files.additionalImages.map((file) => file.path);
      }
      if (files.video && files.video[0]) {
        productData.video = files.video[0].path;
      }
    }
    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants = productData.variants.map((variant) => ({
        size: variant.size,
        color: variant.color || "",
        price: parseFloat(variant.price),
        discountPrice: variant.discountPrice ? parseFloat(variant.discountPrice) : null,
        stock: parseInt(variant.stock, 10),
        unit: variant.unit
      }));
    } else {
      productData.variants = [{
        size: productData.size || "Default",
        color: productData.color || "",
        price: parseFloat(productData.price),
        discountPrice: productData.discountPrice ? parseFloat(productData.discountPrice) : null,
        stock: parseInt(productData.stock, 10),
        unit: productData.unit || "Piece"
      }];
    }
    if (productData.legalCertifications) {
      if (productData.legalCertifications.manufactureDate) {
        productData.legalCertifications.manufactureDate = new Date(productData.legalCertifications.manufactureDate);
      }
      if (productData.legalCertifications.expiryDate) {
        productData.legalCertifications.expiryDate = new Date(productData.legalCertifications.expiryDate);
      }
    }
    const product = new product_model_default(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const product = await product_model_default.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const userRole = req.user?.role;
    if (product.sellerId.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }
    if (req.files) {
      const files = req.files;
      if (files.mainImage && files.mainImage[0]) {
        updateData.mainImage = files.mainImage[0].path;
      }
      if (files.additionalImages) {
        updateData.additionalImages = files.additionalImages.map((file) => file.path);
      }
      if (files.video && files.video[0]) {
        updateData.video = files.video[0].path;
      }
    }
    if (updateData.variants && Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants.map((variant) => ({
        size: variant.size,
        color: variant.color || "",
        price: parseFloat(variant.price),
        discountPrice: variant.discountPrice ? parseFloat(variant.discountPrice) : null,
        stock: parseInt(variant.stock, 10),
        unit: variant.unit
      }));
    }
    if (updateData.legalCertifications) {
      if (updateData.legalCertifications.manufactureDate) {
        updateData.legalCertifications.manufactureDate = new Date(updateData.legalCertifications.manufactureDate);
      }
      if (updateData.legalCertifications.expiryDate) {
        updateData.legalCertifications.expiryDate = new Date(updateData.legalCertifications.expiryDate);
      }
    }
    const updatedProduct = await product_model_default.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).populate("category").populate("brand");
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const product = await product_model_default.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const userRole = req.user?.role;
    if (product.sellerId.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }
    await product_model_default.findByIdAndDelete(productId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Failed to delete product",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// server/routes/product.routes.ts
import multer from "multer";
import path from "path";
import fs from "fs";
var storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "..", "uploads", "products");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
var fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"));
  }
};
var upload = multer({
  storage: storage2,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB max file size
  }
});
var router4 = express4.Router();
router4.get("/", getAllProducts);
router4.get("/:id", getProductById);
router4.get("/seller/:sellerId", getProductsBySeller);
router4.post(
  "/",
  isAuthenticated,
  isAdminOrSeller,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 7 },
    { name: "video", maxCount: 1 }
  ]),
  createProduct
);
router4.put(
  "/:id",
  isAuthenticated,
  isAdminOrSeller,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 7 },
    { name: "video", maxCount: 1 }
  ]),
  updateProduct
);
router4.delete("/:id", isAuthenticated, isAdminOrSeller, deleteProduct);
var product_routes_default = router4;

// server/controllers/auth.controller.ts
import { randomBytes as randomBytes2 } from "crypto";
import { scrypt } from "crypto";
import { promisify as promisify2 } from "util";
var scryptAsync2 = promisify2(scrypt);
var passwordResetTokens = {};
var requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, we have sent password reset instructions."
      });
    }
    const token = randomBytes2(32).toString("hex");
    const expires = /* @__PURE__ */ new Date();
    expires.setHours(expires.getHours() + 1);
    passwordResetTokens[token] = {
      userId: user.id || user._id,
      expires
    };
    const resetLink = `${req.protocol}://${req.get("host")}/reset-password?token=${token}`;
    console.log("Password reset link:", resetLink);
    return res.status(200).json({
      message: "If an account with that email exists, we have sent password reset instructions."
    });
  } catch (error) {
    next(error);
  }
};
var verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Invalid token" });
    }
    const resetData = passwordResetTokens[token];
    if (!resetData) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    if (/* @__PURE__ */ new Date() > resetData.expires) {
      delete passwordResetTokens[token];
      return res.status(400).json({ error: "Token has expired" });
    }
    return res.status(200).json({ valid: true });
  } catch (error) {
    next(error);
  }
};
var resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }
    const resetData = passwordResetTokens[token];
    if (!resetData) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    if (/* @__PURE__ */ new Date() > resetData.expires) {
      delete passwordResetTokens[token];
      return res.status(400).json({ error: "Token has expired" });
    }
    const user = await storage.getUser(resetData.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const salt = randomBytes2(16).toString("hex");
    const buf = await scryptAsync2(password, salt, 64);
    const hashedPassword = `${buf.toString("hex")}.${salt}`;
    await storage.updateUser(resetData.userId, { password: hashedPassword });
    delete passwordResetTokens[token];
    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    next(error);
  }
};

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.post("/api/auth/forgot-password", requestPasswordReset);
  app2.get("/api/auth/reset-password/verify", verifyResetToken);
  app2.post("/api/auth/reset-password", resetPassword);
  app2.use("/api/payments", payment_routes_default);
  app2.use("/api/categories", category_routes_default);
  app2.use("/api/seller", seller_routes_default);
  app2.post("/api/seller/register", registerSeller);
  app2.use("/api/products", product_routes_default);
  app2.get("/api/users", isAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      const sanitizedUsers = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(sanitizedUsers);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/users/role/:role", isAdmin, async (req, res, next) => {
    try {
      const { role } = req.params;
      const users = await storage.getUsersByRole(role);
      const sanitizedUsers = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(sanitizedUsers);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/users/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (req.user.role !== "admin" && req.user.id !== id.toString()) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  app2.put("/api/users/:id", isAuthenticated, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (req.user.role !== "admin" && req.user.id !== id.toString()) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (req.body.role && req.user.role !== "admin") {
        delete req.body.role;
      }
      if (req.body.password) {
        delete req.body.password;
      }
      const updatedUser = await storage.updateUser(id, req.body);
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  });
  app2.delete("/api/users/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.role === "admin") {
        return res.status(403).json({ error: "Cannot delete admin user" });
      }
      const deleted = await storage.deleteUser(id);
      if (deleted) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express5 from "express";
import fs2 from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname2, "client", "src"),
      "@shared": path2.resolve(__dirname2, "shared"),
      "@assets": path2.resolve(__dirname2, "attached_assets")
    }
  },
  root: path2.resolve(__dirname2, "client"),
  build: {
    outDir: path2.resolve(__dirname2, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname3 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, overlay: false },
    allowedHosts: void 0
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname3,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname3, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express5.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_mongodb();
var app = express6();
app.use(express6.json());
app.use(express6.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await connectToDatabase();
    log("MongoDB connected successfully");
  } catch (error) {
    log("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "localhost", () => {
    log(`serving on http://localhost:${port}`);
  }).on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      log(`Port ${port} is already in use. Please try a different port.`);
    } else {
      log(`Error starting server: ${error.message}`);
    }
    process.exit(1);
  });
  process.on("SIGINT", async () => {
    log("Shutting down server...");
    await closeDatabaseConnection();
    process.exit(0);
  });
})();
