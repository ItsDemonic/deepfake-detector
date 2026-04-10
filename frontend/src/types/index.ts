export interface User {
  username: string;
  email: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface DetectionResult {
  filename: string;
  prediction: 'Real' | 'Fake';
}

export interface HistoryEntry {
  id: string;
  filename: string;
  prediction: 'Real' | 'Fake';
  timestamp: Date;
  imageUrl?: string;
}

export interface ApiError {
  detail: string;
}
