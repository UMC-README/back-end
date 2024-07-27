export const getKakaoToken = async (code) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.KAKAO_REST_API_KEY);
  params.append("redirect_uri", process.env.KAKAO_REDIRECT_URI);
  params.append("code", code);

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  }).then((res) => res.json());

  return response;
};

export const getKakaoUser = async (token) => {
  const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  }).then((res) => res.json());

  return response;
};

export const checkToken = async (token) => {
  const response = await fetch("https://kapi.kakao.com/v1/user/access_token_info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  if (response.code === -401) {
    // refresh token 요청하는 로직 필요
    return false;
  }
  return true;
};
