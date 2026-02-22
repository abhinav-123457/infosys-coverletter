import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";

export async function exportToPDF(content: string, filename: string = "cover-letter.pdf") {
  const doc = new jsPDF();
  const margins = { top: 25, left: 20, right: 20 };
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margins.left - margins.right;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(content, maxWidth);
  let y = margins.top;

  for (const line of lines) {
    if (y > 275) {
      doc.addPage();
      y = margins.top;
    }
    doc.text(line, margins.left, y);
    y += 6;
  }

  doc.save(filename);
}

export async function exportToDOCX(content: string, filename: string = "cover-letter.docx") {
  const paragraphs = content.split("\n").map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24,
            font: "Calibri",
          }),
        ],
        spacing: { after: 120 },
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
