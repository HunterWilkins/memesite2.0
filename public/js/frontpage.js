$(document).ready(function() {
    let postQuantity = 0;
    let pageGenre = window.location.pathname.split("/")[2]
    if (pageGenre) {
        $("#genre-picker").val(window.location.pathname.split("/")[2]);
    }
    else {
        pageGenre = "all";
    }
    
    $.getJSON(`/api/posts/${pageGenre}`, function(data) {
        if (data.length !== 0) {
            postQuantity++;

            data.forEach(item => {
                $("#posts").prepend(
                    `<a class = "post" href = "/posts/${item.id}">
                        <p class = "post-title">${item.title}</p>
                        <p class = "post-genre">${item.genre}</p>
                        <p class = "post-author"><em>${item.author}</em></p>
                    </a>
                    `
                );  
            })    
        }
        else {
            $("#posts").text("No results.");
        }
    });

    $("#genre-picker").on("change", function() {
        console.log($(this).val());
        $("#posts").empty();
        window.location.replace(`/frontpage/${$(this).val()}`);
        $.getJSON(`/api/posts/${$(this).val()}`, function(data) {
            if (data.length !== 0) {
                data.forEach(item => {
                    $("#posts").prepend(
                        `<a class = "post" href = "/posts/${item.id}">
                            <p class = "post-title">${item.title}</p>
                            <p class = "post-genre">${item.genre}</p>
                            <p class = "post-author"><em>${item.author}</em></p>
                        </a>
                        `
                    );  
                })    
            }

            else {
                $("#posts").text("No results.");
            }
        })
    })

    
});