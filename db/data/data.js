import data from './series.json';
const series = JSON.parse(data);

const createUser = (username, email, password, isAdmin = false) => {
  return {
    username: username,
    email: email,
    password: password,
    isAdmin: isAdmin
  };
};

const users = [
  createUser('normal_user', 'normal@user.com', 'Password1!@'),
  createUser('admin', 'admin@user.com', 'Password1!@', true)
];

export default { series, users };
