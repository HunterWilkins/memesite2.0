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

});