$(document).ready(function() {
    let postQuantity = 0;
    let pageGenre = window.location.pathname.split("/")[2];
    let pageTags = window.location.pathname.split("/")[3];
    if (!pageGenre) {
        pageGenre = "all"
    }

    $("#frontpage-title").text("Frontpage - " + pageGenre);


    $.ajax({
        url:`/api/posts/${pageGenre ? pageGenre : "all"}`,
        method: "POST",
        data: {
            tags: $("#tag-picker").val()
        },
        success: function(data) {
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
                            timeDesc = "yrs";
                        }
                    }

                    $("#posts").prepend(
                        `<a class = "post" href = "/posts/${item.id}">
                            <p class = "post-title">${item.title}</p>
                            <p class = "post-author">${item.author}</p>
                            <div class = "post-rightside">
                                <p class = "post-genre">${item.genre}</p>
                                ${timeElapsed ? 
                                `<p class = "post-time-elapsed">${timeElapsed.toFixed(0)} ${timeDesc} ago</p>`
                                :
                                " "
                            }
                            </div>
                        </a>
                        `
                    );  
                })    
            }
            else {
                $("#posts").text("No results.");
            }
        }
    });

    $("#genre-picker").on("change", function() {      
        window.location.replace(`/frontpage/${$(this).val().toLowerCase()}`);
    });

    $("#genre-select").on("click", function() {
        if ($("#genres").css("display") === "none") {
            $("#genres").css({display: "block"});
        }
        else {
            $("#genres").css({display: "none"});
        }
    });

    $("#toggle-filters").on("click", function() {
        if ($("#filters").css("display") === "none") {
            $("#filters").css("display", "block");
        }
        else {
            $("#filters").css("display", "none");
        }
    })

    $("#filter-tags").on("click", function(){
        console.log($("#tag-picker").val());
        $.ajax({
            url:`/api/posts/${$("#genre-picker").val()}`,
            method: "POST",
            data: {
                tags: $("#tag-picker").val()
            },
            success: function(data) {
                $("#posts").empty();
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
                                    ${timeElapsed ? 
                                    `<p class = "post-time-elapsed">${timeElapsed.toFixed(0)} ${timeDesc} ago</p>`
                                    :
                                    " "
                                }
                                </div>
                            </a>
                            `
                        );  
                    })    
                }
                else {
                    $("#posts").text("No results.");
                }
            }
        });
    });

    $("#search").on("click", function() {
        $.ajax({
            url: "/api/posts/search/" + $("#search-bar").val(),
            method: "GET"
        });
    })

    
});