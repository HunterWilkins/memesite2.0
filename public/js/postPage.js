
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
                if (item.timeCreated) {
                    let timeElapsed = (Date.now() - item.timeCreated) / 1000;
                    let timeDesc = "seconds";
    
                    if (timeElapsed >= 60) {
                        timeElapsed /= 60;
                        timeDesc = "minutes";
                    }
    
                    if (timeElapsed >= 3600) {
                        timeElapsed /= 60;
                        timeDesc = "hours";
                    }
    
                    if (timeElapsed >= 86400) {
                        timeElapsed /= 24;
                        timeDesc = "days";
                    }
    
                    if (timeDesc === "days" && timeElapsed >= 30) {
                        timeElapsed /= 30;
                        timeDesc = "months";
                    }
    
                    if (timeDesc === "months" && timeElapsed >= 12) {
                        timeElapsed /= 12;
                        timeDesc = "years";
                    }
    
    
                }

                $("#comments").prepend(
                    `
                    <div class = "comment">
                        <p class = "comment-author"><em>${item.author}</em></p>
                        
                        <p class = "comment-text">${item.text}</p>
                        ${item.date ? <p class = "comment-date">${item.date}</p> : null}
                        
                        ${item.timeCreated ? <p class = "comment-timeElapsed">${timeElapsed.toFixed(0)} ${timeDesc} ago</p> : null}
                    </div>
                    `
                )
            });    
        }
    });
    
    $("#submit-comment").on("click", function() {
        let today = new Date();
        let date = today.getFullYear() + " - " + (today.getMonth() + 1) + " - " + today.getDate();
        $.ajax({
            url: "/api/createComment",
            method: "PUT",
            data: {
                postId: window.location.pathname.split("/")[2],
                text: $("#comment-body").val(),
                date: date,
                timeCreated: Date.now()
            }
        })
    });

});