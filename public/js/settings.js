$(document).ready(function(){

    $.getJSON("/api/currentUser", function(data) {
        console.log(data);

        data.posts.forEach(item => {
           
            $("#my-posts").append(
                `
                <div class = "my-post" data-postId = "${item.id}">
                    <button class = "delete-post">🗑</button>
                    <textarea class = "my-post-title" type = "text" data-field = "title">${item.title}</textarea>
                    <hr>
                    <textarea class = "my-post-body" data-field = "body">${item.body}</textarea>
                    <hr>
                    <div>
                        ${item.tags.map(tag => {
                            return `<span class = "my-tag" data-tag = "${tag}">
                            ${tag}
                            <div class = "delete-tag" 
                                data-postId = "${item.id}" 
                                data-tagId = "${item.tags.indexOf(tag)}">
                                    x
                            </div>
                            </span>`
                        }).join("")}
                    </div>
                </div>
                <br>
                `
            );
        });

        data.comments.forEach(item => {
            $("#my-comments").prepend(
                `
                <div class = "my-comment" data-commentId = "${item.id}" data-postId = "${item.postId}">
                    <p>${item.postTitle}</p>
                    <textarea>${item.text}</textarea>
                    <button class = "delete-comment" data-postId = "${item.postId}" data-comment-text = "${item.text}">🗑</button>
                </div>
                <br>
                `
            )
        })
    });

    $("#themes").on("click", "button", function() {
        let newTheme;
       
        switch($(this).text()) {
            case "Forest":
                newTheme = {
                    "--layer0": "rgb(33, 34, 27)",
                    "--layer1": "rgb(49, 63, 41)",
                    "--layer2": "rgb(56, 85, 55)",
                    "--layer3": "rgb(59, 97, 78)",
                    "--layer4": "rgb(94, 122, 109)",
                
                    "--highlight": "rgb(201, 235, 197)",
                    "--body-text": "rgb(194, 194, 194)",
                
                    "--text-color": "white",
                    "--text-family":  "sans-serif",
                }
                break;
            case "Ocean": 
                newTheme = {
                    "--layer0": "rgb(28, 27, 34)",
                    "--layer1": "rgb(41, 50, 63)",
                    "--layer2": "rgb(55, 73, 85)",
                    "--layer3": "rgb(59, 89, 97)",
                    "--layer4": "rgb(94, 122, 122)",
                
                    "--highlight": "rgb(197, 233, 235)",
                    "--body-text": "rgb(194, 194, 194)",
                
                    "--text-color": "white",
                    "--text-family":  "sans-serif",
                }
                break;
            case "Ruby": 
                newTheme = {
                    "--layer0": "rgb(34, 27, 27)",
                    "--layer1": "rgb(63, 46, 41)",
                    "--layer2": "rgb(85, 61, 55)",
                    "--layer3": "rgb(97, 77, 59)",
                    "--layer4": "rgb(122, 121, 94)",

                    "--highlight": "rgb(247, 240, 234)",
                    "--body-text": "rgb(194, 194, 194)",

                    "--text-color": "white",
                    "--text-family":  "sans-serif",
                }
                break;
            case "Gold Chip": 
                newTheme = {
                    "--layer0": "rgb(18, 18, 19)",
                    "--layer1": "rgb(31, 31, 34)",
                    "--layer2": "rgb(35, 36, 39)",
                    "--layer3": "rgb(141, 134, 76)",
                    "--layer4": "rgb(141, 134, 76)",

                    "--highlight": "rgb(255, 246, 209)",
                    "--body-text": "rgb(194, 194, 194)",

                    "--text-color": "white",
                    "--text-family":  `"Lucidia Console", Monaco, monospace`,
                }
                break;
            default: break;

        }

        $(":root").css(newTheme);
        localStorage.setItem("theme", JSON.stringify(newTheme));
    })

    $("#delete-account").on("click", function() {
        let confirmation = confirm("This will delete your account and all of your posts. Do you want to do that?");
        if (confirmation) {
            $.ajax({
                url: "/api/user/delete",
                method: "DELETE",
                success: window.location.reload()
            });
        }
    })

    $("#my-posts").on("click", ".delete-tag", function() {
        $.ajax({
            method: "PUT",
            url: "/api/deleteTag",
            data: {
                tagId: $(this).attr("data-tagId"),
                tag: $(this).parent().attr("data-tag"),
                postId: $(this).attr("data-postId")
            },
            success: function() {
                console.log("SUCCESS");
            },
            error: function() {
                console.log("ERROR");
            }
        });

        $(this).parent().css({"display": "none"});

    });

    $("#my-posts").on("click", ".delete-post", function() {
        $.ajax({
            url: "/api/deletePost",
            method: "DELETE",
            data: {
                postId: $(this).parent().attr("data-postId")
            }
        });

        $(this).parent().remove();
    })

    $("#my-posts").on("blur", "textarea, input", function() {
        $.ajax({
            url: "/api/updatePost",
            method: "PUT",
            data: {
                postId: $(this).parent().attr("data-postId"),
                field: $(this).attr("data-field"),
                update: $(this).val()
            }

        })
    });

    $("#my-comments").on("click", ".delete-comment", function() {
        $.ajax({
            url: "/api/deleteComment",
            method: "PUT",
            data: {
                text: $(this).attr("data-comment-text"),
                postId: $(this).attr("data-postId")
            }
        })
    });

    $("#my-comments").on("blur", ".my-comment textarea", function() {
        $.ajax({
            url: "/api/updateComment",
            method: "PUT",
            data: {
                text: $(this).val(),
                commentId: $(this).parent().attr("data-commentId"),
                postId: $(this).parent().attr("data-postId")
            }
        })
    })
    
    $("#toggle-my-posts").on("click", function() {
        toggleDisplay("#my-posts");
    });

    $("#toggle-my-comments").on("click", function(){
        toggleDisplay("#my-comments");
    });

    function toggleDisplay(element) {
        let toggler = "#toggle-" + element.slice(1);
        console.log(toggler);
        if ($(element).css("display") === "block") {
            $(element).css({display: "none"});
            $(toggler + " button").css({transform: "rotateZ(0deg)"});
        }
        else {
            $(element).css({display: "block"});

            $(`${toggler} button`).css({transform: "rotateZ(-90deg)"});
        }

        switch(element) {
            case "#my-comments":
                $("#my-posts").css({display: "none"});
                $("#toggle-my-posts button").css({transform: "rotateZ(0deg)"});
                break;

            case "#my-posts":
                $("#my-comments").css({display: "none"});
                $("#toggle-my-comments button").css({transform: "rotateZ(0deg)"});
                break;
        }
    }


});