module.exports.JWT_OPTIONS = {
    MEMBER_AUDIENCE: ["LOGIN", "SEARCH_FILMS"],
    ADMIN_AUDIENCE: [
      "LOGIN",
      "SEARCH_FILMS",
      "SEARCH_CUSTOMERS",
      "LIST_FILMS",
      "ADD_FILM",
      "EDIT_FILM",
      "REMOVE_FILM",
      "ADD_ACTOR",
      "EDIT_ACTOR",
      "REMOVE_ACTOR",
      "SEARCH_RENTALS",
      "ADD_RENTAL",
      "EDIT_RENTAL",
      "SHOW_OUT_OF_STOCK_FILMS",
      "SHOW_OVERDUE_RENTALS"
    ],
  };
  
  module.exports.ADD_FILM = "ADD_FILM";
  module.exports.SEARCH_CUSTOMERS = "SEARCH_CUSTOMERS";
  module.exports.EDIT_FILM = "EDIT_FILM";
  module.exports.REMOVE_FILM = "REMOVE_FILM";
  module.exports.ADD_ACTOR = "ADD_ACTOR";
  module.exports.EDIT_ACTOR = "EDIT_ACTOR";
  module.exports.REMOVE_ACTOR = "REMOVE_ACTOR";
  module.exports.LIST_FILMS = "LIST_FILMS";
  module.exports.SEARCH_FILMS = "SEARCH_FILMS";
  module.exports.ADD_RENTAL = "ADD_RENTAL";
  module.exports.EDIT_RENTAL = "EDIT_RENTAL";
  module.exports.SHOW_OUT_OF_STOCK_FILMS = "SHOW_OUT_OF_STOCK_FILMS";
  module.exports.SHOW_OVERDUE_RENTALS = "SHOW_OVERDUE_RENTALS";
  module.exports.SEARCH_RENTALS = "SEARCH_RENTALS";