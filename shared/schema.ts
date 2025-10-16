import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (with email/password auth support)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // 'user' or 'admin'
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  // Email/password authentication fields
  passwordHash: varchar("password_hash"),
  emailVerified: boolean("email_verified").default(false),
  verificationToken: varchar("verification_token"),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  category: varchar("category").notNull(), // passion, mission, vocation, profession
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Answer options table
export const answerOptions = pgTable("answer_options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id),
  text: text("text").notNull(),
  value: integer("value").notNull(), // 1-5 scale
  order: integer("order").notNull(),
});

// Test sessions table
export const testSessions = pgTable("test_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }), // Email collected before showing results
  isCompleted: boolean("is_completed").default(false),
  currentQuestionIndex: integer("current_question_index").default(0),
  answers: jsonb("answers").default({}),
  results: jsonb("results"),
  hasPremiumAccess: boolean("has_premium_access").default(false),
  premiumTier: varchar("premium_tier", { length: 50 }), // 'roadmap', 'personality', 'blueprint', null
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Digital products table
export const digitalProducts = pgTable("digital_products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  description: text("description"),
  downloadUrl: varchar("download_url").notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: varchar("file_size"), // e.g., "2.3 MB"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Digital purchases table
export const digitalPurchases = pgTable("digital_purchases", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => digitalProducts.id),
  email: varchar("email").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  downloadToken: varchar("download_token").notNull(), // secure token for downloads
  downloadCount: integer("download_count").default(0),
  maxDownloads: integer("max_downloads").default(5), // limit downloads
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports for new tables
export type DigitalProduct = typeof digitalProducts.$inferSelect;
export type InsertDigitalProduct = typeof digitalProducts.$inferInsert;
export type DigitalPurchase = typeof digitalPurchases.$inferSelect;
export type InsertDigitalPurchase = typeof digitalPurchases.$inferInsert;

// Zod schemas
export const insertDigitalProductSchema = createInsertSchema(digitalProducts);
export const insertDigitalPurchaseSchema = createInsertSchema(digitalPurchases);

// Shop products table
export const shopProducts = pgTable("shop_products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  features: text("features").array(),
  benefits: text("benefits").array(),
  images: text("images").array(),
  badge: varchar("badge", { length: 100 }),
  isActive: boolean("is_active").default(true),
  stockQuantity: integer("stock_quantity").default(0),
  limitedQuantity: boolean("limited_quantity").default(false),
  shipping: jsonb("shipping").default({}), // { free: true, regions: [], estimatedDays: 7 }
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  excerpt: text("excerpt"),
  author: text("author"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  authorId: varchar("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  tags: text("tags").array(),
  readingTime: integer("reading_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Checkout analytics table - tracks user journey through checkout process
export const checkoutAnalytics = pgTable("checkout_analytics", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }), // Browser session ID
  userId: varchar("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }),
  productType: varchar("product_type", { length: 100 }), // 'premium_tier', 'shop_product'
  productId: varchar("product_id", { length: 100 }), // tier name or product ID
  tier: varchar("tier", { length: 50 }), // 'roadmap', 'personality', 'blueprint'
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),
  
  // Funnel tracking
  viewedUpsell: boolean("viewed_upsell").default(false),
  startedCheckout: boolean("started_checkout").default(false),
  enteredPaymentInfo: boolean("entered_payment_info").default(false),
  completedPurchase: boolean("completed_purchase").default(false),
  
  // Timestamps for funnel analysis
  upsellViewedAt: timestamp("upsell_viewed_at"),
  checkoutStartedAt: timestamp("checkout_started_at"),
  paymentInfoEnteredAt: timestamp("payment_info_entered_at"),
  purchaseCompletedAt: timestamp("purchase_completed_at"),
  
  // Additional metadata
  referrerUrl: text("referrer_url"),
  userAgent: text("user_agent"),
  country: varchar("country", { length: 2 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Test results table
export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => testSessions.id),
  userId: varchar("user_id").references(() => users.id),
  passionScore: decimal("passion_score", { precision: 5, scale: 2 }),
  missionScore: decimal("mission_score", { precision: 5, scale: 2 }),
  vocationScore: decimal("vocation_score", { precision: 5, scale: 2 }),
  professionScore: decimal("profession_score", { precision: 5, scale: 2 }),
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }),
  primaryType: varchar("primary_type"),
  strengths: jsonb("strengths"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});



// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnswerOptionSchema = createInsertSchema(answerOptions).omit({
  id: true,
});

export const insertTestSessionSchema = createInsertSchema(testSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShopProductSchema = createInsertSchema(shopProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCheckoutAnalyticsSchema = createInsertSchema(checkoutAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type AnswerOption = typeof answerOptions.$inferSelect;
export type InsertAnswerOption = z.infer<typeof insertAnswerOptionSchema>;
export type TestSession = typeof testSessions.$inferSelect;
export type InsertTestSession = z.infer<typeof insertTestSessionSchema>;
export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type ShopProduct = typeof shopProducts.$inferSelect;
export type InsertShopProduct = z.infer<typeof insertShopProductSchema>;
export type CheckoutAnalytics = typeof checkoutAnalytics.$inferSelect;
export type InsertCheckoutAnalytics = z.infer<typeof insertCheckoutAnalyticsSchema>;

