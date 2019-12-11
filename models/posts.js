const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PostSchema = new Schema ({
    id: {
        type: String,
        required: true,
        unique: true
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

    imageLink: {
        type: String
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

    upvotes: {
        type: Number
    },

    downvotes : {
        type: Number
    },

    date: {
        type: String
    },

    timeCreated: {
        type: Number
    }
});

let Post = mongoose.model("Post", PostSchema);

module.exports = Post