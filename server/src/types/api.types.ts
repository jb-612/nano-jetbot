export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: number;
  requestId: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: number;
  requestId: string;
}

export interface WsMessage<T> {
  type: string;
  data: T;
  timestamp: number;
}

export interface WsClientMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping';
  channel?: string;
}
