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

export interface AuditLog {
  requestId: string;
  serviceId: string;
  operation: string;
  durationMs: number;
  status: "SUCCESS" | "ERROR";
  timestamp: string;
  inputParams: string;
  responseBody: string | null;
  errorMessage: string | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}