import PDFDocument from "pdfkit";
import { create } from "xmlbuilder2";

function valorSeguro(dato) {
  if (dato === null || dato === undefined) {
    return "";
  }
  return String(dato);
}

export function generarXml(marcas) {
  const documento = create({ version: "1.0", encoding: "UTF-8" }).ele("reporteMarcas");

  documento.ele("generadoEn").txt(new Date().toISOString()).up();
  documento.ele("totalRegistros").txt(String(marcas.length)).up();

  const lista = documento.ele("marcas");

  for (const marca of marcas) {
    const item = lista.ele("marca");
    item.ele("usuario").txt(valorSeguro(marca.usuario)).up();
    item.ele("departamento").txt(valorSeguro(marca.departamento)).up();
    item.ele("fecha").txt(valorSeguro(marca.fecha)).up();
    item.ele("horaEntrada").txt(valorSeguro(marca.hora_entrada)).up();
    item.ele("horaSalida").txt(valorSeguro(marca.hora_salida)).up();
    item.ele("dispositivoEntrada").txt(valorSeguro(marca.dispositivo_entrada)).up();
    item.ele("dispositivoSalida").txt(valorSeguro(marca.dispositivo_salida)).up();
    item.ele("ipEntrada").txt(valorSeguro(marca.ip_entrada)).up();
    item.ele("ipSalida").txt(valorSeguro(marca.ip_salida)).up();
    item.up();
  }

  return documento.end({ prettyPrint: true });
}

export function generarPdf(marcas, institucion) {
  return new Promise((resolve, reject) => {
    const documento = new PDFDocument({ size: "LETTER", margin: 40, layout: "landscape" });
    const partes = [];

    documento.on("data", (parte) => partes.push(parte));
    documento.on("end", () => resolve(Buffer.concat(partes)));
    documento.on("error", (error) => reject(error));

    documento.fontSize(16).text(institucion || "Reporte de Marcas", { align: "center" });
    documento.moveDown(0.3);
    documento.fontSize(12).text("Reporte de marcas de entrada y salida", { align: "center" });
    documento.moveDown(0.3);
    documento
      .fontSize(9)
      .text(`Generado: ${new Date().toLocaleString("es-CR")}`, { align: "center" });
    documento.moveDown(1);

    // Columnas más angostas (usuario, depto, fecha, horas, IP) nunca se envuelven.
    // Solo "Disp. entrada" / "Disp. salida" pueden ocupar 2 líneas, por eso la
    // altura de cada fila se calcula dinámicamente más abajo.
    const columnas = [
      { titulo: "Usuario", campo: "usuario", ancho: 100 },
      { titulo: "Depto.", campo: "departamento", ancho: 80 },
      { titulo: "Fecha", campo: "fecha", ancho: 55 },
      { titulo: "Entrada", campo: "hora_entrada", ancho: 40 },
      { titulo: "Disp. entrada", campo: "dispositivo_entrada", ancho: 100 },
      { titulo: "IP entrada", campo: "ip_entrada", ancho: 60 },
      { titulo: "Salida", campo: "hora_salida", ancho: 40 },
      { titulo: "Disp. salida", campo: "dispositivo_salida", ancho: 100 },
      { titulo: "IP salida", campo: "ip_salida", ancho: 60 },
    ];

    const inicioX = 40;
    const finalY = 520;
    const paddingFila = 6;
    let y = documento.y;

    function dibujarEncabezado() {
      let x = inicioX;
      documento.fontSize(9).fillColor("#000000");

      for (const columna of columnas) {
        documento.text(columna.titulo, x, y, { width: columna.ancho, underline: true });
        x = x + columna.ancho;
      }

      y = y + 18;
    }

    dibujarEncabezado();

    if (marcas.length === 0) {
      documento.fontSize(10).text("No hay registros que coincidan con los filtros aplicados.", inicioX, y);
      documento.end();
      return;
    }

    documento.fontSize(8);

    for (const marca of marcas) {
      const fila = columnas.map((columna) => valorSeguro(marca[columna.campo]) || "-");

      // Altura real que va a ocupar la fila (la celda más alta manda),
      // así ninguna fila se dibuja encima de la siguiente.
      const alturaFila = Math.max(
        ...columnas.map((columna, i) =>
          documento.heightOfString(fila[i], { width: columna.ancho }),
        ),
        12,
      );

      if (y + alturaFila > finalY) {
        documento.addPage({ size: "LETTER", margin: 40, layout: "landscape" });
        y = 40;
        dibujarEncabezado();
        documento.fontSize(8);
      }

      let x = inicioX;

      for (let i = 0; i < columnas.length; i++) {
        documento.text(fila[i], x, y, { width: columnas[i].ancho });
        x = x + columnas[i].ancho;
      }

      y = y + alturaFila + paddingFila;
    }

    documento.moveDown(2);
    documento.fontSize(9).text(`Total de registros: ${marcas.length}`, inicioX, y + 10);

    documento.end();
  });
}