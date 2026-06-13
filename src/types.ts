export interface Flag {
  code: string;
  name: string;
  region: string;
  flagUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
