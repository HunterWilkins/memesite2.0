$(document).ready(function() {    

    $("#login-form").on("click", "button", function() {
        event.preventDefault();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: `/api/${$(this).text() === "Sign In" ? "signin" : "signup" }`,
            data: {
                username: $("input[placeholder = Username]").val(),
                password: $("input[type=password]").val(),
                id: Math.floor(Math.random() * 200).toString()
            }
        });
    });

    $("#logout").on("click", function() {
        event.preventDefault();

        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/api/logout"
        });
    });

    $("#toggle-post").on("click", function() {
        $("#create-post").css({"display": "block"});
    });

    $("#submit-post").on("click", function() {
        $.ajax({
            url: "/api/createPost",
            method: "POST",
            data: {
                id: postQuantity,
                title: $("input[placeholder = Title]").val(),
                body: $("input[placeholder = Body]").val(),
                genre: $("input[placeholder = Genre]").val(),
                tags: $("input[placeholder = Tags]").val(),
            }
        });
    });
});