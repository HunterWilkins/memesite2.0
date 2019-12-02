const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PostSchema = new Schema ({
    id: {
        type: String,
        required: true
    },
    
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
        type: Array,
        required: true
    },

    genre: {
        type: String,
        required: true
    },

    comments: {
        type: Array
    },
    points: {
        type: Number
    }
});

let Post = mongoose.model("Post", PostSchema);

module.exports = Post