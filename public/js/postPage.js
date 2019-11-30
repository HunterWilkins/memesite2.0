
$(document).ready(function() {
    let user;

    $.getJSON(`/api/post/${window.location.pathname.split("/")[2]}`, function(data) {
        console.log(data);
        $("#title").text(data.title);
        $("#body").text(data.body);
        $("#author").text("Author: " + data.author);
        $("#genre").text(data.genre);
        data.tags.forEach(item => {
            $("#tags").append(
                `
                <p class = "tag">${item}</p>
                `
            );
        });
        
        if (data.comments !== undefined) {
            data.comments.forEach(item => {
                $("#comments").prepend(
                    `
                    <div class = "comment">
                        <p class = "comment-author"><em>${item.author}</em></p>
                        <p class = "comment-text">${item.text}</p>
                    </div>
                    `
                )
            });    
        }
    });
    
    $("#submit-comment").on("click", function() {
        $.ajax({
            url: "/api/createComment",
            method: "PUT",
            data: {
                postId: window.location.pathname.split("/")[2],
                text: $("#comment-body").val()
            }
        })
    });

});