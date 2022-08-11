module.exports.JWT_OPTIONS = {
    MEMBER_AUDIENCE: ["LOGIN", "SHOW_FILMS"],
    ADMIN_AUDIENCE: [
      "LOGIN",
      "SHOW_FILMS",
      "SHOW_USERS",
      "ADD_FILM",
      "EDIT_FILM",
      "REMOVE_FILM"
    ],
  };
  
  module.exports.ADD_FILM = "ADD_FILM";
  module.exports.SHOW_USERS = "SHOW_USERS";
  