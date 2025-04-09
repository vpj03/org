import { type User, type InsertUser } from "@shared/schema";
import {
  type Category, type InsertCategory,
  type Brand, type InsertBrand,
  type Product, type InsertProduct,
  type HeroSlider, type InsertHeroSlider,
  type PromoAd, type InsertPromoAd,
  type Ebook, type InsertEbook,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Cart, type InsertCart,
  type CartItem, type InsertCartItem,
  type Review, type InsertReview,
  type Wishlist, type InsertWishlist
} from "@shared/schema";

import { MongoDBStorage } from './storage/mongodb';


// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Category operations
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  getAllCategories(): Promise<Category[]>;

  // Brand operations
  getBrand(id: string): Promise<Brand | undefined>;
  getBrandByName(name: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<boolean>;
  getAllBrands(): Promise<Brand[]>;

  // Product operations
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getProductsByBrand(brandId: string): Promise<Product[]>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;

  // HeroSlider operations
  getHeroSlider(id: string): Promise<HeroSlider | undefined>;
  createHeroSlider(heroSlider: InsertHeroSlider): Promise<HeroSlider>;
  updateHeroSlider(id: string, heroSlider: Partial<InsertHeroSlider>): Promise<HeroSlider | undefined>;
  deleteHeroSlider(id: string): Promise<boolean>;
  getAllHeroSliders(): Promise<HeroSlider[]>;
  getActiveHeroSliders(): Promise<HeroSlider[]>;

  // PromoAd operations
  getPromoAd(id: string): Promise<PromoAd | undefined>;
  createPromoAd(promoAd: InsertPromoAd): Promise<PromoAd>;
  updatePromoAd(id: string, promoAd: Partial<InsertPromoAd>): Promise<PromoAd | undefined>;
  deletePromoAd(id: string): Promise<boolean>;
  getAllPromoAds(): Promise<PromoAd[]>;
  getActivePromoAds(): Promise<PromoAd[]>;

  // Ebook operations
  getEbook(id: string): Promise<Ebook | undefined>;
  createEbook(ebook: InsertEbook): Promise<Ebook>;
  updateEbook(id: string, ebook: Partial<InsertEbook>): Promise<Ebook | undefined>;
  deleteEbook(id: string): Promise<boolean>;
  getAllEbooks(): Promise<Ebook[]>;

  // Order operations
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByBuyer(buyerId: string): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;

  // OrderItem operations
  getOrderItem(id: string): Promise<OrderItem | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  updateOrderItem(id: string, orderItem: Partial<InsertOrderItem>): Promise<OrderItem | undefined>;
  deleteOrderItem(id: string): Promise<boolean>;
  getOrderItemsByOrder(orderId: string): Promise<OrderItem[]>;

  // Cart operations
  getCart(id: string): Promise<Cart | undefined>;
  getCartByUser(userId: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  deleteCart(id: string): Promise<boolean>;

  // CartItem operations
  getCartItem(id: string): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, cartItem: Partial<InsertCartItem>): Promise<CartItem | undefined>;
  deleteCartItem(id: string): Promise<boolean>;
  getCartItemsByCart(cartId: string): Promise<CartItem[]>;

  // Review operations
  getReview(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
  getReviewsByProduct(productId: string): Promise<Review[]>;
  getReviewsByUser(userId: string): Promise<Review[]>;

  // Wishlist operations
  getWishlist(id: string): Promise<Wishlist | undefined>;
  createWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  deleteWishlist(id: string): Promise<boolean>;
  getWishlistsByUser(userId: string): Promise<Wishlist[]>;
  
  // Session store
  sessionStore: any; // Using 'any' to avoid type issues with express-session
}

// In-memory Storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private brands: Map<number, Brand>;
  private products: Map<number, Product>;
  private heroSliders: Map<number, HeroSlider>;
  private promoAds: Map<number, PromoAd>;
  private ebooks: Map<number, Ebook>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private reviews: Map<number, Review>;
  private wishlists: Map<number, Wishlist>;
  
  sessionStore: any; // Using 'any' to avoid type issues with express-session
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private brandIdCounter: number;
  private productIdCounter: number;
  private heroSliderIdCounter: number;
  private promoAdIdCounter: number;
  private ebookIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private cartIdCounter: number;
  private cartItemIdCounter: number;
  private reviewIdCounter: number;
  private wishlistIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.products = new Map();
    this.heroSliders = new Map();
    this.promoAds = new Map();
    this.ebooks = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.reviews = new Map();
    this.wishlists = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.brandIdCounter = 1;
    this.productIdCounter = 1;
    this.heroSliderIdCounter = 1;
    this.promoAdIdCounter = 1;
    this.ebookIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.cartIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.reviewIdCounter = 1;
    this.wishlistIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Seed an admin user for initial setup
    this.seedAdminUser();
  }
  
  private seedAdminUser() {
    const now = new Date();
    // Pre-hashed version of "admin123" password
    const hashedAdminPassword = "c6588205faf8cdd752f61a14be7d7c2f36a9f8c30b651f4c44ef6cba5c08ed20dbead6aaf5277d06d740e29c2a3db9041bb0c23d43f7b1881ad441e3bde3844c.e1bc400dd975b48d9143a60f265df6ce";
    const adminUser: User = {
      id: this.userIdCounter++,
      username: "admin",
      password: hashedAdminPassword, // Using pre-hashed password
      name: "Admin User",
      email: "admin@orgpick.com",
      phone: "1234567890",
      address: "Admin Address",
      role: "admin",
      createdAt: now,
    };
    
    this.users.set(adminUser.id, adminUser);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    // Ensure role is provided, defaults to "buyer"
    const role = user.role || "buyer";
    const newUser: User = { ...user, id, createdAt: now, role };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser: User = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === role
    );
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name === name
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;
    
    const updatedCategory: Category = { ...existingCategory, ...category };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  // Brand operations
  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getBrandByName(name: string): Promise<Brand | undefined> {
    return Array.from(this.brands.values()).find(
      (brand) => brand.name === name
    );
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = this.brandIdCounter++;
    const newBrand: Brand = { ...brand, id };
    this.brands.set(id, newBrand);
    return newBrand;
  }

  async updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const existingBrand = this.brands.get(id);
    if (!existingBrand) return undefined;
    
    const updatedBrand: Brand = { ...existingBrand, ...brand };
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    return this.brands.delete(id);
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    // Set default values for optional fields
    const discountPrice = product.discountPrice ?? null;
    const brandId = product.brandId ?? null;
    const stock = product.stock ?? 0;
    const isOrganic = product.isOrganic ?? false;
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: now,
      discountPrice,
      brandId,
      stock,
      isOrganic
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getProductsByBrand(brandId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.brandId === brandId
    );
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.sellerId === sellerId
    );
  }

  // HeroSlider operations
  async getHeroSlider(id: number): Promise<HeroSlider | undefined> {
    return this.heroSliders.get(id);
  }

  async createHeroSlider(heroSlider: InsertHeroSlider): Promise<HeroSlider> {
    const id = this.heroSliderIdCounter++;
    // Set default active value to true if not provided
    const active = heroSlider.active ?? true;
    const newHeroSlider: HeroSlider = { ...heroSlider, id, active };
    this.heroSliders.set(id, newHeroSlider);
    return newHeroSlider;
  }

  async updateHeroSlider(id: number, heroSlider: Partial<InsertHeroSlider>): Promise<HeroSlider | undefined> {
    const existingHeroSlider = this.heroSliders.get(id);
    if (!existingHeroSlider) return undefined;
    
    const updatedHeroSlider: HeroSlider = { ...existingHeroSlider, ...heroSlider };
    this.heroSliders.set(id, updatedHeroSlider);
    return updatedHeroSlider;
  }

  async deleteHeroSlider(id: number): Promise<boolean> {
    return this.heroSliders.delete(id);
  }

  async getAllHeroSliders(): Promise<HeroSlider[]> {
    return Array.from(this.heroSliders.values());
  }

  async getActiveHeroSliders(): Promise<HeroSlider[]> {
    return Array.from(this.heroSliders.values()).filter(
      (heroSlider) => heroSlider.active
    );
  }

  // PromoAd operations
  async getPromoAd(id: number): Promise<PromoAd | undefined> {
    return this.promoAds.get(id);
  }

  async createPromoAd(promoAd: InsertPromoAd): Promise<PromoAd> {
    const id = this.promoAdIdCounter++;
    // Set default values for optional fields
    const description = promoAd.description ?? null;
    const buttonText = promoAd.buttonText ?? null;
    const active = promoAd.active ?? true;
    const newPromoAd: PromoAd = { 
      ...promoAd, 
      id, 
      description, 
      buttonText, 
      active 
    };
    this.promoAds.set(id, newPromoAd);
    return newPromoAd;
  }

  async updatePromoAd(id: number, promoAd: Partial<InsertPromoAd>): Promise<PromoAd | undefined> {
    const existingPromoAd = this.promoAds.get(id);
    if (!existingPromoAd) return undefined;
    
    const updatedPromoAd: PromoAd = { ...existingPromoAd, ...promoAd };
    this.promoAds.set(id, updatedPromoAd);
    return updatedPromoAd;
  }

  async deletePromoAd(id: number): Promise<boolean> {
    return this.promoAds.delete(id);
  }

  async getAllPromoAds(): Promise<PromoAd[]> {
    return Array.from(this.promoAds.values());
  }

  async getActivePromoAds(): Promise<PromoAd[]> {
    return Array.from(this.promoAds.values()).filter(
      (promoAd) => promoAd.active
    );
  }

  // Ebook operations
  async getEbook(id: number): Promise<Ebook | undefined> {
    return this.ebooks.get(id);
  }

  async createEbook(ebook: InsertEbook): Promise<Ebook> {
    const id = this.ebookIdCounter++;
    const newEbook: Ebook = { ...ebook, id };
    this.ebooks.set(id, newEbook);
    return newEbook;
  }

  async updateEbook(id: number, ebook: Partial<InsertEbook>): Promise<Ebook | undefined> {
    const existingEbook = this.ebooks.get(id);
    if (!existingEbook) return undefined;
    
    const updatedEbook: Ebook = { ...existingEbook, ...ebook };
    this.ebooks.set(id, updatedEbook);
    return updatedEbook;
  }

  async deleteEbook(id: number): Promise<boolean> {
    return this.ebooks.delete(id);
  }

  async getAllEbooks(): Promise<Ebook[]> {
    return Array.from(this.ebooks.values());
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    // Set default status to "pending" if not provided
    const status = order.status || "pending";
    const newOrder: Order = { ...order, id, createdAt: now, status };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder: Order = { ...existingOrder, ...order };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByBuyer(buyerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.buyerId === buyerId
    );
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === status
    );
  }

  // OrderItem operations
  async getOrderItem(id: number): Promise<OrderItem | undefined> {
    return this.orderItems.get(id);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  async updateOrderItem(id: number, orderItem: Partial<InsertOrderItem>): Promise<OrderItem | undefined> {
    const existingOrderItem = this.orderItems.get(id);
    if (!existingOrderItem) return undefined;
    
    const updatedOrderItem: OrderItem = { ...existingOrderItem, ...orderItem };
    this.orderItems.set(id, updatedOrderItem);
    return updatedOrderItem;
  }

  async deleteOrderItem(id: number): Promise<boolean> {
    return this.orderItems.delete(id);
  }

  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (orderItem) => orderItem.orderId === orderId
    );
  }

  // Cart operations
  async getCart(id: number): Promise<Cart | undefined> {
    return this.carts.get(id);
  }

  async getCartByUser(userId: number): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(
      (cart) => cart.userId === userId
    );
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const id = this.cartIdCounter++;
    const now = new Date();
    const newCart: Cart = { ...cart, id, createdAt: now };
    this.carts.set(id, newCart);
    return newCart;
  }

  async deleteCart(id: number): Promise<boolean> {
    return this.carts.delete(id);
  }

  // CartItem operations
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    // Set default quantity to 1 if not provided
    const quantity = cartItem.quantity ?? 1;
    const newCartItem: CartItem = { ...cartItem, id, quantity };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(id: number, cartItem: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    const existingCartItem = this.cartItems.get(id);
    if (!existingCartItem) return undefined;
    
    const updatedCartItem: CartItem = { ...existingCartItem, ...cartItem };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async getCartItemsByCart(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (cartItem) => cartItem.cartId === cartId
    );
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    // Set default comment to null if not provided
    const comment = review.comment ?? null;
    const newReview: Review = { ...review, id, createdAt: now, comment };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined> {
    const existingReview = this.reviews.get(id);
    if (!existingReview) return undefined;
    
    const updatedReview: Review = { ...existingReview, ...review };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  async getReviewsByProduct(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }

  // Wishlist operations
  async getWishlist(id: number): Promise<Wishlist | undefined> {
    return this.wishlists.get(id);
  }

  async createWishlist(wishlist: InsertWishlist): Promise<Wishlist> {
    const id = this.wishlistIdCounter++;
    const newWishlist: Wishlist = { ...wishlist, id };
    this.wishlists.set(id, newWishlist);
    return newWishlist;
  }

  async deleteWishlist(id: number): Promise<boolean> {
    return this.wishlists.delete(id);
  }

  async getWishlistsByUser(userId: number): Promise<Wishlist[]> {
    return Array.from(this.wishlists.values()).filter(
      (wishlist) => wishlist.userId === userId
    );
  }
}

// Export MongoDB storage instance
export const storage = new MongoDBStorage();
