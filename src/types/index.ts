export interface User {
  id: number;
  email: string;
  created_at?: string;
  permissions: Permission;
}

export interface Permission {
  modification: number;
  admin: number;
}

export interface Product {
  id: number;
  user_id: number;
  products_name: string;
  type: string;
  amount: number;
  created_at: string;
  update_at: string;
}

export interface Vote {
  id: number;
  user_id: number;
  vote_product: number;
  vote_date: string;
  vote_time: string;
  products_name: string;
  type: string;
  email: string;
}

export interface VoteCount {
  vote_product: number;
  vote_count: number;
  products_name: string;
  type: string;
}

export interface VotingResult {
  winner: VoteCount | null;
  tied?: VoteCount[];
  message: string;
  counts: VoteCount[];
  votingOpen: boolean;
}

export interface CanVoteResult {
  canVote: boolean;
  reason: string | null;
}

export interface HistoryGroup {
  [year: string]: {
    [month: string]: {
      [day: string]: HistoryEntry[];
    };
  };
}

export interface HistoryEntry {
  email: string;
  products_name: string;
  type: string;
  vote_time: string;
}
