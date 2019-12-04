
$(document).ready(function() {
    let user;

    $.getJSON(`/api/post/${window.location.pathname.split("/")[2]}`, function(data) {
        console.log(data);
        let timeElapsed;
        let timeDesc;

        if (data.timeCreated) {
            timeElapsed = (Date.now() - data.timeCreated) / 1000;
            timeDesc = "seconds";

            if (timeElapsed >= 60 && timeElapsed < 3600) {
                timeElapsed /= 60;
                if (timeElapsed <= 2) {
                    timeDesc = "minute";                    
                }
                else {
                    timeDesc = "minutes";
                }
            }

            else if (timeElapsed >= 3600 && timeElapsed < 86400) {
                timeElapsed /= 60*60;
                if (timeElapsed <= 2) {
                    timeDesc = "hour";                    
                }
                else {
                    timeDesc = "hours";
                }
            }

            if (timeElapsed >= 86400) {
                timeElapsed /= 60*60*24;
                if (timeElapsed <= 2) {
                    timeDesc = "day";
                }
                else {
                    timeDesc = "days";
                }
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
        
        $("#title").text(data.title);
        $("#body").text(data.body);
        $("#author").text("Author: " + data.author);
        $("#genre").text(data.genre);
        $("#date").text(data.date);
        if (timeElapsed) {
            $("#time-elapsed").text(timeElapsed.toFixed(0) + " " + timeDesc + " ago");
        }
        $("#votes").text(data.points);

        data.tags.forEach(item => {
            $("#tags").append(
                `
                <p class = "tag">${item}</p>
                `
            );
        });
        
        if (data.comments !== undefined) {
            data.comments.forEach(item => {
                let timeElapsed;
                let timeDesc;
                if (item.timeCreated) {
                    timeElapsed = (Date.now() - item.timeCreated) / 1000;
                    timeDesc = "seconds";
    
                    if (timeElapsed >= 60 && timeElapsed < 3600) {
                        timeElapsed /= 60;
                        timeDesc = "minutes";
                    }
    
                    else if (timeElapsed >= 3600 && timeElapsed < 86400) {
                        timeElapsed /= 60*60;
                        timeDesc = "hours";
                    }
    
                    if (timeElapsed >= 86400) {
                        timeElapsed /= 60*60*24;
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
                        <br><br>
                        <p class = "comment-text">${item.text}</p>
                        <br><br>
                        ${item.date ? `<p class = "comment-date">${item.date}</p>` : ""}
                        ${item.timeCreated !== undefined ? `<p class = "comment-timeElapsed">${timeElapsed.toFixed(0)} ${timeDesc} ago</p>` : ""}
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

    $("#comment-body").on("keydown", function(event) {
        
        if (event.keyCode === 9) {
            event.preventDefault();
            let cursorPosition = $("#comment-body").prop("selectionStart");
            let value = $("#comment-body").val();
            let textBefore = value.substring(0, cursorPosition);
            let textAfter = value.substring(cursorPosition, value.length);

            $("#comment-body").val(textBefore + "\t" + textAfter)
        }
    });

    $("#points").on("click", ".div-button", function(event) {
        event.preventDefault();
        let value;
        if ($(this).attr("id") === "upvote") {
            console.log("+1");
            value = "+";
        }
        else if ($(this).attr("id") === "downvote") {
            value = "-";
        }

        $.ajax({
            url: "/api/vote",
            method: "PUT",
            data: {
                id: window.location.pathname.split("/")[2],
                value: value
            }
        });
    })

});