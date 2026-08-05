export type AuthUser = {
    id: string;
    username: string;
    email: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
    const response = await fetch("/api/auth/me");
    if (response.status === 401) return null;
    return handleResponse<AuthUser>(response);
}

export function login(username: string, password: string): Promise<AuthUser> {
    return fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
    }).then((res) => handleResponse<AuthUser>(res));
}

export function register(
    username: string,
    email: string,
    password: string
): Promise<AuthUser> {
    return fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    }).then((res) => handleResponse<AuthUser>(res));
}

export function logout(): Promise<void> {
    return fetch("/api/auth/logout", { method: "POST" }).then((response) => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
    });
}

export function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<void> {
    return fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((body) => {
                throw new Error(body?.error ?? `Request failed with status ${response.status}`);
            });
        }
    });
}
