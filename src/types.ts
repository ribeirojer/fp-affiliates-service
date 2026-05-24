export interface UserAffiliate {
  id: string;
  affiliate_code: string | null;
  affiliate_earnings: number;
  pix_key: string | null;
  email: string;
  name: string;
}

export interface Referral {
  id: string;
  affiliate_code: string;
  referred_email: string;
  order_id: string;
  order_amount: number;
  commission_rate: number;
  commission_value: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  paid_at: string | null;
}

export interface AffiliateClick {
  id: string;
  affiliate_code: string;
  landing_page: string | null;
  referrer: string | null;
  user_agent: string | null;
  converted: boolean;
  created_at: string;
}

export interface Payout {
  id: string;
  affiliate_code: string;
  amount: number;
  pix_key: string;
  status: "requested" | "paid";
  requested_at: string;
  paid_at: string | null;
}

export interface AffiliateStats {
  totalClicks: number;
  totalReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  availableForPayout: number;
}
