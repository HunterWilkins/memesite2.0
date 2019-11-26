$(document).ready(function() {    
    let user;
    let postQuantity = 0;

    $.getJSON("/api/posts/all", function(data) {
        postQuantity = data.length;
    });

    $("#login-form").on("click", "button", function() {
        event.preventDefault();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: `/api/${$(this).text() === "Sign In" ? "signin" : "signup" }`,
            data: {
                "username": $("input[placeholder = Username]").val(),
                "password": $("input[type=password]").val(),
                "id": Math.floor(Math.random() * 200).toString()
            },
             success: function() {        
                window.location.reload();  
             }
        });
        
    });

    $("#logout").on("click", function() {
        event.preventDefault();

        $.ajax({
            type: "POST",
            url: "/api/logout",
            success: function() {
                console.log("Succeeding!");
                window.location.reload();
            },
            error: function(jqXHR, exception) {
                console.log(jqXHR);
                console.log(exception);
            }
        });
    });

    $("#toggle-post").on("click", function() {
        $("#create-post").css({"display": "block"});
    });

    $("#submit-post").on("click", function(event) {
        let tags = $("input[placeholder = Tags]").val().split(",");

        event.preventDefault();
        event.stopImmediatePropagation();    

        $.ajax({
            url: "/api/createPost",
            method: "POST",
            data: {
                id: postQuantity,
                title: $("input[placeholder = Title]").val(),
                body: $("input[placeholder = Body]").val(),
                genre: $("input[placeholder = Genre]").val(),
                tags: tags,
            },
            success: function() {
                console.log("Success!");
            },
            error: function() {
                console.log("Error");
            }
        });

    });
});