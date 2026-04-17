export type UserRole = "member" | "guardian" | "org_admin" | "platform_admin";
export type MemberTier = "basic" | "premium" | "platinum";
export type SubscriptionStatus = "trial" | "active" | "paused" | "cancelled" | "expired";
export type AlertSeverity = "info" | "warning" | "critical" | "emergency";
export type AlertStatus = "pending" | "sent" | "acknowledged" | "resolved";
export type RiskLevel = "normal" | "caution" | "warning" | "critical";
export type VitalCashType = "earn" | "burn";
export type OrgType = "municipality" | "nursing_home" | "enterprise" | "hospital";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          name: string;
          phone: string | null;
          kakao_id: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      members: {
        Row: {
          id: string;
          profile_id: string;
          ring_id: string | null;
          tier: MemberTier;
          subscription_status: SubscriptionStatus;
          organization_id: string | null;
          guardian_profile_id: string | null;
          birth_date: string | null;
          gender: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["members"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          type: OrgType;
          contract_type: string | null;
          max_members: number;
          admin_profile_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["organizations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
      };
      vitals: {
        Row: {
          id: string;
          member_id: string;
          measured_at: string;
          heart_rate: number | null;
          hrv: number | null;
          spo2: number | null;
          skin_temp: number | null;
          respiration_rate: number | null;
          stress_score: number | null;
          steps: number | null;
          sleep_stage: string | null;
          battery: number | null;
          location: { lat: number; lng: number } | null;
          raw_data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["vitals"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["vitals"]["Insert"]>;
      };
      health_analyses: {
        Row: {
          id: string;
          member_id: string;
          analysis_date: string;
          health_score: number;
          sleep_score: number;
          stress_score: number;
          recovery_score: number;
          risk_level: RiskLevel;
          anomalies: Array<{ type: string; severity: string; detail: string }>;
          ai_recommendation: string | null;
          model_version: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["health_analyses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["health_analyses"]["Insert"]>;
      };
      alerts: {
        Row: {
          id: string;
          member_id: string;
          alert_type: string;
          severity: AlertSeverity;
          title: string;
          message: string;
          data: Record<string, unknown> | null;
          status: AlertStatus;
          sent_via: string[];
          sent_at: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["alerts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          member_id: string;
          organization_id: string | null;
          plan: MemberTier;
          price_monthly: number;
          billing_key: string | null;
          status: SubscriptionStatus;
          started_at: string;
          next_billing_at: string | null;
          cancelled_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["subscriptions"]["Row"], "id" | "started_at">;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          subscription_id: string;
          amount: number;
          currency: string;
          status: string;
          toss_payment_key: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      vital_cash: {
        Row: {
          id: string;
          member_id: string;
          transaction_type: VitalCashType;
          amount: number;
          reason: string;
          balance_after: number;
          reference_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["vital_cash"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["vital_cash"]["Insert"]>;
      };
      partner_referrals: {
        Row: {
          id: string;
          member_id: string;
          partner_type: string;
          partner_name: string | null;
          referral_reason: string | null;
          status: string;
          commission_amount: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["partner_referrals"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["partner_referrals"]["Insert"]>;
      };
    };
  };
}
