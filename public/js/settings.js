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
            console.log(item);
            console.log(data.posts[item.postId]);
            $("#my-comments").prepend(
                `
                <div class = "my-comment">
                    <p>${item.postTitle}</p>
                    <p>${item.commentObj.text}</p>
                    <button class = "delete-comment" data-postId = "${item.commentObj.postId}" data-comment-text = "${item.commentObj.text}">🗑</button>
                </div>
                <br>
                `
            )
        })
    });

    $("#change-username").on("click", function() {
        $.ajax({
            url: "/api/user/update-username",
            method: "PUT",
            data: {
                username: $("#account-name"),
                password: $("#account-password")
            }
        });
    });

    $("#my-posts").on("click", ".delete-tag", function() {
        console.log("Deleting tag...");
        console.log($(this).attr("data-tagId"));
        console.log($(this).parent(".my-tag"));
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
        console.log("Blurring Called...")
        console.log($(this).val());

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