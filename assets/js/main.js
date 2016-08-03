
$(document).ready(function(){
    //  formatTime для перевода секунд в формат HH:mm:ss или mm:ss
    function formatTime(time, hours) {
        if (hours) {
            var h = Math.floor(time / 3600);
            time = time - h * 3600;

            var m = Math.floor(time / 60);
            var s = Math.floor(time % 60);

            return h.lead0(2)  + ":" + m.lead0(2) + ":" + s.lead0(2);
        } else {
            var m = Math.floor(time / 60);
            var s = Math.floor(time % 60);

            return m.lead0(2) + ":" + s.lead0(2);
        }
    }

    Number.prototype.lead0 = function(n) {
        var nz = "" + this;
        while (nz.length < n) {
            nz = "0" + nz;
        }
        return nz;
    };

    var controls = {
        video: $("#vkvideo"),
        playpause: $("#playpause"),
        togglePlayback: function() {
            (video.paused) ? video.play() : video.pause();
        },
        total: $("#total"),
        buffered: $("#buffered"),
        progress: $("#current"),
        duration: $("#duration"),
        currentTime: $("#currenttime"),
        dynamic: $("#dynamic"),
        hasHours: false
    };

    var video = controls.video[0];

    // пауза или пуск
    controls.playpause.on('click', function(){
        controls.togglePlayback();
    });

    // если проигрывание заверщено то меняем кнопку плей
    video.addEventListener("ended", function() {
        video.pause();
        controls.playpause.toggleClass("paused");
    });

    // подписываемся под события
    video.addEventListener("play", function() {
        controls.playpause.toggleClass("paused");
    });
    video.addEventListener("pause", function() {
        controls.playpause.toggleClass("paused");
    });

    video.addEventListener("canplay", function() {
        controls.hasHours = (video.duration / 3600) >= 1.0;
        controls.duration.text(formatTime(video.duration, controls.hasHours));
        controls.currentTime.text(formatTime(0),controls.hasHours);
    }, false);

    // отслеживание события изменения времени видео
    video.addEventListener("timeupdate", function() {
        controls.currentTime.text(formatTime(video.currentTime, controls.hasHours));

        var progress = Math.floor(video.currentTime) / Math.floor(video.duration);
        controls.progress[0].style.width = Math.floor(progress * controls.total.width()) + "px";
    }, false);

    // клик по прогрессбару
    controls.total.click(function(e) {
        var x = (e.pageX - this.offsetLeft)/$(this).width();
        video.currentTime = x * video.duration;
    });

    video.addEventListener("progress", function() {
        var buffered = Math.floor(video.buffered.end(0)) / Math.floor(video.duration);
        controls.buffered[0].style.width =  Math.floor(buffered * controls.total.width()) + "px";
    }, false);

    // отключение включение звука
    controls.dynamic.click(function() {
        var classes = this.getAttribute("class");

        if (new RegExp('\\boff\\b').test(classes)) {
            classes = classes.replace(" off", "");
        } else {
            classes = classes + " off";
        }

        this.setAttribute("class", classes);
        video.muted = !video.muted;
    });
});
