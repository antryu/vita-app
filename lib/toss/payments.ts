export type PlanType = "basic" | "premium" | "platinum";

export const PLAN_PRICES: Record<PlanType, { name: string; price: number; features: string[] }> = {
  basic: {
    name: "VITA Basic",
    price: 19900,
    features: ["VITA Score 일일 리포트", "수면/스트레스 분석", "AI 건강 코칭", "KakaoTalk 알림"],
  },
  premium: {
    name: "VITA Premium",
    price: 29900,
    features: ["Basic 전체 기능", "보호자 실시간 모니터링", "24시간 AI 관제", "월 1회 차HC 원격 상담", "이상 징후 에스컬레이션"],
  },
  platinum: {
    name: "VITA Platinum",
    price: 49900,
    features: ["Premium 전체 기능", "가족 전원 알림", "무제한 차HC 상담", "분기별 건강검진 할인", "응급 119 자동 연동", "전담 케어 매니저"],
  },
};

export interface BillingKeyRequest {
  customerKey: string;
  cardNumber: string;
  cardExpirationYear: string;
  cardExpirationMonth: string;
}

export interface SubscriptionResult {
  success: boolean;
  billingKey?: string;
  error?: string;
}

export async function registerBillingKey(req: BillingKeyRequest): Promise<SubscriptionResult> {
  // TODO: Toss Payments Billing API
  // POST https://api.tosspayments.com/v1/billing/authorizations/card
  console.log(`[Toss] Registering billing key for ${req.customerKey}`);
  return { success: true, billingKey: `billing_${Date.now()}` };
}

export async function chargeBilling(billingKey: string, amount: number, orderId: string): Promise<{ success: boolean; paymentKey?: string }> {
  // TODO: Toss Payments Billing charge
  // POST https://api.tosspayments.com/v1/billing/{billingKey}
  console.log(`[Toss] Charging ${amount} via ${billingKey} for order ${orderId}`);
  return { success: true, paymentKey: `pay_${Date.now()}` };
}

export async function cancelPayment(paymentKey: string, reason: string): Promise<boolean> {
  // TODO: Toss Payments cancel
  console.log(`[Toss] Cancelling ${paymentKey}: ${reason}`);
  return true;
}
