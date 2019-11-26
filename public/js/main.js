$(document).ready(function() {    

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
        let postQuantity = 0;
        event.preventDefault();
        event.stopImmediatePropagation();
            
        $.getJSON("/api/post/all", function(data) {
            let tags = $("input[placeholder = Tags]").val().split(",");
            postQuantity = data.length;
            $.ajax({
                url: "/api/createPost",
                method: "POST",
                data: {
                    id: postQuantity,
                    title: $("input[placeholder = Title]").val(),
                    body: $("input[placeholder = Body]").val(),
                    genre: $("input[placeholder = Genre]").val(),
                    tags: tags,
                }
            });

        });

    });
});