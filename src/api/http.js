const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const TOKEN_KEY = "accessToken";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status; // 0: 서버연결 실패
  }
}

// 자동 로그인 체크 시 localStorage(브라우저 종료 후에도 유지) 아니면 => sessionStorage
export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function setToken(token, persist) {
  clearToken();
  (persist ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export async function request(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError(
      0,
      "서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.",
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// 오류 문구
export function describeError(err) {
  if (!(err instanceof ApiError)) return "알 수 없는 오류가 발생했어요.";
  if (err.status === 0) return err.message;
  if (err.status >= 500)
    return "서버에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
  return (
    err.message || "요청을 처리하지 못했어요. 입력한 내용을 확인해 주세요."
  );
}
