const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PostSchema = new Schema ({
    author: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },
    
    tags: {
        type: String,
        required: true
    },

    genre: {
        type: String,
        required: true
    },

    comments: {
        type: Array
    }
});

let Post = mongoose.model("Post", PostSchema);

module.exports = Post