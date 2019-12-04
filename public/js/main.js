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
            url: `/api/${$(this).text() === "Sign In" ? "signin" : "signup" }`,
            data: {
                username: $("input[placeholder = Username]").val(),
                password: $("input[type=password]").val(),
                id: Math.floor(Math.random() * 2000).toString()
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
        $(".blackdrop").css({"display": "block"});
        $("#create-post").css({"display": "block"});
    });

    $("#close-post").on("click", function() {
        $(".blackdrop").css({"display": "none"});
        $("#create-post").css({"display": "none"});
    })

    $("#submit-post").on("click", function(event) {
        let tags = $("#post-tags").val().split(",");

        event.stopImmediatePropagation();    

        $.ajax({
            url: "/api/createPost",
            method: "POST",
            data: {
                id: `${Math.floor(Math.random()*2000)}${$("input[placeholder = Title]").val().toLowerCase()}${Date.now().toString().slice(8)}`,
                title: $("input[placeholder = Title]").val(),
                body: $("textarea[placeholder = Body]").val(),
                genre: $("#post-genre").val(),
                tags: tags
            },
            success: function() {
                console.log("Success!");
            },
            error: function() {
                console.log("Error");
            }
        });

    });

    $("textarea[placeholder = Body]").on("keydown", function(event) {
        
        if (event.keyCode === 9) {
            event.preventDefault();
            let cursorPosition = $("textarea[placeholder = Body").prop("selectionStart");
            let value = $("textarea[placeholder = Body]").val();
            let textBefore = value.substring(0, cursorPosition);
            let textAfter = value.substring(cursorPosition, value.length);

            $("textarea[placeholder = Body]").val(textBefore + "\t" + textAfter)
        }
    })

});