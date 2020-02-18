let theme = localStorage.getItem("theme");

// Changes color scheme of page to match localStorage value before page load
if (theme) {
    $(":root").css(JSON.parse(theme));
    console.log($(":root").css("--layer0"));
}

$(document).ready(function() {    
    let user;
    let postQuantity = 0;

    $("#show-account").on("click", function() {
        if ($("#login-form").css("display") !== "block") {
            $("#login-form").css({display: "block"});
        }

        else {
            $("#login-form").css({display: "none"});
        }
    });

    $("#login-form").on("click", "button", function() {
        event.preventDefault();
        let route = $(this).text();
        $.ajax({
            type: "POST",
            url: `/api/${route === "Sign In" ? "signin" : "signup" }`,
            data: {
                username: $("input[placeholder = Username]").val(),
                password: $("input[type=password]").val(),
                id: Math.floor(Math.random() * 2000).toString()
            },
            success: function(data) { 
                console.log(data);
                if (data.name == "MongoError") {
                    console.log(route);
                    if (route === "/Up") {
                        alert("A user with that username already exists. Try making up a new username.");
                    }
                    else {
                        alert("Wrong Username or Password");
                    }
                }       
            },
            error: function(data) {
                if (route === "/Up") {
                    alert("A user with that username already exists. Try making up a new username.");
                }
                else {
                    alert("Wrong Username or Password");
                }
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
        event.stopImmediatePropagation();  
     
        // Prevents users from posting questionable image links
        let forbiddenWords = [
            "porn",
            "tits",
            "boobs",
            "dick",
            "penis",
            "sex",
            "xxx",
            "xvideos",
            "xhamster",
            "redtube",
        ];

        let tags = $("#post-tags").val().split(",");
        let imageLink = $("#image-link").val();
        let familyFriendly = true;
       
        forbiddenWords.forEach(item => {
            if (imageLink.indexOf(item) !== -1 && familyFriendly === true) {
                familyFriendly = false;
            }
        });
        
        if (familyFriendly == true) {
            $.ajax({
                url: "/api/createPost",
                method: "POST",
                data: {
                    id: `${Math.floor(Math.random()*2000)}${Date.now().toString().slice(8)}`,
                    title: $("input[placeholder = Title]").val(),
                    body: $("textarea[placeholder = Body]").val(),
                    imageLink: $("#image-link").val(),
                    genre: $("#post-genre").val(),
                    tags: tags
                },
                success: function(data) {
                    console.log("Success!");
                    window.location.replace("/posts/" + data.id)
                },
                error: function() {
                    console.log("Error");
                }
            });

        }

        else {
            alert("You're not allowed to post that on this site.");
        }
    });

    // Allows for "Tab" to indent while typing in CreatePost textarea
    $("textarea[placeholder = Body]").on("keydown", function(event) {
        
        if (event.keyCode === 9) {
            event.preventDefault();
            let cursorPosition = $("textarea[placeholder = Body").prop("selectionStart");
            let value = $("textarea[placeholder = Body]").val();
            let textBefore = value.substring(0, cursorPosition);
            let textAfter = value.substring(cursorPosition, value.length);

            $("textarea[placeholder = Body]").val(textBefore + "\t" + textAfter)
        }
    });

});