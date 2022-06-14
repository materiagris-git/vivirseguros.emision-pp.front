$(document).ready(function() {
    $(".btn-icon").click(function() {
        $("#busqueda").hide();
        $("#contenido").show();
    });

    $("#example").DataTable({
        info: false,
        language: {
            search: "",
            searchPlaceholder: "Buscar",
            infoEmpty: "Mostrando 0 de 0 de 0 entradas",
            paginate: {
                previous: "Anterior",
                next: "Siguiente"
            },
            lengthMenu: '<div id="custom">' +
                'Mostrar <select style="' +
                "padding:5px;" +
                '">' +
                '<option value="5">5</option>' +
                '<option value="10">10</option>' +
                '<option value="20">20</option>' +
                '<option value="30">30</option>' +
                '<option value="40">40</option>' +
                '<option value="50">50</option>' +
                '<option value="-1">All</option>' +
                "</select> Registros" +
                "</div>"
        }
    });
});

//--------------------- Funciones de traspaso de Polizas -----------------------------

function llenaTabla(obj) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].codtTrapagoPen == "S") {
            var poliza = obj[i].numPoliza;
            var row = "<tr id='lista" + i +
                "' onclick='getDataTable(this)' " +
                ");' >" +
                "<td _ngcontent-imu-c1 class='tdBorder p'>" + obj[i].numPoliza + "</td>" +
                "<td _ngcontent-imu-c1 class='tdBorder f'>" + obj[i].fecTraspaso + "</td>" +
                "<td _ngcontent-imu-c1 class='tdBorder m'>" + obj[i].mtoPriRec + "</td>" +
                "</tr>";
            $("#traspasotablaNeg tbody").append(row);
        }

        if (obj[i].codtTrapagoPen == "N") {
            var row = "<tr id='lista" + i +
                "' onclick='getDataTable(this)' " +
                ");' >" +
                "<td _ngcontent-imu-c1 class='tdBorder p'>" + obj[i].numPoliza + "</td>" +
                "<td _ngcontent-imu-c1 class='tdBorder f'>" + obj[i].fecTraspaso + "</td>" +
                "<td _ngcontent-imu-c1 class='tdBorder m'>" + obj[i].mtoPriRec + "</td>" +
                "</tr>";
            $("#traspasotabla tbody").append(row);
        }
    }
}

function pasarDerecha() {
    var idObj = document.getElementById("idTr").value;
    var poliId = document.getElementById("polizaId").value;
    var fechtras = document.getElementById("fecTras").value;
    var montras = document.getElementById("monTras").value;
    if (idObj != "") {
        $("#" + idObj + "").remove();
        var row = "<tr id='" + idObj + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + poliId + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + fechtras + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + montras + "</td>" +
            "</tr>";
        $("#traspasotablaNeg tbody").append(row);
        limpiar();
    }

    var oTable = document.getElementById('traspasotablaNeg');
    var rowLength = oTable.rows.length;
    var list = [];
    for (i = 1; i < rowLength; i++) {
        var oCells = oTable.rows.item(i).cells;

        var idp = oTable.rows[i].id;
        var poliIdp = oCells.item(0).innerHTML;
        var fechtrasp = oCells.item(1).innerHTML;
        var montrasp = oCells.item(2).innerHTML;

        var object1 = {
            idlista: idp,
            polizalista: poliIdp,
            fechalista: fechtrasp,
            mostolista: montrasp
        };

        list.push(object1);
        list.sort(function(a, b) { return a.polizalista - b.polizalista });
    }
    $("#traspasotablaNeg tbody tr").remove();

    for (i = 0; i < list.length; i++) {

        var row = "<tr id='" + list[i].idlista + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + list[i].polizalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + list[i].fechalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + list[i].mostolista + "</td>" +
            "</tr>";
        $("#traspasotablaNeg tbody").append(row);
    }
}

function pasarIzquierda() {
    var idObj = document.getElementById("idTr").value;
    var poliId = document.getElementById("polizaId").value;
    var fechtras = document.getElementById("fecTras").value;
    var montras = document.getElementById("monTras").value;
    if (idObj != "") {
        $("#" + idObj + "").remove();
        var row = "<tr id='" + idObj + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + poliId + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + fechtras + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + montras + "</td>" +
            "</tr>";
        $("#traspasotabla tbody").append(row);
        limpiar();
    }

    var oTable = document.getElementById('traspasotabla');
    var rowLength = oTable.rows.length;
    var list = [];
    for (i = 1; i < rowLength; i++) {
        var oCells = oTable.rows.item(i).cells;

        var idp = oTable.rows[i].id;
        var poliIdp = oCells.item(0).innerHTML;
        var fechtrasp = oCells.item(1).innerHTML;
        var montrasp = oCells.item(2).innerHTML;

        var object1 = {
            idlista: idp,
            polizalista: poliIdp,
            fechalista: fechtrasp,
            mostolista: montrasp
        };

        list.push(object1);
        list.sort(function(a, b) { return a.polizalista - b.polizalista });
    }
    $("#traspasotabla tbody tr").remove();

    for (i = 0; i < list.length; i++) {

        var row = "<tr id='" + list[i].idlista + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + list[i].polizalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + list[i].fechalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + list[i].mostolista + "</td>" +
            "</tr>";
        $("#traspasotabla tbody").append(row);
    }
}

function pasarTodosDerecha() {
    $("#traspasotablaNeg tbody tr").removeClass('active');
    var oTable = document.getElementById('traspasotabla');
    var rowLength = oTable.rows.length;
    for (i = 1; i < rowLength; i++) {
        var oCells = oTable.rows.item(i).cells;
        var id = oTable.rows[i].id;
        var poliId = oCells.item(0).innerHTML;
        var fechtras = oCells.item(1).innerHTML;
        var montras = oCells.item(2).innerHTML;

        var row = "<tr id='" + id + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + poliId + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + fechtras + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + montras + "</td>" +
            "</tr>";
        $("#traspasotablaNeg tbody").append(row);
    }
    $("#traspasotabla tbody tr").remove();

    var oTable = document.getElementById('traspasotablaNeg');
    var rowLength = oTable.rows.length;
    var list = [];
    for (i = 1; i < rowLength; i++) {
        var oCells = oTable.rows.item(i).cells;

        var idp = oTable.rows[i].id;
        var poliIdp = oCells.item(0).innerHTML;
        var fechtrasp = oCells.item(1).innerHTML;
        var montrasp = oCells.item(2).innerHTML;

        var object1 = {
            idlista: idp,
            polizalista: poliIdp,
            fechalista: fechtrasp,
            mostolista: montrasp
        };

        list.push(object1);
        list.sort(function(a, b) { return a.polizalista - b.polizalista });
    }
    $("#traspasotablaNeg tbody tr").remove();

    for (i = 0; i < list.length; i++) {

        var row = "<tr id='" + list[i].idlista + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + list[i].polizalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + list[i].fechalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + list[i].mostolista + "</td>" +
            "</tr>";
        $("#traspasotablaNeg tbody").append(row);
    }
}

function pasarTodosIzquierda() {
    $("#traspasotabla tbody tr").removeClass('active');
    var oTable = document.getElementById('traspasotablaNeg');
    var rowLength = oTable.rows.length;
    for (i = 1; i < rowLength; i++) {
        var oCells = oTable.rows.item(i).cells;
        var id = oTable.rows[i].id;
        var poliId = oCells.item(0).innerHTML;
        var fechtras = oCells.item(1).innerHTML;
        var montras = oCells.item(2).innerHTML;

        var row = "<tr id='" + id + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + poliId + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + fechtras + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + montras + "</td>" +
            "</tr>";
        $("#traspasotabla tbody").append(row);
    }
    $("#traspasotablaNeg tbody tr").remove();

    var oTable = document.getElementById('traspasotabla');
    var rowLength = oTable.rows.length;
    var list = [];
    for (i = 1; i < rowLength; i++) {
        var oCells = oTable.rows.item(i).cells;

        var idp = oTable.rows[i].id;
        var poliIdp = oCells.item(0).innerHTML;
        var fechtrasp = oCells.item(1).innerHTML;
        var montrasp = oCells.item(2).innerHTML;

        var object1 = {
            idlista: idp,
            polizalista: poliIdp,
            fechalista: fechtrasp,
            mostolista: montrasp
        };

        list.push(object1);
        list.sort(function(a, b) { return a.polizalista - b.polizalista });
    }
    $("#traspasotabla tbody tr").remove();

    for (i = 0; i < list.length; i++) {

        var row = "<tr id='" + list[i].idlista + "' onclick='getDataTable(this)' >" +
            "<td _ngcontent-imu-c1 class='tdBorder p'>" + list[i].polizalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder f'>" + list[i].fechalista + "</td>" +
            "<td _ngcontent-imu-c1 class='tdBorder m'>" + list[i].mostolista + "</td>" +
            "</tr>";
        $("#traspasotabla tbody").append(row);
    }
}


function validate() {
    var nombre = document.getElementById("idTr").value;
    if (nombre == '') {
        return false;
    }
    return true;
}

function validateAllIzq() {
    var oTable = document.getElementById('traspasotabla');
    var rowLength = oTable.rows.length;
    if (rowLength <= 1) {
        return false;
    }
    return true;
}

function validateAllDer() {
    var oTable = document.getElementById('traspasotablaNeg');
    var rowLength = oTable.rows.length;
    if (rowLength <= 1) {
        return false;
    }
    return true;
}

function limpiar() {
    document.getElementById("idTr").value = "";
    document.getElementById("polizaId").value = "";
    document.getElementById("fecTras").value = "";
    document.getElementById("monTras").value = "";
}

function deleteTable() {
    $("#traspasotabla tbody tr").remove();
    $("#traspasotablaNeg tbody tr").remove();
    limpiar();
}
//---------------------Termina Funciones de traspaso de Polizas -----------------------------



//--------------------- Funciones de consulta de Polizas traspasadas ------------------------

function limpiarTablaConsulta() {
    document.getElementById("fechaDesde").value = "";
    document.getElementById("fechaHasta").value = "";
}

function Mandardatos() {
    var oTable = document.getElementById('traspasotablaNeg');
    var rowLength = oTable.rows.length;
    var list = [];
    for (i = 1; i < rowLength; i++) {
        var oCells = oTable.rows.item(i).cells;
        var a = oCells.item(0).innerHTML;
        var b = oCells.item(1).innerHTML;
        var c = oCells.item(2).innerHTML;

        const object1 = {
            codtTrapagoPen: 'N',
            numPoliza: a,
            fecTraspaso: b,
            mtoPriRec: c
        };
        list.push(object1);
    }
    return list;
}

//--------------------- Funciones de consulta de Tutores Apoderados ------------------------

function llenaTablatblTutoresApoderados(obj) {
    var t = $('#tblTutoresApoderados').DataTable();
    t.clear().draw();
    for (var i = 0; i < obj.length; i++) {
        var rowNode = t.row.add([
            (i + 1),
            obj[i].NumPoliza,
            obj[i].NombreCompleto,
            obj[i].Fecha,
            '<a href="/mantenedorTutoresApoderados/' + obj[i].NumPoliza + '"><i style="color:#0090B2" class="fa fa-search exclam"></i></a>'
        ]).draw(false).node();
        $(rowNode).find('td').eq(0).addClass('t-m');
        $(rowNode).find('td').eq(1).addClass('t-m');
        $(rowNode).find('td').eq(2).addClass('t-m');
        $(rowNode).find('td').eq(3).addClass('t-m');
        $(rowNode).find('td').eq(4).addClass('t-m');
    }
}

//--------------------- Funciones de consulta de Poliza de Antecedentes Pensionados ------------------------

function llenaTablatblAntecedemtePensionado(obj) {
    var t = $('#tblAntecedentesPensionado').DataTable();
    t.clear().draw();
    for (var i = 0; i < obj.length; i++) {
        var rowNode = t.row.add([
            (i + 1),
            obj[i].NumPoliza,
            obj[i].NumEndoso,
            obj[i].NombreCompleto,
            obj[i].Fecha,
            '<a href="/mantencionAntecedentesPensionado/' + obj[i].NumPoliza + '"><i style="color:#0090B2" class="fa fa-search exclam"></i></a>'
        ]).draw(false).node();
        $(rowNode).find('td').eq(0).addClass('t-m');
        $(rowNode).find('td').eq(1).addClass('t-m');
        $(rowNode).find('td').eq(2).addClass('t-m');
        $(rowNode).find('td').eq(3).addClass('t-m');
        $(rowNode).find('td').eq(4).addClass('t-m');
        $(rowNode).find('td').eq(5).addClass('t-m');
    }
}