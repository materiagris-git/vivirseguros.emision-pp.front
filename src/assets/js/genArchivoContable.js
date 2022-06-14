$(document).ready(function() {

    $('#tblGenACPagosRecurrente').DataTable({
        "ordering": false,
        "searching": true,
        "paging": true,
        "pageLength": 5,
        "lengthChange": false,
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se han identificado pólizas con la información capturada.",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            //"sInfo": "Registros del _START_ al _END_ de _TOTAL_ registros",
            "sInfo": "",
            "sInfoEmpty": "",
            "sInfoFiltered": "(Filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "",
            "searchPlaceholder": "Buscar",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "No hay datos.",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            }
        },
        "responsive": true
    });

});