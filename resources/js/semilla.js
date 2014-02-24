/**
 * OJO que si cambia el contexto esto no va a funcionar (ref url en la llamada
 * ajax)
 */
$(document).ready( function() {
	$("nav span[id='netOK'], nav span[id='netNOK'], nav a[id='btnsinc']").hide();
	checkConnection();
	//setInterval("checkConnection()", 15000);
	
	$('a, button, span').tooltip({
		delay : {
			show : 800,
			hide : 10
		}
	});

	$(".alertTransmitir").click(function(e) {
		e.preventDefault();
		alert("Debe transmitir todas sus modificaciones para poder recibir nuevos cambios.");
	});
	
	$('#btnsinc').click(function(e){
		e.preventDefault();
		//console.log($(this).attr('href'));
		
		var progresspump = setInterval(increaseProgress, 1000);
		var _url = $(this).attr('href');
		$.ajax({
			method: 'get',
			url: _url,
			complete: function(){ clearInterval(progresspump); location.href = (_url.indexOf('?')!= -1)?_url+'&actualizacionOk=true':_url+'/?actualizacionOk=true';  }
		});
	});
	
					
	
});

function increaseProgress(){	
    /* query the completion percentage from the server */
    $.post("/hpv/ws/update-progress", function(data){
      /* update the progress bar width */
    	//console.log(data);
      $("#progress").css('width',data+'%');
      /* and display the numeric value */
      $("#progress").html(data+'%');

      if (data == 0.0) {
    	  $("#progressouter").removeClass("active");
	      $("#progressbar").hide();
      }
      if (data > 0) {
    	  $("#progressbar").show();
		  $("#progressouter").addClass("active");
      }
    });
}

function checkConnection() {
	// pd: si hacemos la llamada por POST se soluciona el problema del cache de
	// IE
	$.ajax({
		url : '/hpv/ws/checkWSConnection',
		type : 'post',
		contentType : 'application/json; charset=utf-8',
		dataType : 'json',
		timeout : 10000,
		success : function(data) {
			if (!data) {
				$("nav span[id='netOK']").hide();
				$("nav a[id='btnsinc']").hide();
				$("nav span[id='netNOK']").show();
			} else {
				$("nav span[id='netNOK']").hide();
				$("nav span[id='netOK']").show();
				$("nav a[id='btnsinc']").show();
			}
		},
		error : function(req, error) {
			// console.log('Error', error);
			$("nav span[id='netOK']").hide();
			$("nav a[id='btnsinc']").hide();
			$("nav span[id='netNOK']").show();
		}
	});
}

// Original from: http://www.initializr.com/ plugins.js
// Avoid 'console' errors in browsers that lack a console.
(function() {
	var method;
	var noop = function() {
	};
	var methods = [ 'assert', 'clear', 'count', 'debug', 'dir', 'dirxml',
			'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
			'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table',
			'time', 'timeEnd', 'timeStamp', 'trace', 'warn' ];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

/**
 * Metodo de validacion de RUT
 * http://users.dcc.uchile.cl/~mortega/microcodigos/validarrut/javascript.html
 */
function dv(T) {
	var M = 0, S = 1;
	for (; T; T = Math.floor(T / 10))
		S = (S + T % 10 * (9 - M++ % 6)) % 11;
	return S ? S - 1 : 'K';
}

