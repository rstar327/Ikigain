// Checkout analytics utility functions for tracking user behavior in the checkout flow

interface CheckoutEvent {
  sessionId?: string;
  userId?: string;
  email?: string;
  productType: 'premium_tier' | 'shop_product';
  productId: string;
  tier?: 'roadmap' | 'personality' | 'blueprint';
  amount: number;
  currency: string;
  referrerUrl?: string;
  userAgent?: string;
}

class CheckoutAnalytics {
  private sessionId: string;
  private baseEvent: Partial<CheckoutEvent>;

  constructor() {
    // Generate a unique session ID for this checkout flow
    this.sessionId = this.generateSessionId();
    this.baseEvent = {
      sessionId: this.sessionId,
      referrerUrl: document.referrer,
      userAgent: navigator.userAgent,
    };
  }

  private generateSessionId(): string {
    return `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async trackEvent(eventData: Partial<CheckoutEvent> & { 
    viewedUpsell?: boolean;
    startedCheckout?: boolean;
    enteredPaymentInfo?: boolean;
    completedPurchase?: boolean;
  }) {
    try {
      const response = await fetch('/api/checkout-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...this.baseEvent,
          ...eventData,
          [`${Object.keys(eventData).find(key => key.endsWith('Upsell') || key.endsWith('Checkout') || key.endsWith('Info') || key.endsWith('Purchase'))}At`]: new Date(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to track checkout event:', response.statusText);
      }
    } catch (error) {
      console.error('Error tracking checkout event:', error);
    }
  }

  private async updateEvent(updates: Partial<CheckoutEvent> & {
    viewedUpsell?: boolean;
    startedCheckout?: boolean;
    enteredPaymentInfo?: boolean;
    completedPurchase?: boolean;
  }) {
    try {
      const response = await fetch(`/api/checkout-analytics/${this.sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updates,
          [`${Object.keys(updates).find(key => key.endsWith('Upsell') || key.endsWith('Checkout') || key.endsWith('Info') || key.endsWith('Purchase'))}At`]: new Date(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to update checkout event:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating checkout event:', error);
    }
  }

  // Track when user views the upsell page
  async trackUpsellView(productInfo: CheckoutEvent) {
    this.baseEvent = { ...this.baseEvent, ...productInfo };
    await this.trackEvent({
      ...productInfo,
      viewedUpsell: true,
    });
  }

  // Track when user starts the checkout process
  async trackCheckoutStart(additionalInfo?: Partial<CheckoutEvent>) {
    await this.updateEvent({
      ...additionalInfo,
      startedCheckout: true,
    });
  }

  // Track when user enters payment information
  async trackPaymentInfo(additionalInfo?: Partial<CheckoutEvent>) {
    await this.updateEvent({
      ...additionalInfo,
      enteredPaymentInfo: true,
    });
  }

  // Track when user completes the purchase
  async trackPurchaseComplete(additionalInfo?: Partial<CheckoutEvent>) {
    await this.updateEvent({
      ...additionalInfo,
      completedPurchase: true,
    });
  }

  // Get the current session ID for external use
  getSessionId(): string {
    return this.sessionId;
  }
}

// Export singleton instance
export const checkoutAnalytics = new CheckoutAnalytics();

// Helper function to extract tier from URL or other sources
export function extractTierFromUrl(): 'roadmap' | 'personality' | 'blueprint' | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  const tier = urlParams.get('tier');
  
  if (tier && ['roadmap', 'personality', 'blueprint'].includes(tier)) {
    return tier as 'roadmap' | 'personality' | 'blueprint';
  }
  
  return undefined;
}

// Helper function to extract session ID from URL
export function extractSessionFromUrl(): string | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('session') || undefined;
}

// Helper function to get product amount based on tier
export function getTierAmount(tier: 'roadmap' | 'personality' | 'blueprint'): number {
  const pricing = {
    roadmap: 2.95,
    personality: 4.95,
    blueprint: 9.95,
  };
  
  return pricing[tier] || 0;
}