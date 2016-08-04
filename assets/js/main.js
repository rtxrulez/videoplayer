$(function(){
    var myPlayer = videojs("#vkvideo");
    $('.vkvideo').addClass('hidden');
    setTimeout(function () {
        myPlayer.play();
        $('.vkvideo__animated').addClass('hidden');
        $('.vkvideo').removeClass('hidden');
    }, 3000)
});
