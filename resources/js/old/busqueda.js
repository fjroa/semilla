/**
 * Habilita el autollenado predictivo para campos de texto.
 * Refierase a los ejemplos para entender como funciona. 
 * @param container Contenedor del campo que se habilitara
 * @param _url URL que realizará la llamada AJAX para cargar los valores a desplegar
 * @param _id Identificador del campo Id del objeto que se recuperara
 * @param _name Nombre del campo que se debe actualizar
 * @param _aliasId (opcional) Identificador del campo Id del objeto en notacion objeto (a usarse cuando hay Ids compuestos) 
 * @param _aliasName (opcional) analogo a lo anterior
 * @author jsanta
 */
function enableTypeAhead(container, _url, _id, _name, _aliasId, _aliasName){
	$(container).typeahead({
		source : function(query, process) {
			var _json = '{ "' + _name + '": "' + query + '" }';
			//console.log(_json);
			return $.ajax({
				url : _url,
				type : 'get',
				data : $.parseJSON(_json),
				contentType: 'application/json; charset=utf-8',
				dataType : 'json',
				success : function(result) {
					var resultList = result.map( function(item) {
						var eId   = item[_id];
					      var eName = (name != null)?item[_name]:null;
					      if(_aliasId != null){
					       eId = item[_aliasId];
					       if(_aliasId.indexOf(".") != -1){
					        var arrId = _aliasId.split(".");
					        eId = item[arrId[0]][arrId[1]];
					       } 
					      }
					      if(_aliasName != null){
					       eName = item[_aliasName];
					       if(_aliasName.indexOf(".") != -1){
					        var arrName = _aliasName.split(".");
					        eName = item[arrName[0]][arrName[1]];
					       }
					      }
					      
					      //var aItem = (_name != null)?{ id : item[_id], name : item[_name] }:{ id : item[_id] };
					      var aItem = (eName != null)?{ id : $.trim(eId), name : $.trim(eName) }:{ id : $.trim(eId) };					      
					      
					      return JSON.stringify(aItem);						
					});
					
					// Inicio Bloque para devolver arreglo de registros unicos
					try{
						var _data = {};
						$.each(resultList, function(idx, val){
							var _v = $.parseJSON(val);							
							_data[$.trim(_v.id)] = $.trim(_v.name);							
						});
						
						var _result = [];
						$.each(_data, function(idx, val){							
							var _item = '{ "id": "' + idx + '", "name": "' + val + '"}';							
							_result.push(_item);
						});						
						
						resultList = _result;
					} catch(exc){
						console.log('No se pudo filtrar por registros unicos');
					}
					// Fin Bloque para devolver arreglo de registros unicos
					
					return process(resultList);
				}
			});
		},

		matcher : function(obj) {
			var item = JSON.parse(obj);
			return ~(item.name+"").toLowerCase().indexOf((this.query+"").toLowerCase());
		},

		sorter : function(items) {
			var beginswith = [], caseSensitive = [], caseInsensitive = [], item;
			while (aItem = items.shift()) {
				var item = JSON.parse(aItem);
				if (!(item.name+"").toLowerCase().indexOf((this.query+"").toLowerCase()))
					beginswith.push(JSON.stringify(item));
				/*else if (~item.name.indexOf(this.query))
					caseSensitive.push(JSON.stringify(item));*/
				else
					caseInsensitive.push(JSON.stringify(item));
			}

			return beginswith.concat( caseSensitive, caseInsensitive);
		},

		highlighter : function(obj) {
			var item = JSON.parse(obj);
			var query = this.query.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
			return (item.name+"").replace(
				new RegExp( '(' + query + ')', 'ig'),
				function( $1, match ) {
					return '<strong>' + match + '</strong>'
				});
		},
		
		updater: function (obj) {			
			var item = JSON.parse(obj);			
			return item.name;
		}
	});
}

/**
 * Habilita el llenado de campos (en rigor la ejecucion de una funcion pasada como parametro)
 * para un campo que recibe un valor y pierde el foco.
 * @param _container Contenedor, o campo que  pierde el foco
 * @param _url URL que se llamara via AJAX cuando se pierda el foco del campo anterior (siempre y cuando tenga valores)
 * @param _callback Funcion que se debe ejecutar cuand la llamada AJAX es exitosa. Esta funcion debe recibir como parametro un JSON.
 * @param _searchid (opcional) Identificador de busqueda, en caso que la busqeuda deba realizarse por un filtro distinto al id
 * @author jsanta
 */
function deferredSearch(_container, _url, _callback, _searchid){
	//console.log("deferredSearch", _container, _url, _callback);	
	var _parsedUrl = (_url.indexOf('?') != -1)?_url.substring(0, _url.indexOf('?')):_url;
	var _params    = (_url.indexOf('?') != -1)?_url.substring(_url.indexOf('?')):'';
	_url = _parsedUrl;
	console.log(_url, _params);
	$(_container).blur(function(){
		var _searchurl = (_searchid != null)?_url + ".json":_url + $(this).val() + ".json";	
		var _data      = (_searchid != null)?'{ "' + _searchid + '": ' + $(this).val() + ' }':'{}';
		//console.log("json", _data);		
		
		if($(this).val() != null){
			if($(this).val().trim() != ""){
				$.ajax({
					url : _searchurl + _params,
					type : 'get',
					data: $.parseJSON(_data),
					contentType: 'application/json; charset=utf-8',
					dataType : 'json',
					success : function(result) {
						//console.log("Exito");
						var callbacks = $.Callbacks( "once" );
						callbacks.add( _callback );
						callbacks.fire( result );
						callbacks.remove( _callback );
					}
				});
			} else {
				console.log('Se realiza la llama a callback con el parametro en nulo (trim)');
				var callbacks = $.Callbacks( "once" );
				callbacks.add( _callback );
				callbacks.fire( null );
				callbacks.remove( _callback );
			}
		} else {
			console.log('Se realiza la llama a callback con el parametro en nulo');
			var callbacks = $.Callbacks( "once" );
			callbacks.add( _callback );
			callbacks.fire( null );
			callbacks.remove( _callback );
		}
	});
}
