// Cargar el archivo YAML
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    const data = jsyaml.load(this.responseText).marco_referencia_competencia_digital_docente;
    const tableBody = document.querySelector("#table-body");

	// Inicializar los valores de las celdas anteriores
	let lastAreaCell, lastCompetenciaCell, lastEtapaCell, lastNivelCell, lastDesempenoCell;

    // Recorrer los datos y crear las filas de la tabla
    for (const area of data) {
      for (const competencia of area.competencias) {
        for (const etapa of competencia.etapas) {
          for (const nivel of etapa.niveles) {

            // Con esto podemos filtrar por nivel (TODO)
            // if (nivel.nivel === "B1" || nivel.nivel === "B2" || nivel.nivel === "C1" || nivel.nivel === "C2")
            //   continue;

            for (const indicador of nivel.indicadores_logro) {
              const row = document.createElement("tr");
              const areaCell = document.createElement("td");
              const competenciaCell = document.createElement("td");
              const etapaCell = document.createElement("td");
              const nivelCell = document.createElement("td");
              const indicadorCell = document.createElement("td");
              const desempenoCell = document.createElement("td");

              etapaCell.classList.add('d-none');
              etapaCell.classList.add('d-md-table-cell');
              desempenoCell.classList.add('d-none');
              desempenoCell.classList.add('d-md-table-cell');


              // Agregamos el color de fondo a la fila dependiendo del área
              row.classList.add(`area${area.area}`);

      				areaCell.innerHTML = `<strong>${area.area}.</strong> ${area.titulo}`;
      				competenciaCell.innerHTML = `<strong>${competencia.competencia}.</strong> ${competencia.titulo}`;
      				etapaCell.innerHTML = `<strong>${etapa.etapa}.</strong> ${etapa.titulo}`;
      				nivelCell.innerHTML = `<strong>${nivel.nivel}.</strong> ${nivel.titulo}`;

              // Mostramos un tooltip por si no es visible el texto de la celda
              areaCell.title = areaCell.innerText;
              competenciaCell.title = competenciaCell.innerText;
              etapaCell.title = etapaCell.innerText;
              nivelCell.title = nivelCell.innerText;

			

      const label = document.createElement('label');
      label.classList.add('form-check-label');
      label.innerHTML = `<strong>${indicador.indicador}.</strong> ${indicador.titulo}`;
      // label.addEventListener('click', toggleCheckbox);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('form-check-input');

      checkbox.setAttribute('data-area', area.area);
      checkbox.setAttribute('data-area-titulo', area.titulo);
      checkbox.setAttribute('data-competencia', competencia.competencia);
      checkbox.setAttribute('data-competencia-titulo', competencia.titulo);
      checkbox.setAttribute('data-etapa', etapa.etapa);
      checkbox.setAttribute('data-etapa-titulo', etapa.titulo);
      checkbox.setAttribute('data-nivel', nivel.nivel);
      checkbox.setAttribute('data-indicador', indicador.indicador);
      checkbox.setAttribute('data-indicador-titulo', indicador.titulo);
      // checkbox.setAttribute('name', `indicador-${indicador.indicador}`);
      checkbox.setAttribute('name', `indicador-${indicador.indicador}-comp-${competencia.competencia}`);
      checkbox.setAttribute('id', `indicador-${indicador.indicador}-comp-${competencia.competencia}`);


      // WIP
      // // Escuchar el evento change en todos los checkboxes
      //   const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      //   checkboxes.forEach(checkbox => {
      //     checkbox.addEventListener('change', () => {
      //       // Desmarcar todos los checkboxes con el mismo número de indicador, la misma competencia y distinto nivel excepto el que ha cambiado
      //       const indicador = checkbox.getAttribute('data-indicador');
      //       const competencia = checkbox.getAttribute('data-competencia');
      //       const checkboxesToUncheck = document.querySelectorAll(`input[name="indicador-${indicador}-comp-${competencia}"]:not(#${checkbox.id})`);
      //       checkboxesToUncheck.forEach(checkboxToUncheck => {
      //         checkboxToUncheck.checked = false;
      //       });
      //     });
      //   });



     // Asignar el evento click al checkbox y al texto del indicador
      label.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
      });
      checkbox.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el evento se propague al elemento padre
      });

      label.prepend(checkbox);
      indicadorCell.append(label);
      indicadorCell.addEventListener('click', toggleCheckbox);
				
				desempenoCell.textContent = nivel.afirmaciones_desempeño;

		  // Comprobar si las celdas anteriores tienen el mismo contenido y fusionarlas
          if (lastAreaCell && lastAreaCell.textContent === areaCell.textContent) {
            lastAreaCell.rowSpan++;
            areaCell.style.display = "none";
          } else {
            // Agregamos el color
            areaCell.classList.add(`area${area.area}`);
            row.classList.add(`area${area.area}`);
            areaCell.setAttribute('data-area', area.area);

            row.appendChild(areaCell);
            lastAreaCell = areaCell;
          }

          if (lastCompetenciaCell && lastCompetenciaCell.textContent === competenciaCell.textContent) {
            lastCompetenciaCell.rowSpan++;
            competenciaCell.style.display = "none";
          } else {
            row.appendChild(competenciaCell);
            lastCompetenciaCell = competenciaCell;
          }

          if (lastEtapaCell && lastEtapaCell.textContent === etapaCell.textContent) {
            lastEtapaCell.rowSpan++;
            etapaCell.style.display = "none";
          } else {
            row.appendChild(etapaCell);
            lastEtapaCell = etapaCell;
          }

          if (lastNivelCell && lastNivelCell.textContent === nivelCell.textContent) {
            lastNivelCell.rowSpan++;
	        nivelCell.style.display = "none";
	      } else {
	        row.appendChild(nivelCell);
	        lastNivelCell = nivelCell;
      	  }

            row.appendChild(indicadorCell);

	          if (lastDesempenoCell && lastDesempenoCell.textContent === desempenoCell.textContent) {
	            lastDesempenoCell.rowSpan++;
		        desempenoCell.style.display = "none";
		        } else {
		        row.appendChild(desempenoCell);
		        lastDesempenoCell = desempenoCell;
	      	  }


              tableBody.appendChild(row);
            }
          }
        }
      }
    }
  }
};

xhr.open("GET", "mrcdd.yml");
xhr.send();


$(function(){
  $("table").resizableColumns();
});

// Habilitar los checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
  });
});

// Mostrar el modal
const modal = document.querySelector('.modal');
const generarBtn = document.querySelector('.btn-generar');
generarBtn.addEventListener('click', () => {
	generarTexto();
  // modal.showModal();
});

// Obtener los checkboxes marcados y generar el texto para el modal
function generarTexto() {


  // Crear un objeto que contenga las áreas, competencias e indicadores seleccionados
  const selectedData = {};

  // Recorrer los checkboxes seleccionados
  const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkedCheckboxes.forEach(checkbox => {
    
    const indicador = checkbox.getAttribute("data-indicador");
    const indicadorData = checkbox.getAttribute("data-indicador-titulo");
    const nivel = checkbox.getAttribute("data-nivel");
    const competencia = checkbox.getAttribute("data-competencia");
    const competenciaData = checkbox.getAttribute("data-competencia-titulo");
    const etapa = checkbox.getAttribute("data-etapa");
    const etapaData = checkbox.getAttribute("data-etapa-titulo");
    const area = checkbox.getAttribute("data-area");
    const areaData = checkbox.getAttribute("data-area-titulo");


    // Agregar el área, competencia y desempeño al objeto
    if (!selectedData.hasOwnProperty(areaData)) {
      selectedData[areaData] = {};
    }
    if (!selectedData[areaData].hasOwnProperty(competenciaData)) {
      selectedData[areaData][competenciaData] = {};
    }

    if (!selectedData[areaData][competenciaData].hasOwnProperty(nivel)) {
      selectedData[areaData][competenciaData][nivel] = [];
    }

    selectedData[areaData][competenciaData][nivel].push({
      area: area,
      areaData: areaData,
      competencia: competencia,
      competenciaData: competenciaData,
      nivel: nivel,
      indicador: indicador,
      indicadorData: indicadorData
    });
  });
  console.log(selectedData);

  // Limpiamos las filas de la tabla resumen (la vamos a ir rellenando ahora)
  $("td.cell-r0").text("");

  // Utilizar el objeto creado para generar el texto deseado
  let texto = '';
  for (const area in selectedData) {
    texto += `<h6>Área de ${area}</h6>`;
    const competencias = selectedData[area];
    texto += `<ul>`
    for (const competencia in competencias) {
      const niveles = competencias[competencia];
      for (const vNivel in niveles){
        const nivel = niveles[vNivel];

        // siempre va haber al menos un nivel seleccionado
        texto += `<li>`;
        texto +=`<span style="font-weight:bold;">${nivel[0].nivel} de la competencia ${nivel[0].competencia}.</span> ${competencia} porque contribuye a trabajar `;

        // Asignamos el valor en la tabla resumen
        $(`.a${nivel[0].area}c${nivel[0].competencia[2]}`).text(vNivel);

        if (nivel.length == 1) {
           texto +=`<span style="font-weight:bold;"> con el indicador ${nivel[0].indicador}.</span> ${nivel[0].indicadorData}.`;
        } else {
          texto +=`<span style="font-weight:bold;"> con los indicadores </span>`;
          var i=0;
          for (const indicador of nivel) {
            const separador = "";
            var ending = "";
            if (i == nivel.length-1){
              texto +=` y `;
              ending = ".";
            } else if (i > 0) { 
              texto +=`; `;
            }

            texto +=`<span style="font-weight:bold;">${indicador.indicador}.</span> ${indicador.indicadorData}${ending}`;
            i+=1;

          }
        }
        }
        texto += `</li>`;
    }
    texto += `</ul>`
  }

  const modalBody = document.querySelector('.resume-text');
  modalBody.innerHTML = texto;

  // concatenamos la tabla resumen (un clon)
  const resumenTable = $("#resumen").clone();
  // modalBody.appendChild(resumenTable);
  $(".resume-table").html(resumenTable);



}

// Marcar/desmarcar el checkbox al hacer clic en el texto del indicador o el checkbox
function toggleCheckbox(event) {
  const td = event.target.closest('td');
  const checkbox = td.querySelector('input[type="checkbox"]');
  const isTextClicked = event.target.matches('label.form-check-label') || event.target.matches('label.form-check-label *');
  if (isTextClicked) {
    checkbox.checked = !checkbox.checked;
  }
}

new ClipboardJS('.btn-primary');

// Muestra el modal si estamos en un movil
document.addEventListener("DOMContentLoaded", function() {
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  if (isMobile) {
    const mobileWarningModal = new bootstrap.Modal(document.getElementById("mobileWarningModal"));
    mobileWarningModal.show();
  }
});


$(document).ready(function() {
    $('#download-button').click(function() {
        html2canvas($('#resumen')[0], {
            scale: 1.5,
            width: $('.resume-table').width(),
            height: $('.resume-table').height()
        }).then(function(canvas) {
            var link = document.createElement('a');
            link.href = canvas.toDataURL("image/png");
            link.download = 'tabla_resume.png';
            link.click();
        });
    });
});

// // Obtener el botón y la tabla que se desea descargar como imagen
// const btnDescargar = document.getElementById("download-button");
// const tabla = document.getElementById("resumen");

// // Asignar la función al botón como controlador de eventos
// btnDescargar.addEventListener("click", function() {

//   // Renderizar la tabla en un canvas utilizando html2canvas
//   html2canvas(tabla).then(canvas => {

//     // Convertir el canvas en un objeto Blob
//     canvas.toBlob(blob => {

//       // Crear un objeto URL a partir del blob
//       const url = window.URL.createObjectURL(blob);

//       // Crear un enlace de descarga para el archivo PNG
//       const link = document.createElement("a");
//       link.download = "miTabla.png";
//       link.href = url;

//       // Hacer clic en el enlace de descarga para descargar el archivo
//       link.click();

//       // Liberar el objeto URL
//       window.URL.revokeObjectURL(url);
//     }, "image/png");
//   });
// });





// $(document).ready(function() {
//   $("#searchInput").on("keyup", function() {
//     const searchTerm = $(this).val().toLowerCase();
//     const table = $("#mrcdd-table");
//     const rows = table.find("tbody tr");

//     rows.each(function() {
//       const row = $(this);
//       const rowText = row.text().toLowerCase();

//       if (rowText.indexOf(searchTerm) === -1) {
//         row.hide();
//         const rowspanCells = row.find("td[rowspan]");
//         rowspanCells.each(function() {
//           const rowspanCell = $(this);
//           const rowspanValue = parseInt(rowspanCell.attr("rowspan"));
//           if (rowspanValue) {
//             rowspanCell.attr("rowspan", rowspanValue - 1);
//             const nextRow = row.next();
//             nextRow.prepend(rowspanCell.clone());
//             rowspanCell.remove();
//           }
//         });
//       } else {
//         row.show();
//         const prevRow = row.prev();
//         const prevRowHidden = prevRow.css("display") === "none";
//         if (prevRowHidden) {
//           const rowspanCells = prevRow.find("td[rowspan]");
//           rowspanCells.each(function() {
//             const rowspanCell = $(this);
//             const rowspanValue = parseInt(rowspanCell.attr("rowspan"));
//             if (rowspanValue) {
//               rowspanCell.attr("rowspan", rowspanValue + 1);
//               row.find("td[rowspan]").first().remove();
//             }
//           });
//         }
//       }
//     });
//   });
// });

//   function filterTable(table) {
//     const rows = table.getElementsByTagName('tr');
//     for (let i = 1; i < rows.length; i++) {
//       const tds = rows[i].getElementsByTagName('td');
//       let visibleCount = 0;
//       for (let j = 0; j < tds.length; j++) {
//         const text = tds[j].textContent.toLowerCase();
//         if (j !== 4 && text.indexOf(filter) === -1) {
//           tds[j].style.display = 'none';
//           if (tds[j].rowSpan > 1) {
//             adjustRowspans(tds[j], -1);
//           }
//         } else {
//           tds[j].style.display = '';
//           visibleCount++;
//         }
//       }
//       if (visibleCount === 1) {
//         rows[i].style.display = 'none';
//       } else {
//         rows[i].style.display = '';
//       }
//     }
//   }

//   function resetTable(table) {
//     const parentNode = table.parentNode;
//     parentNode.replaceChild(originalTable, table);
//     table = originalTable;
//   }

// document.getElementById('filtro').addEventListener('input', function() {
//   const filter = this.value.toLowerCase();
//   const table = document.getElementById('mrcdd-table');
//   const originalTable = table.cloneNode(true);
  
//   function adjustRowspans(td, change) {
//     let current = td;
//     while (current.previousElementSibling) {
//       current = current.previousElementSibling;
//       if (current.rowSpan > 1) {
//         current.rowSpan += change;
//       }
//     }
    
//     current = td;
//     while (current.nextElementSibling) {
//       current = current.nextElementSibling;
//       if (current.rowSpan > 1) {
//         current.rowSpan += change;
//       }
//     }
//   }


  
//   resetTable(table);
//   filterTable(table);
// });

