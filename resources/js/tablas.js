/**
 * @author jsanta
 */
$.extend($.tablesorter.themes.bootstrap, {
	// these classes are added to the table. To see other table classes
	// available,
	// look here: http://twitter.github.com/bootstrap/base-css.html#tables
	table : 'table table-bordered',
	header : 'bootstrap-header', // give the header a gradient background
	footerRow : '',
	footerCells : '',
	icons : '', // add "icon-white" to make them white; this icon class is added
				// to the <i> in the header
	sortNone : 'icon-sort',
	sortAsc : 'icon-sort-up',
	sortDesc : 'icon-sort-down',
	active : '', // applied when column is sorted
	hover : '', // use custom css here - bootstrap class may not override it
	filterRow : '', // filter row class
	even : '', // odd row zebra striping
	odd : '' // even row zebra striping
});

/**
 * Habilita el ordenador y paginador de tablas. Requiere jQuery, BootStrap y
 * TableSorter para funcionar.
 * 
 * @param tabla
 *            selector de tabla en modo texto
 * @param paginacion
 *            selector de paginacion en modo texto
 */
function enableTableSorter(tabla, paginacion) {
	$(tabla + " tbody tr").eq($(tabla + " tbody tr").length - 1).remove();

	$(tabla)
			.tablesorter({
				theme : "bootstrap",
				headerTemplate : '{content} {icon}',
				widgets : [ "uitheme" ]
			})
			.tablesorterPager(
					{
						container : $(paginacion),
						output : 'Mostrando registros del {startRow} al {endRow} / Total: {totalRows}',
						cssGoto : ".pagenum",
						fixedHeight : true,
					});

	$(tabla + ' .checkall').on(
			'click',
			function() {
				$(this).closest('table').find(':checkbox').prop('checked',
						this.checked);
			});

	$(tabla + " tbody td").on("dblclick", function() {
		var tr = $(this).parent();
		var id = $(tr).find("input:checkbox").val();
		location.href = "./" + id;
	});

	$(tabla + " a.delete-action")
			.click(
					function() {
						var _h = $(this).attr("href");
						var _hh = _h.split("/");
						console.log(_hh);

						return confirm("\u00BF Est\u00E1 seguro de querer eliminar el registro "
								+ _hh[1] + " ?");
					});

	$(tabla + " .operations .btn-danger")
			.click(
					function(e) {
						e.preventDefault();
						var msg = "";

						if (confirm("\u00BF Est\u00E1 seguro de querer eliminar los registros seleccionados ?\nEsta operaci\u00F3n es irreversible.")) {
							var chk = $("input[type='checkbox']");

							$(chk)
									.each(
											function(elem) {
												if ($(this).is(":checked")) {
													var id = $(this).val();
													$
															.ajax({
																context : this,
																url : './' + id,
																type : 'DELETE',
																success : function(
																		result) {
																	msg += "Se ha eliminado el registro: "
																			+ id
																			+ "\n";
																	$(this)
																			.closest(
																					"tr")
																			.remove();
																	var auxTable = $(".tablesorter");
																	auxTable
																			.trigger(
																					"update")
																			.trigger(
																					"sorton",
																					[ auxTable
																							.get(0).config.sortList ])
																			.trigger(
																					"appendCache")
																			.trigger(
																					"applyWidgets");
																	window.location.href="./";
																},
																error : function(
																		result) {
																	alert("Se ha producido un error al intentar eliminar el registro: "
																			+ id);
																}
															});
												}
											});

						}
					});

	$(tabla + " .operations .btn-detail").click(function(e) {
		e.preventDefault();
		var chk = $("input[type='checkbox']");
		var counter = 0;
		$(chk).each(function(elem) {
			if ($(this).is(":checked")) {
				counter++;
			}
		});
		
		if (counter == 0) {
			alert("Debe seleccionar al menos un elemento");
		} else if (counter > 1){
			alert("Solo puede seleccionar un elemento");
		} else {
			$(chk).each(function(elem) {
				if ($(this).is(":checked")) {
					var id = $(this).val();
					window.location.href="./"+id;
				}
			});
		}

	});

	$(paginacion + " select").tooltip();
}