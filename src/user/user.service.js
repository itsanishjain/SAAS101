// module used for all the basic function required to do CURD operation on Database

const getUserByEmail = (User) => async (email) => {
  return await User.findOne({ email });
};

const addUser = (User) => async ({email, password}) => {
  let newUser = User({ email, password });
  return newUser.save();
};

module.exports = (User) => {
  return {
    addUser:addUser(User),
    getUserByEmail: getUserByEmail(User),
  };
};
