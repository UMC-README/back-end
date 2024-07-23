export const UserDTO = (name, nickname, email, password) => {
  return {
    name,
    nickname,
    email,
    password,
  };
};

export default UserDTO;

export const LoginDTO = (email, password) => {
  return {
    email,
    password,
  };
};
