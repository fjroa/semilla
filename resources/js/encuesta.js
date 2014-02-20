
$(document).ready(function(){	
	
	$('form').submit(function(){
		$(this).find('input[type="text"], textarea').each(function(){
			this.value = this.value.toUpperCase();
		});
	});
	
    $('#datetimepicker').datetimepicker({
	      language: 'es'
	      , pickTime: false
	      , format: 'dd/MM/yyyy'
	      , weekStart: 1
	      , startDate: new Date(1900, 1, 1)
	      , endDate: new Date()
	});
	$('#datetimepicker').on('changeDate', function(e) {	
		if(e.date != null){
			$("input[name='edadAnniosAlu']").val(Math.floor(ageYears(e.date, new Date())));
			$("input[name='edadMesesAlu']").val(monthDiff(e.date, new Date()));
		} 
	});
	
	var fNac = $("input[name='fechaNacimientoAlu']").val();
	if(fNac != null){		
		$("input[name='fechaNacimientoAlu']").change();		
	}
	
	$('.inputs, #toca textarea').click(function(){
		if($(this).val() != null){
			$(this).select();
		}
	});
	
	var nivelCurso = $("input[name='curCurso.numero']").val();	
	$('.inputs').keypress(function(event) { return event.keyCode != 13 && event.keyCode != 9 ; });
	$(".inputs, #toca textarea").keyup(function (e) {
		//e.stopPropagation();
		//console.log($(this).index(".inputs, #toca textarea"), $(this).index());		 
		var idx    = $(this).index(".inputs, #toca textarea");
        var newidx = idx;
        var attrName = $(this).attr("name"); 
        
	    if (e.which == 8 && this.value.length == 0) {
	    	//console.log("Atras");            
            newidx = (idx == 0)?idx:idx-1;
            $(".inputs, #toca textarea").eq(newidx).focus().select();
            
            if($(this).hasClass("greenbg")) $(this).removeClass("greenbg");
        } else {     
        	if($(this).is('textarea')){        		
        		if(e.keyCode == 9){        			
        			
        			if($('.input:last', '#toca').is(':focus')){	
        				//console.log('Ultimo campo, pasando a PSC');
        				e.preventDefault();
        				e.stopImmediatePropagation();
        				
        				$('#frmsHPV a[href="#psc"]').tab('show');
        				if($('.input:visible', '#psc').eq(1).is(':focus')){
        					
        					$('.input:visible', '#psc').eq(0).focus(); 
        				}
        			} else {
        				newidx = (idx == $(".inputs, #toca textarea").length)?idx:idx+1;
            	    	$(".inputs, #toca textarea").eq(newidx).select().focus();
        			}        			
        			
        		}
        		if(e.keyCode == 13){
        			var vv = $(this).val();
        			$(this).val(vv + '\n');
        		}
        			
        	} else
        	if($.isNumeric($(this).val())){
        		// Validaciones de valores
        		var _var = parseInt($(this).val(), 10);
        		var valid = true;
        		// Para TOCA los valores del bloque de preguntas deben ser del 1 a 6        		
        		if(attrName.indexOf("FListaControlesTOCA_") != -1){
        			if(_var <= 0 || _var > 6){
        				$(this).val("");
        				valid = false;
        			}
        		} else
        		// Para TOCA los valores de las preguntas de "continuidad" deben ser del 1 a 2        		
        		if(attrName.indexOf("txtTOCA_C") != -1){
        			//Excepto la pregunta "Cual?" que se refiere al curso que repitio
        			if (attrName == "respRespuestapreguntas['txtTOCA_C5'].valor"){
        				if (nivelCurso == "5" || nivelCurso == "6" || nivelCurso =="7" || nivelCurso == "8"){
        					if(_var <= 0 || _var > 9){
                				$(this).val("");
                				valid = false;
                			}
        				} else {
        					if(_var <= 0 || _var > 5){
                				$(this).val("");
                				valid = false;
                			}
        				}
        				
        			} else {
        				if(_var <= 0 || _var > 2){
            				$(this).val("");
            				valid = false;
            			}
        			}
        			
        		} else
        		// Para TOCA los valores de las preguntas de "global" deben ser del 1 a 6        		
        		if(attrName == "respRespuestapreguntas['txtTOCA_A'].valor"
        				|| attrName == "respRespuestapreguntas['txtTOCA_B'].valor"){
        			if(_var <= 0 || _var > 6){
        				$(this).val("");
        				valid = false;
        			}
        		} else 
        		// Para TOCA los valores de las preguntas de "antecedentes de atencion" son de 1 a 3     		
        		if(attrName.indexOf("txtTOCA_A_") != -1){
        			//Las dos primeras preguntas del bloque en el nivel 8 solo pueden contener de 1 a 2
        			if (((attrName == "respRespuestapreguntas['txtTOCA_A_1'].valor") ||
        				(attrName == "respRespuestapreguntas['txtTOCA_A_2'].valor")) &&
        				nivelCurso == "8"){
						if(_var <= 0 || _var > 2){
							$(this).val("");
							valid = false;
						}
					} else{
	        			if(_var <= 0 || _var > 3){
	        				$(this).val("");
	        				valid = false;
	        			}	
					}
        		} else
        		//Para PSC los valores del bloque de preguntas deben ser del 1 a 3
        		if(attrName.indexOf("FListaControlesPSC_") != -1){
        			if(_var <= 0 || _var > 3){
        				$(this).val("");
        				valid = false;
        			}
        		} else
        		// Para PSC las preguntas de "continuidad" van del 1 a 2
        		if(attrName.indexOf("txtPSC_") != -1){
        			//excepto la primera, que va de 1 a 4 para HPVII y de 1 a 3 para HPVI
        			if (attrName == "respRespuestapreguntas['txtPSC_A'].valor"){
        				if (nivelCurso == "5" || nivelCurso == "6" || nivelCurso =="7" || nivelCurso == "8"){
                			if(_var <= 0 || _var > 4){
                				$(this).val("");
                				valid = false;
                			}
        		        } else {
                			if(_var <= 0 || _var > 3){
                				$(this).val("");
                				valid = false;
                			}
        		        }

        			} else {
            			if(_var <= 0 || _var > 2){
            				$(this).val("");
            				valid = false;
            			}
        			}

        		}
        		
        		if(valid){
        			// Avanza al proximo campo
            		$(this).addClass("greenbg");
        	        //console.log("Adelante");
        			newidx = (idx == $(".inputs, .input").length)?idx:idx+1;
        			if(attrName.indexOf('txtTOCA_B') != -1){
        				$('textarea[name*="memoTOCAProfesor"]').eq(0).focus().select();
        			} else if($(this).attr('name').indexOf('txtTOCA_A_5') != -1){    					
        				if($('input[name*="txtTOCA_A_6"]').length > 0){
        					$(".inputs, .input").eq(newidx).focus().select();
        				} else {
        					if($('textarea[name*="memoTOCAEquipo"]').length > 0){
            					$('textarea[name*="memoTOCAEquipo"]').eq(0).focus().select();
            				}
        				}
    				} else if($(this).attr('name').indexOf('txtTOCA_A_6') != -1){
    					if($('textarea[name*="memoTOCAEquipo"]').length > 0){
        					$('textarea[name*="memoTOCAEquipo"]').eq(0).focus().select();
        				}        				
        			} else {
        				$(".inputs, #toca textarea").eq(newidx).focus().select();
        			}
        	    	
        		}
        		    	    	
        	} else {
        		$(this).val("");
        		//alert("Valor incorrecto para el campo");
        	}		    	    
		}
	    if($(this).val() == "" && (e.keyCode == 13 || e.keyCode == 9)){
	    	newidx = (idx == $(".inputs, #toca textarea").length)?idx:idx+1;
	    	$(".inputs, #toca textarea").eq(newidx).select().focus();
	    }
	    e.preventDefault();
	    e.stopImmediatePropagation();
	    
	    return e.keyCode != 13 && e.keyCode != 9;
	        
	});  
	
	/**
	 * Metodo para capturar acciones especiales de teclado.
	 * Las teclas F12 y F11 no se pueden mapear ya que gatillan acciones especiales del navegador. 
	 * Se recomienda revisar http://www.quirksmode.org/js/keys.html
	 */
	$(':enabled').keypress(function(e){ return e.keyCode != 13 && e.keyCode != 9; });
	$(':enabled').keyup(function(e){	
		var self = $(this)
	      , form = self.parents('form:eq(0)')
	      , focusable
	      , next
	      ;		
		
		if (!$(this).is('textarea') && (e.keyCode == 13 || e.keyCode == 9)) {
			//console.log('Siguiente');
	        focusable = form.find('input,select,textarea').filter(':visible');
	        if($('.input:last', '#toca').is(':focus')){				
				$('#frmsHPV a[href="#psc"]').tab('show');
			} else{
				next = focusable.eq(focusable.index(this)+1);
		        if (next.length) {
		        	if($(this).attr('name').indexOf('txtTOCA_B') != -1){
        				next = $('textarea[name*="memoTOCAProfesor"]').eq(0);
        			} else if($(this).attr('name').indexOf('txtTOCA_A_5') != -1){    					
        				if($('input[name*="txtTOCA_A_6"]').length == 0){        					
        					if($('textarea[name*="memoTOCAEquipo"]').length > 0){
            					next = $('textarea[name*="memoTOCAEquipo"]').eq(0);
            				}
        				}
    				} else if($(this).attr('name').indexOf('txtTOCA_A_6') != -1){
    					if($('textarea[name*="memoTOCAEquipo"]').length > 0){
        					next = $('textarea[name*="memoTOCAEquipo"]').eq(0);
        				}        				
        			}
        			next.select().focus();        			
		            
		        }
			}	        
	         
	        return false;
	    }
	});
	$(document).keyup(function(e){
		/*
		 * F1 Muestra la ayuda (key: 112)
		 * F2 Imprimir Página  (key: 113)
		 * F4 Duplicar Registro  (key: 115)
		 * F6 Nuevo Registro  (key: 117)
		 * F7 Borrar Registro  (key: 118)
		 * F8 Buscar Registro  (key: 119)
		 * F10 Aceptar  (key: 121)
		 * F12 Volver (key: 123)
		 * */			
		
		//console.log('charcode', e.charCode, 'keycode', e.keyCode);
		//console.log('which', e.which);
		// Si el foco esta en el campo memoTOCAProfesor enter pasa al campo siguiente
		/*if($('textarea[name*="memoTOCAProfesor"]').eq(0).is(':focus')){
			if(e.keyCode  == 13 || e.keyCode  == 9){
				//console.log('En memoTOCAProfesor');
				$('input[name*="txtTOCA_A_1"]').focus();
				$('input[name*="txtTOCA_A_1"]').select();
			}
		}
		
		if(e.keyCode  == 13 || e.keyCode  == 9){
			// Detecta si esta posicionado en la última etiqueta de tipo input en el formulario toca
			// De ser asi muestra la pestaña psc al presionar enter o tab
			if($('.input:last', '#toca').is(':focus')){	
				//console.log('Ultimo campo, pasando a PSC');
				e.preventDefault();
				e.stopImmediatePropagation();
				
				$('#frmsHPV a[href="#psc"]').tab('show');
				if($('.input:visible', '#psc').eq(1).is(':focus')){
					
					$('.input:visible', '#psc').eq(0).focus(); 
				}
			}			
			
		} else*/ 
		if (e.keyCode == 121){ // F10	
			if($('#frmActionVar').val() == 'new' || $('#frmActionVar').val() == 'edit')
				$('button[type="submit"]').trigger('click');			
		} else if (e.keyCode == 119){ // F8			
			location.href = $('div.form-actions a.btn-success').eq(0).attr('href');			
		} 
		 
	});
    
});

//http://stackoverflow.com/questions/11346069/how-to-get-difference-in-year-where-dates-are-in-yyyy-mm-dd
function ageYears(d1, d2){	
	var milli=d2-d1;
	var milliPerYear=1000*60*60*24*365.26;

	return yearsApart=milli/milliPerYear;
}

// http://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months=months%12;
}