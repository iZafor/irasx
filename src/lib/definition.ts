export interface AuthData {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    data?: { [key: string]: string; }[];
}

export interface StoredAuthData {
    id: string;
    data: AuthResponse;
}
