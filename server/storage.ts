import {
  users,
  questions,
  answerOptions,
  testSessions,
  testResults,
  blogPosts,
  shopProducts,
  checkoutAnalytics,
  type User,
  type UpsertUser,
  type Question,
  type InsertQuestion,
  type AnswerOption,
  type InsertAnswerOption,
  type TestSession,
  type InsertTestSession,
  type TestResult,
  type InsertTestResult,
  type BlogPost,
  type InsertBlogPost,
  type ShopProduct,
  type InsertShopProduct,
  type CheckoutAnalytics,
  type InsertCheckoutAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, like, inArray, isNotNull, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export interface IStorage {
  // User operations (for both Replit Auth and email/password auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Email/password authentication methods
  createUserWithPassword(email: string, password: string, firstName?: string, lastName?: string): Promise<User>;
  validateUserPassword(email: string, password: string): Promise<User | null>;
  updateUserPassword(userId: string, newPasswordHash: string): Promise<User>;
  updateLastLogin(userId: string): Promise<User>;
  
  // Link existing test sessions to user account
  linkTestSessionsToUser(sessionIds: number[], userId: string): Promise<void>;
  getUnlinkedTestSessionsByEmail(email: string): Promise<TestSession[]>;
  
  // Question operations
  getQuestions(): Promise<Question[]>;
  getActiveQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question>;
  deleteQuestion(id: number): Promise<void>;
  
  // Answer options operations
  getAnswerOptionsByQuestionId(questionId: number): Promise<AnswerOption[]>;
  createAnswerOption(option: InsertAnswerOption): Promise<AnswerOption>;
  
  // Test session operations
  createTestSession(session: InsertTestSession): Promise<TestSession>;
  getTestSession(id: number): Promise<TestSession | undefined>;
  updateTestSession(id: number, updates: Partial<TestSession>): Promise<TestSession>;
  getUserTestSessions(userId: string): Promise<TestSession[]>;
  
  // Test result operations
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResult(sessionId: number): Promise<TestResult | undefined>;
  getUserTestResults(userId: string): Promise<TestResult[]>;
  
  // Blog operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  publishBlogPost(id: number): Promise<BlogPost>;
  unpublishBlogPost(id: number): Promise<BlogPost>;
  
  // Advanced blog operations
  bulkDeleteBlogPosts(ids: number[]): Promise<void>;
  bulkPublishBlogPosts(ids: number[]): Promise<BlogPost[]>;
  bulkUnpublishBlogPosts(ids: number[]): Promise<BlogPost[]>;
  getDraftBlogPosts(): Promise<BlogPost[]>;
  getRecentBlogPosts(limit: number): Promise<BlogPost[]>;
  getBlogPostsByTag(tag: string): Promise<BlogPost[]>;
  getBlogAnalytics(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalTags: number;
    recentPosts: BlogPost[];
  }>;
  
  // Shop operations
  getAllShopProducts(): Promise<ShopProduct[]>;
  getActiveShopProducts(): Promise<ShopProduct[]>;
  getShopProduct(id: number): Promise<ShopProduct | undefined>;
  createShopProduct(product: InsertShopProduct): Promise<ShopProduct>;
  updateShopProduct(id: number, updates: Partial<InsertShopProduct>): Promise<ShopProduct>;
  deleteShopProduct(id: number): Promise<void>;
  activateShopProduct(id: number): Promise<ShopProduct>;
  deactivateShopProduct(id: number): Promise<ShopProduct>;
  updateShopProductStock(id: number, quantity: number): Promise<ShopProduct>;
  
  // Email collection operations
  getCollectedEmails(): Promise<Array<{
    id: number;
    email: string;
    created_at: string;
    is_completed: boolean;
    premium_tier: string | null;
  }>>;
  
  // Checkout analytics operations
  createCheckoutAnalytics(analytics: InsertCheckoutAnalytics): Promise<CheckoutAnalytics>;
  updateCheckoutAnalytics(sessionId: string, updates: Partial<CheckoutAnalytics>): Promise<CheckoutAnalytics | undefined>;
  getCheckoutAnalytics(): Promise<CheckoutAnalytics[]>;
  getCheckoutConversionStats(): Promise<{
    totalViews: number;
    checkoutStarts: number;
    paymentInfoEntered: number;
    completedPurchases: number;
    conversionRates: {
      viewToCheckout: number;
      checkoutToPayment: number;
      paymentToComplete: number;
      overallConversion: number;
    };
    dropOffPoints: {
      afterUpsellView: number;
      afterCheckoutStart: number;
      afterPaymentInfo: number;
    };
  }>;

  // Digital product operations
  getDigitalProducts(): Promise<DigitalProduct[]>;
  getDigitalProduct(id: number): Promise<DigitalProduct | undefined>;
  createDigitalPurchase(purchase: InsertDigitalPurchase): Promise<DigitalPurchase>;
  getDigitalPurchase(token: string): Promise<DigitalPurchase | undefined>;
  incrementDownloadCount(token: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Email/password authentication methods
  async createUserWithPassword(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = randomBytes(16).toString("hex");
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email,
        passwordHash,
        firstName: firstName || "",
        lastName: lastName || "",
        emailVerified: true, // Auto-verify for now, can add email verification later
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async validateUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async updateUserPassword(userId: string, newPasswordHash: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateLastLogin(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Link existing test sessions to user account (for claiming anonymous test results)
  async linkTestSessionsToUser(sessionIds: number[], userId: string): Promise<void> {
    // Link the test sessions
    await db
      .update(testSessions)
      .set({ userId })
      .where(inArray(testSessions.id, sessionIds));
    
    // Also link any test results for these sessions
    await db
      .update(testResults)
      .set({ userId })
      .where(inArray(testResults.sessionId, sessionIds));
  }

  // Get test sessions that match an email but aren't linked to a user account yet
  async getUnlinkedTestSessionsByEmail(email: string): Promise<TestSession[]> {
    return await db
      .select()
      .from(testSessions)
      .where(and(
        eq(testSessions.email, email),
        isNull(testSessions.userId) // Null means not linked to user account
      ))
      .orderBy(desc(testSessions.createdAt));
  }

  // Question operations
  async getQuestions(): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .orderBy(questions.order);
  }

  async getActiveQuestions(): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.isActive, true))
      .orderBy(questions.order);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question> {
    const [updatedQuestion] = await db
      .update(questions)
      .set({ ...question, updatedAt: new Date() })
      .where(eq(questions.id, id))
      .returning();
    return updatedQuestion;
  }

  async deleteQuestion(id: number): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }

  // Answer options operations
  async getAnswerOptionsByQuestionId(questionId: number): Promise<AnswerOption[]> {
    return await db
      .select()
      .from(answerOptions)
      .where(eq(answerOptions.questionId, questionId))
      .orderBy(answerOptions.order);
  }

  async createAnswerOption(option: InsertAnswerOption): Promise<AnswerOption> {
    const [newOption] = await db
      .insert(answerOptions)
      .values(option)
      .returning();
    return newOption;
  }

  // Test session operations
  async createTestSession(session: InsertTestSession): Promise<TestSession> {
    const [newSession] = await db
      .insert(testSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getTestSession(id: number): Promise<TestSession | undefined> {
    const [session] = await db
      .select()
      .from(testSessions)
      .where(eq(testSessions.id, id));
    return session;
  }

  async updateTestSession(id: number, updates: Partial<TestSession>): Promise<TestSession> {
    const [updatedSession] = await db
      .update(testSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(testSessions.id, id))
      .returning();
    return updatedSession;
  }

  async getUserTestSessions(userId: string): Promise<TestSession[]> {
    return await db
      .select()
      .from(testSessions)
      .where(eq(testSessions.userId, userId))
      .orderBy(desc(testSessions.createdAt));
  }

  // Test result operations
  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    const [newResult] = await db
      .insert(testResults)
      .values(result)
      .returning();
    return newResult;
  }

  async getTestResult(sessionId: number): Promise<TestResult | undefined> {
    const [result] = await db
      .select()
      .from(testResults)
      .where(eq(testResults.sessionId, sessionId));
    return result;
  }

  async getUserTestResults(userId: string): Promise<TestResult[]> {
    return await db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, userId))
      .orderBy(desc(testResults.createdAt));
  }

  // Blog operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async publishBlogPost(id: number): Promise<BlogPost> {
    const [publishedPost] = await db
      .update(blogPosts)
      .set({ 
        isPublished: true, 
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return publishedPost;
  }

  async unpublishBlogPost(id: number): Promise<BlogPost> {
    const [unpublishedPost] = await db
      .update(blogPosts)
      .set({ 
        isPublished: false, 
        publishedAt: null,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return unpublishedPost;
  }

  // Advanced blog operations
  async bulkDeleteBlogPosts(ids: number[]): Promise<void> {
    await db.delete(blogPosts).where(inArray(blogPosts.id, ids));
  }

  async bulkPublishBlogPosts(ids: number[]): Promise<BlogPost[]> {
    const publishedPosts = await db
      .update(blogPosts)
      .set({ 
        isPublished: true, 
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(inArray(blogPosts.id, ids))
      .returning();
    return publishedPosts;
  }

  async bulkUnpublishBlogPosts(ids: number[]): Promise<BlogPost[]> {
    const unpublishedPosts = await db
      .update(blogPosts)
      .set({ 
        isPublished: false, 
        publishedAt: null,
        updatedAt: new Date()
      })
      .where(inArray(blogPosts.id, ids))
      .returning();
    return unpublishedPosts;
  }

  async getDraftBlogPosts(): Promise<BlogPost[]> {
    const drafts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, false))
      .orderBy(desc(blogPosts.updatedAt));
    return drafts;
  }

  async getRecentBlogPosts(limit: number): Promise<BlogPost[]> {
    const recentPosts = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit);
    return recentPosts;
  }

  async getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(like(blogPosts.tags, `%${tag}%`))
      .orderBy(desc(blogPosts.createdAt));
    return posts;
  }

  async getBlogAnalytics(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalTags: number;
    recentPosts: BlogPost[];
  }> {
    const [totalCount] = await db
      .select({ count: count() })
      .from(blogPosts);
    
    const [publishedCount] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true));
    
    const [draftCount] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, false));
    
    const recentPosts = await this.getRecentBlogPosts(5);
    
    // Get unique tags count
    const allPosts = await db.select({ tags: blogPosts.tags }).from(blogPosts);
    const allTags = allPosts
      .flatMap(post => Array.isArray(post.tags) ? post.tags : (post.tags?.split(',').map(t => t.trim()) || []))
      .filter(tag => tag.length > 0);
    const uniqueTags = new Set(allTags);
    
    return {
      totalPosts: totalCount.count,
      publishedPosts: publishedCount.count,
      draftPosts: draftCount.count,
      totalTags: uniqueTags.size,
      recentPosts
    };
  }

  // Shop operations
  async getAllShopProducts(): Promise<ShopProduct[]> {
    const products = await db
      .select()
      .from(shopProducts)
      .orderBy(desc(shopProducts.createdAt));
    return products;
  }

  async getActiveShopProducts(): Promise<ShopProduct[]> {
    const products = await db
      .select()
      .from(shopProducts)
      .where(eq(shopProducts.isActive, true))
      .orderBy(desc(shopProducts.createdAt));
    return products;
  }

  async getShopProduct(id: number): Promise<ShopProduct | undefined> {
    const [product] = await db
      .select()
      .from(shopProducts)
      .where(eq(shopProducts.id, id));
    return product;
  }

  async createShopProduct(product: InsertShopProduct): Promise<ShopProduct> {
    const [newProduct] = await db
      .insert(shopProducts)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateShopProduct(id: number, updates: Partial<InsertShopProduct>): Promise<ShopProduct> {
    const [updatedProduct] = await db
      .update(shopProducts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(shopProducts.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteShopProduct(id: number): Promise<void> {
    await db
      .delete(shopProducts)
      .where(eq(shopProducts.id, id));
  }

  async activateShopProduct(id: number): Promise<ShopProduct> {
    const [product] = await db
      .update(shopProducts)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(shopProducts.id, id))
      .returning();
    return product;
  }

  async deactivateShopProduct(id: number): Promise<ShopProduct> {
    const [product] = await db
      .update(shopProducts)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(shopProducts.id, id))
      .returning();
    return product;
  }

  async updateShopProductStock(id: number, quantity: number): Promise<ShopProduct> {
    const [product] = await db
      .update(shopProducts)
      .set({ stockQuantity: quantity, updatedAt: new Date() })
      .where(eq(shopProducts.id, id))
      .returning();
    return product;
  }

  // Email collection operations
  async getCollectedEmails(): Promise<Array<{
    id: number;
    email: string;
    created_at: string;
    is_completed: boolean;
    premium_tier: string | null;
  }>> {
    const sessions = await db
      .select({
        id: testSessions.id,
        email: testSessions.email,
        created_at: testSessions.createdAt,
        is_completed: testSessions.isCompleted,
        premium_tier: testSessions.premiumTier
      })
      .from(testSessions)
      .where(isNotNull(testSessions.email)) // Only sessions with emails
      .orderBy(desc(testSessions.createdAt));
    
    return sessions.map(session => ({
      ...session,
      created_at: session.created_at.toISOString(),
      premium_tier: session.premium_tier || null
    }));
  }

  // Checkout analytics operations
  async createCheckoutAnalytics(analytics: InsertCheckoutAnalytics): Promise<CheckoutAnalytics> {
    const [result] = await db
      .insert(checkoutAnalytics)
      .values(analytics)
      .returning();
    return result;
  }

  async updateCheckoutAnalytics(sessionId: string, updates: Partial<CheckoutAnalytics>): Promise<CheckoutAnalytics | undefined> {
    const [result] = await db
      .update(checkoutAnalytics)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(checkoutAnalytics.sessionId, sessionId))
      .returning();
    return result;
  }

  async getCheckoutAnalytics(): Promise<CheckoutAnalytics[]> {
    return await db
      .select()
      .from(checkoutAnalytics)
      .orderBy(desc(checkoutAnalytics.createdAt));
  }

  async getCheckoutConversionStats(): Promise<{
    totalViews: number;
    checkoutStarts: number;
    paymentInfoEntered: number;
    completedPurchases: number;
    conversionRates: {
      viewToCheckout: number;
      checkoutToPayment: number;
      paymentToComplete: number;
      overallConversion: number;
    };
    dropOffPoints: {
      afterUpsellView: number;
      afterCheckoutStart: number;
      afterPaymentInfo: number;
    };
  }> {
    const [totalViewsResult] = await db
      .select({ count: count() })
      .from(checkoutAnalytics)
      .where(eq(checkoutAnalytics.viewedUpsell, true));
    
    const [checkoutStartsResult] = await db
      .select({ count: count() })
      .from(checkoutAnalytics)
      .where(eq(checkoutAnalytics.startedCheckout, true));
    
    const [paymentInfoResult] = await db
      .select({ count: count() })
      .from(checkoutAnalytics)
      .where(eq(checkoutAnalytics.enteredPaymentInfo, true));
    
    const [completedResult] = await db
      .select({ count: count() })
      .from(checkoutAnalytics)
      .where(eq(checkoutAnalytics.completedPurchase, true));

    const totalViews = totalViewsResult.count;
    const checkoutStarts = checkoutStartsResult.count;
    const paymentInfoEntered = paymentInfoResult.count;
    const completedPurchases = completedResult.count;

    // Calculate conversion rates
    const viewToCheckout = totalViews > 0 ? (checkoutStarts / totalViews) * 100 : 0;
    const checkoutToPayment = checkoutStarts > 0 ? (paymentInfoEntered / checkoutStarts) * 100 : 0;
    const paymentToComplete = paymentInfoEntered > 0 ? (completedPurchases / paymentInfoEntered) * 100 : 0;
    const overallConversion = totalViews > 0 ? (completedPurchases / totalViews) * 100 : 0;

    // Calculate drop-off points
    const afterUpsellView = totalViews - checkoutStarts;
    const afterCheckoutStart = checkoutStarts - paymentInfoEntered;
    const afterPaymentInfo = paymentInfoEntered - completedPurchases;

    return {
      totalViews,
      checkoutStarts,
      paymentInfoEntered,
      completedPurchases,
      conversionRates: {
        viewToCheckout: Math.round(viewToCheckout * 100) / 100,
        checkoutToPayment: Math.round(checkoutToPayment * 100) / 100,
        paymentToComplete: Math.round(paymentToComplete * 100) / 100,
        overallConversion: Math.round(overallConversion * 100) / 100,
      },
      dropOffPoints: {
        afterUpsellView,
        afterCheckoutStart,
        afterPaymentInfo,
      },
    };
  }

  // Digital product operations
  async getDigitalProducts(): Promise<DigitalProduct[]> {
    return await db.select().from(digitalProducts).where(eq(digitalProducts.isActive, true));
  }

  async getDigitalProduct(id: number): Promise<DigitalProduct | undefined> {
    const [product] = await db.select().from(digitalProducts).where(eq(digitalProducts.id, id));
    return product;
  }

  async createDigitalPurchase(purchase: InsertDigitalPurchase): Promise<DigitalPurchase> {
    const [result] = await db.insert(digitalPurchases).values(purchase).returning();
    return result;
  }

  async getDigitalPurchase(token: string): Promise<DigitalPurchase | undefined> {
    const [purchase] = await db.select().from(digitalPurchases).where(eq(digitalPurchases.downloadToken, token));
    return purchase;
  }

  async incrementDownloadCount(token: string): Promise<void> {
    await db
      .update(digitalPurchases)
      .set({ 
        downloadCount: sql`${digitalPurchases.downloadCount} + 1`
      })
      .where(eq(digitalPurchases.downloadToken, token));
  }
}

export const storage = new DatabaseStorage();
