$(document).ready(function() {


    let postQuantity = 0;
    let pageGenre = window.location.pathname.split("/")[2]
    if (pageGenre) {
        $("#genre-picker").val(window.location.pathname.split("/")[2]);
    }
    else {
        pageGenre = "all";
    }
    
    $.getJSON(`/api/posts/${pageGenre}`, function(data) {
        if (data.length !== 0) {
            postQuantity++;

            data.forEach(item => {
                let timeElapsed;
                let timeDesc;

                if (item.timeCreated) {
                    timeElapsed = (Date.now() - item.timeCreated) / 1000;
                    timeDesc = "sec";
    
                    if (timeElapsed >= 60 && timeElapsed < 3600) {
                        timeElapsed /= 60;
                        timeDesc = "min";
                    }
    
                    else if (timeElapsed >= 3600 && timeElapsed < 86400) {
                        timeElapsed /= 60*60;
                        if (timeElapsed <= 2) {
                            timeDesc = "hr";
                        }
                        else {
                            timeDesc = "hrs";
                        }
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
                        timeDesc = "yrs";
                    }
                }

                $("#posts").prepend(
                    `<a class = "post" href = "/posts/${item.id}">
                        <p class = "post-title">${item.title}</p>
                        <p class = "post-author"><em>${item.author}</em></p>
                        <div class = "post-rightside">
                            <p class = "post-genre">${item.genre}</p>
                            <p class = "post-time-elapsed">${timeElapsed.toFixed(0)} ${timeDesc} ago</p>
                        </div>
                    </a>
                    `
                );  
            })    
        }
        else {
            $("#posts").text("No results.");
        }
    });

    $("#genre-picker").on("change", function() {
        console.log($(this).val());
        window.location.replace(`/frontpage/${$(this).val()}`);
    });

    
});