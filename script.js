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
            for (const indicador of nivel.indicadores_logro) {
              const row = document.createElement("tr");
              const areaCell = document.createElement("td");
              const competenciaCell = document.createElement("td");
              const etapaCell = document.createElement("td");
              const nivelCell = document.createElement("td");
              const indicadorCell = document.createElement("td");
              const desempenoCell = document.createElement("td");


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

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = texto;
  // modalBody.innerHTML = texto + modalBody.innerHTML ;

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



