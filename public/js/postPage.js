$(document).ready(function() {
    console.log(window.location.pathname.split("/")[2]);
    $.getJSON(`/api/post/${window.location.pathname.split("/")[2]}`, function(data) {
        console.log(data);
        $("#title").text(data.title);
        $("#body").text(data.body);
        $("#author").text(data.author);
        $("#genre").text(data.genre);
        $("#tags").text(data.tags);
    });


});