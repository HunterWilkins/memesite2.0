
$(document).ready(function() {
    let user;
    let upvotes,
        downvotes;

    $.getJSON(`/api/post/${window.location.pathname.split("/")[2]}`, function(data) {
        console.log(data);

        upvotes = data.upvotes;
        downvotes = data.downvotes;

        let timeElapsed;
        let timeDesc;
        let ratio = (((data.upvotes) / (data.upvotes + data.downvotes))*100).toFixed(0);
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
        if (data.imageLink) {
            $("#image").html(`<img src = "${data.imageLink}" alt = "${data.imageLink}"><hr>`)
        }
        $("#author").text("Author: " + data.author);
        $("#genre").text(data.genre);
        $("#date").text(data.date);
        if (timeElapsed) {
            $("#time-elapsed").text(timeElapsed.toFixed(0) + " " + timeDesc + " ago");
        }
        $("#votes").text((data.upvotes) + " / " + (data.upvotes + data.downvotes));
        $("#ratio").text(ratio !== "NaN" ? `${ratio}%` : "");
        $("#ratio-gradient").css({"background": `linear-gradient(90deg, var(--highlight) ${0}, var(--highlight) ${ratio}%, var(--layer2) ${ratio}%, var(--layer2) 100%)`})
      
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
        let replacedValue = /%20/gi;

        let date = today.getFullYear() + " - " + (today.getMonth() + 1) + " - " + today.getDate();
        $.ajax({
            url: "/api/createComment",
            method: "PUT",
            data: {
                postId: window.location.pathname.split("/")[2].replace(replacedValue, " "),
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
        let ratio;
        let value;
        if ($(this).attr("id") === "upvote") {
            console.log("+1");
            value = "+";
            upvotes++;
        }
        else if ($(this).attr("id") === "downvote") {
            value = "-";
            downvotes++;
        }

        ratio = (upvotes / (upvotes + downvotes)*100).toFixed(0);

        let id = window.location.pathname.split("/")[2];
        let replacedValue = /%20/gi;

        $.ajax({
            url: "/api/vote",
            method: "PUT",
            data: {
                id: id.replace(replacedValue, " "),
                value: value
            },
            success: function(data) {
                // let ratio = (((data.upvotes) / (data.upvotes + data.downvotes))*100).toFixed(0);
                // $("#ratio").text(ratio !== "NaN" ? `${ratio}%` : "");
                // $("#votes").text((data.upvotes) + " / " + (data.upvotes + data.downvotes));
                // $("#ratio-gradient").css({"background": `linear-gradient(90deg, rgb(0,100,0) ${0}, rgb(0,100,0) ${ratio}%, rgb(100,0,0) ${ratio}%, rgb(100,0,0) 100%)`})
            }
        });

        $("#votes").text(`${upvotes} / ${upvotes + downvotes}`);
        $("#ratio-gradient").css({"background": `linear-gradient(90deg, var(--highlight) ${0}, var(--highlight) ${ratio}%, var(--layer2) ${ratio}%, var(--layer2) 100%)`})
        $("#ratio").text(`${ratio}%`);

    });

});