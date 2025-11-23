import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PdfPreviewPage.css";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfPreviewPage = () => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const pdfUrl = "/sample.pdf"; // path in public folder

  return (
    <div className="pdf-container">
      <h1>PDF Preview</h1>

      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>

      <a href={pdfUrl} download="sample.pdf">
        <button className="download-btn">Download PDF</button>
      </a>
    </div>
  );
};

export default PdfPreviewPage;
