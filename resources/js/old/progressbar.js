var countUpTimer;
var countUp_number = -10;
var deferred       = $.Deferred();
var promise        = deferred.promise();

$(document).ready(function () {
    $("#run").click(function(){
        var countUpTimer;
	var countUp_number = -10;
	var deferred       = $.Deferred();
	var promise        = deferred.promise();
	
    $("#progressbar").progressbar();
    $("#progressbar").css({
        'background': 'LightYellow'
    });
    $("#progressbar > div").css({
        'background': 'Orange'
    });
    
    $("#fail").click(function () {
        deferred.reject();
    });

    function result() {
        alert("Done!");
    }

    function failed() {
        $("#progressbar").css({
            'background': 'red'
        });
    }

    function inProgress() {
	$("#progress").css('width',data+'%');
	$("#progress").html(data+'%');

        $("#progressbar").progressbar({
            value: countUp_number
        });
        $("#progressbar > span").html(countUp_number + "%");
    }

    function countUp() {
	$.post(url).

        if (countUp_number < 100) {
            countUp_number += 10;
            deferred.notify();
            countUpTimer = setTimeout(countUp, 500);
        } else {
            deferred.resolve();
        }
    }

    promise.done(result);
    promise.fail(failed);
    promise.progress(inProgress);

    countUp();
    });
});