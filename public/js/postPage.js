
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
            )
        })
    });
    
});