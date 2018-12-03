// $(){
$(".sideElement").hover(function () {
    $(".actualActive").removeClass("active");
    $(this).addClass("active");
}, function () {
    $(".active").removeClass("active");
    $(".actualActive").addClass("active");
});
// }
