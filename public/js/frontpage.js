$(document).ready(function() {
    let postQuantity = 0;

    $.getJSON("/api/post/all", function(data) {
        data.forEach(item => {
            postQuantity++;
            $("main").append(
                `<a class = "post" href = "/posts/${item.id}">
                    <p class = "post-title">${item.title}</p>
                    <p class = "post-author"><em>${item.author}</em></p>
                </a>
                `
            );
        });
    });

    
});