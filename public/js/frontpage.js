$(document).ready(function() {
    let postQuantity = 0;

    $.getJSON("/api/posts/all", function(data) {
        data.forEach(item => {
            postQuantity++;
            $("#posts").prepend(
                `<a class = "post" href = "/posts/${item.id}">
                    <p class = "post-title">${item.title}</p>
                    <p class = "post-author"><em>${item.author}</em></p>
                </a>
                `
            );
        });
    });

    $("#genre-picker").on("change", function() {
        console.log($(this).val());
        $("#posts").empty();
        $.getJSON(`/api/posts/${$(this).val()}`, function(data) {
            data.forEach(item => {
                $("#posts").prepend(
                    `<a class = "post" href = "/posts/${item.id}">
                        <p class = "post-title">${item.title}</p>
                        <p class = "post-author"><em>${item.author}</em></p>
                    </a>
                    `
                );  
            })
        })
    })

    
});