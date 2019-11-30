$(document).ready(function(){

    $.getJSON("/api/currentUser", function(data) {
        console.log(data);

        data.forEach(item => {
           
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
    


});