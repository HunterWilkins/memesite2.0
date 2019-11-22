const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema ({
    username : {
        type: String,
        unique: true
    },

    password: {
        type: String
    },

    id: {
        type: String,
        unique: true
    },

    posts: {
        type: Array
    },

    favGenres: {
        type: Array
    },

    favTags: {
        type: Array
    }
});

let User = mongoose.model("User", UserSchema);

module.exports = User;