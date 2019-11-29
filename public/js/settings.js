$(document).ready(function(){

    $.getJSON("/api/currentUser", function(data) {
        console.log(data);

        data.forEach(item => {
            item.tags.forEach(item=>{
                console.log(item);
            })
            $("#my-posts").append(
                `
                <div class = "my-post">
                    <h3>${item.title}</h3>
                    <hr>
                    <p>${item.body}</p>
                    <hr>
                    <div>
                        ${item.tags.map(tag => {
                            return `<span class = "my-tag" data-tag = "${tag}">
                            ${tag}
                            <p class = "delete-tag" 
                                data-postId = "${item.id}" 
                                data-tagId = "${item.tags.indexOf(tag)}">
                                    x
                            </p>
                            </span>`
                        }).join("")}
                    </div>
                </div>
                <br>
                `
            )
        })
    })

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

    })
    

});