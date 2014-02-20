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
	$(tabla + " tbody tr").eq($(tabla + " tbody tr").length-1).remove();

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
	
	$(tabla + " tbody td").on("dblclick", function(e) {
		e.preventDefault();
		var tr = $(this).parent();
		var id = $(tr).find("input:radio").attr('checked', 'checked');
		$('a.btnSeleccionar').trigger('click');
		return false;
	});	
	
	$(paginacion + " select").tooltip();
}