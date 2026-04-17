export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface ServiceSummary {
  serviceId: string;
  totalCalls: number;
  successCalls: number;
  errorCalls: number;
  successRate: number;
  errorRate: number;
  averageResponseTimeMs: number;
}