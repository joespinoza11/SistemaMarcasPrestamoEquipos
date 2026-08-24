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
    item.ele("dispositivo").txt(valorSeguro(marca.dispositivo)).up();
    item.ele("ip").txt(valorSeguro(marca.ip)).up();
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

    const columnas = [
      { titulo: "Usuario", ancho: 150 },
      { titulo: "Departamento", ancho: 120 },
      { titulo: "Fecha", ancho: 75 },
      { titulo: "Entrada", ancho: 60 },
      { titulo: "Salida", ancho: 60 },
      { titulo: "Dispositivo", ancho: 110 },
      { titulo: "IP", ancho: 95 },
    ];

    const inicioX = 40;
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

    for (const marca of marcas) {
      if (y > 520) {
        documento.addPage({ size: "LETTER", margin: 40, layout: "landscape" });
        y = 40;
        dibujarEncabezado();
      }

      const fila = [
        valorSeguro(marca.usuario),
        valorSeguro(marca.departamento),
        valorSeguro(marca.fecha),
        valorSeguro(marca.hora_entrada) || "-",
        valorSeguro(marca.hora_salida) || "-",
        valorSeguro(marca.dispositivo) || "-",
        valorSeguro(marca.ip),
      ];

      let x = inicioX;
      documento.fontSize(8);

      for (let i = 0; i < columnas.length; i++) {
        documento.text(fila[i], x, y, { width: columnas[i].ancho });
        x = x + columnas[i].ancho;
      }

      y = y + 16;
    }

    documento.moveDown(2);
    documento.fontSize(9).text(`Total de registros: ${marcas.length}`, inicioX, y + 10);

    documento.end();
  });
}
