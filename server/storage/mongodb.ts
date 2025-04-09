import mongoose from 'mongoose'; // <-- added import
import { mongoose as mongodbConfig } from '../config/mongodb';
import { sessionStore } from '../config/mongodb';
import { IStorage } from '../storage';
import {
  User, IUser,
  Category, ICategory,
  Brand, IBrand,
  Product, IProduct,
  HeroSlider, IHeroSlider,
  PromoAd, IPromoAd,
  Ebook, IEbook,
  Order, IOrder,
  OrderItem, IOrderItem,
  Cart, ICart,
  CartItem, ICartItem,
  Review, IReview,
  Wishlist, IWishlist
} from '../models';
import { 
  InsertUser, InsertCategory, InsertBrand, InsertProduct,
  InsertHeroSlider, InsertPromoAd, InsertEbook, InsertOrder,
  InsertOrderItem, InsertCart, InsertCartItem, InsertReview,
  InsertWishlist
} from '@shared/schema';

export class MongoDBStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = sessionStore;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      if (!id) {
        console.error('Invalid user ID provided');
        return undefined;
      }
      const user = await User.findById(id).exec();
      if (!user) {
        console.log(`No user found with ID: ${id}`);
        return undefined;
      }
      return user.toObject();
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error; // Propagate error for proper handling
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      if (!username) {
        console.error('Invalid username provided');
        return undefined;
      }
      const user = await User.findOne({ username }).exec();
      if (!user) {
        console.log(`No user found with username: ${username}`);
        return undefined;
      }
      return user.toObject();
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw new Error('Failed to fetch user from MongoDB');
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await User.findOne({ email });
    return user ? user.toObject() : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = new User(user);
    await newUser.save();
    return newUser.toObject();
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser ? updatedUser.toObject() : undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await User.find();
    return users.map(user => user.toObject());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const users = await User.find({ role });
    return users.map(user => user.toObject());
  }

  // Category operations
  async getCategory(id: string): Promise<Category | undefined> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid category ID format');
        return undefined;
      }
      const category = await Category.findById(id)
        .populate('createdBy', 'name username')
        .exec();
      if (!category) {
        console.log(`No category found with ID: ${id}`);
        return undefined;
      }
      return category.toObject();
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category from database');
    }
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const category = await Category.findOne({ name });
    return category ? category.toObject() : undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    try {
      if (!category.name || !category.image || !category.description || !category.createdBy) {
        throw new Error('Missing required fields');
      }

      // Handle different formats of createdBy ID
      let createdById = category.createdBy;
      
      // If it's a number or numeric string (from SQL database), convert to string
      if (typeof createdById === 'number' || (typeof createdById === 'string' && !isNaN(Number(createdById)))) {
        createdById = createdById.toString();
      }

      // Try to convert to a valid MongoDB ObjectId if it's not already
      let createdByObjectId;
      try {
        // Check if it's already a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(createdById)) {
          createdByObjectId = createdById;
        } else {
          // If not valid, try to create a new ObjectId
          createdByObjectId = new mongoose.Types.ObjectId(createdById);
        }
      } catch (error) {
        console.error('Failed to convert user ID to ObjectId:', error);
        throw new Error('Invalid user ID format');
      }

      const categoryData = {
        name: category.name,
        description: category.description,
        image: category.image,
        createdBy: createdByObjectId // Use the validated/converted ObjectId
      };

      const newCategory = new Category(categoryData);
      await newCategory.save();
      return newCategory.toObject();
    } catch (error) {
      console.error('Error creating category:', error);
      if (error instanceof Error) {
        if ((error as any).code === 11000) {
          throw new Error('Category with this name already exists');
        }
        if ((error as any).name === 'ValidationError') {
          const validationError = Object.values((error as any).errors)
            .map((err: any) => err.message)
            .join(', ');
          throw new Error(`Validation failed: ${validationError}`);
        }
      }
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const updatedCategory = await Category.findByIdAndUpdate(id, category, { new: true });
    return updatedCategory ? updatedCategory.toObject() : undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }

  async getAllCategories(): Promise<Category[]> {
    const categories = await Category.find();
    return categories.map(category => category.toObject());
  }

  // Brand operations
  async getBrand(id: string): Promise<Brand | undefined> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid brand ID format');
        return undefined;
      }
      const brand = await Brand.findById(id)
        .populate('createdBy', 'name username')
        .exec();
      if (!brand) {
        console.log(`No brand found with ID: ${id}`);
        return undefined;
      }
      return brand.toObject();
    } catch (error) {
      console.error('Error fetching brand:', error);
      throw new Error('Failed to fetch brand from database');
    }
  }

  async getBrandByName(name: string): Promise<Brand | undefined> {
    const brand = await Brand.findOne({ name });
    return brand ? brand.toObject() : undefined;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const newBrand = new Brand(brand);
    await newBrand.save();
    return newBrand.toObject();
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const updatedBrand = await Brand.findByIdAndUpdate(id, brand, { new: true });
    return updatedBrand ? updatedBrand.toObject() : undefined;
  }

  async deleteBrand(id: string): Promise<boolean> {
    const result = await Brand.findByIdAndDelete(id);
    return !!result;
  }

  async getAllBrands(): Promise<Brand[]> {
    const brands = await Brand.find();
    return brands.map(brand => brand.toObject());
  }

  // Product operations
  async getProduct(id: string): Promise<Product | undefined> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid product ID format');
        return undefined;
      }
      const product = await Product.findById(id)
        .populate('category')
        .populate('brand')
        .exec();
      if (!product) {
        console.log(`No product found with ID: ${id}`);
        return undefined;
      }
      return product.toObject();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product from database');
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = new Product(product);
    await newProduct.save();
    return newProduct.toObject();
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    return updatedProduct ? updatedProduct.toObject() : undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await Product.find();
    return products.map(product => product.toObject());
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const products = await Product.find({ categoryId: categoryId });
    return products.map(product => product.toObject());
  }

  async getProductsByBrand(brandId: string): Promise<Product[]> {
    const products = await Product.find({ brandId: brandId });
    return products.map(product => product.toObject());
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    const products = await Product.find({ sellerId: sellerId });
    return products.map(product => product.toObject());
  }

  // HeroSlider operations
  async getHeroSlider(id: string): Promise<HeroSlider | undefined> {
    const heroSlider = await HeroSlider.findById(id);
    return heroSlider ? heroSlider.toObject() : undefined;
  }

  async createHeroSlider(heroSlider: InsertHeroSlider): Promise<HeroSlider> {
    const newHeroSlider = new HeroSlider(heroSlider);
    await newHeroSlider.save();
    return newHeroSlider.toObject();
  }

  async updateHeroSlider(id: string, heroSlider: Partial<InsertHeroSlider>): Promise<HeroSlider | undefined> {
    const updatedHeroSlider = await HeroSlider.findByIdAndUpdate(id, heroSlider, { new: true });
    return updatedHeroSlider ? updatedHeroSlider.toObject() : undefined;
  }

  async deleteHeroSlider(id: string): Promise<boolean> {
    const result = await HeroSlider.findByIdAndDelete(id);
    return !!result;
  }

  async getAllHeroSliders(): Promise<HeroSlider[]> {
    const heroSliders = await HeroSlider.find();
    return heroSliders.map(heroSlider => heroSlider.toObject());
  }

  async getActiveHeroSliders(): Promise<HeroSlider[]> {
    const heroSliders = await HeroSlider.find({ isActive: true });
    return heroSliders.map(heroSlider => heroSlider.toObject());
  }

  // PromoAd operations
  async getPromoAd(id: string): Promise<PromoAd | undefined> {
    const promoAd = await PromoAd.findById(id);
    return promoAd ? promoAd.toObject() : undefined;
  }

  async createPromoAd(promoAd: InsertPromoAd): Promise<PromoAd> {
    const newPromoAd = new PromoAd(promoAd);
    await newPromoAd.save();
    return newPromoAd.toObject();
  }

  async updatePromoAd(id: string, promoAd: Partial<InsertPromoAd>): Promise<PromoAd | undefined> {
    const updatedPromoAd = await PromoAd.findByIdAndUpdate(id, promoAd, { new: true });
    return updatedPromoAd ? updatedPromoAd.toObject() : undefined;
  }

  async deletePromoAd(id: string): Promise<boolean> {
    const result = await PromoAd.findByIdAndDelete(id);
    return !!result;
  }

  async getAllPromoAds(): Promise<PromoAd[]> {
    const promoAds = await PromoAd.find();
    return promoAds.map(promoAd => promoAd.toObject());
  }

  async getActivePromoAds(): Promise<PromoAd[]> {
    const promoAds = await PromoAd.find({ isActive: true });
    return promoAds.map(promoAd => promoAd.toObject());
  }

  // Ebook operations
  async getEbook(id: string): Promise<Ebook | undefined> {
    const ebook = await Ebook.findById(id);
    return ebook ? ebook.toObject() : undefined;
  }

  async createEbook(ebook: InsertEbook): Promise<Ebook> {
    const newEbook = new Ebook(ebook);
    await newEbook.save();
    return newEbook.toObject();
  }

  async updateEbook(id: string, ebook: Partial<InsertEbook>): Promise<Ebook | undefined> {
    const updatedEbook = await Ebook.findByIdAndUpdate(id, ebook, { new: true });
    return updatedEbook ? updatedEbook.toObject() : undefined;
  }

  async deleteEbook(id: string): Promise<boolean> {
    const result = await Ebook.findByIdAndDelete(id);
    return !!result;
  }

  async getAllEbooks(): Promise<Ebook[]> {
    const ebooks = await Ebook.find();
    return ebooks.map(ebook => ebook.toObject());
  }

  // Order operations
  async getOrder(id: string): Promise<Order | undefined> {
    const order = await Order.findById(id);
    return order ? order.toObject() : undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder = new Order(order);
    await newOrder.save();
    return newOrder.toObject();
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, { new: true });
    return updatedOrder ? updatedOrder.toObject() : undefined;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await Order.findByIdAndDelete(id);
    return !!result;
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await Order.find();
    return orders.map(order => order.toObject());
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    const orders = await Order.find({ buyerId: buyerId });
    return orders.map(order => order.toObject());
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const orders = await Order.find({ status });
    return orders.map(order => order.toObject());
  }

  // OrderItem operations
  async getOrderItem(id: string): Promise<OrderItem | undefined> {
    const orderItem = await OrderItem.findById(id);
    return orderItem ? orderItem.toObject() : undefined;
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const newOrderItem = new OrderItem(orderItem);
    await newOrderItem.save();
    return newOrderItem.toObject();
  }

  async updateOrderItem(id: string, orderItem: Partial<InsertOrderItem>): Promise<OrderItem | undefined> {
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(id, orderItem, { new: true });
    return updatedOrderItem ? updatedOrderItem.toObject() : undefined;
  }

  async deleteOrderItem(id: string): Promise<boolean> {
    const result = await OrderItem.findByIdAndDelete(id);
    return !!result;
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    const orderItems = await OrderItem.find({ orderId: orderId });
    return orderItems.map(orderItem => orderItem.toObject());
  }

  // Cart operations
  async getCart(id: string): Promise<Cart | undefined> {
    const cart = await Cart.findById(id);
    return cart ? cart.toObject() : undefined;
  }

  async getCartByUser(userId: string): Promise<Cart | undefined> {
    const cart = await Cart.findOne({ userId: userId });
    return cart ? cart.toObject() : undefined;
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const newCart = new Cart(cart);
    await newCart.save();
    return newCart.toObject();
  }

  async deleteCart(id: string): Promise<boolean> {
    const result = await Cart.findByIdAndDelete(id);
    return !!result;
  }

  // CartItem operations
  async getCartItem(id: string): Promise<CartItem | undefined> {
    const cartItem = await CartItem.findById(id);
    return cartItem ? cartItem.toObject() : undefined;
  }

  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const newCartItem = new CartItem(cartItem);
    await newCartItem.save();
    return newCartItem.toObject();
  }

  async updateCartItem(id: string, cartItem: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    const updatedCartItem = await CartItem.findByIdAndUpdate(id, cartItem, { new: true });
    return updatedCartItem ? updatedCartItem.toObject() : undefined;
  }

  async deleteCartItem(id: string): Promise<boolean> {
    const result = await CartItem.findByIdAndDelete(id);
    return !!result;
  }

  async getCartItemsByCart(cartId: string): Promise<CartItem[]> {
    const cartItems = await CartItem.find({ cartId: cartId });
    return cartItems.map(cartItem => cartItem.toObject());
  }

  // Review operations
  async getReview(id: string): Promise<Review | undefined> {
    const review = await Review.findById(id);
    return review ? review.toObject() : undefined;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview = new Review(review);
    await newReview.save();
    return newReview.toObject();
  }

  async updateReview(id: string, review: Partial<InsertReview>): Promise<Review | undefined> {
    const updatedReview = await Review.findByIdAndUpdate(id, review, { new: true });
    return updatedReview ? updatedReview.toObject() : undefined;
  }

  async deleteReview(id: string): Promise<boolean> {
    const result = await Review.findByIdAndDelete(id);
    return !!result;
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    const reviews = await Review.find({ productId: productId });
    return reviews.map(review => review.toObject());
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const reviews = await Review.find({ userId: userId });
    return reviews.map(review => review.toObject());
  }

  // Wishlist operations
  async getWishlist(id: string): Promise<Wishlist | undefined> {
    const wishlist = await Wishlist.findById(id);
    return wishlist ? wishlist.toObject() : undefined;
  }

  async createWishlist(wishlist: InsertWishlist): Promise<Wishlist> {
    const newWishlist = new Wishlist(wishlist);
    await newWishlist.save();
    return newWishlist.toObject();
  }

  async deleteWishlist(id: string): Promise<boolean> {
    const result = await Wishlist.findByIdAndDelete(id);
    return !!result;
  }

  async getWishlistsByUser(userId: string): Promise<Wishlist[]> {
    const wishlists = await Wishlist.find({ userId: userId });
    return wishlists.map(wishlist => wishlist.toObject());
  }
}