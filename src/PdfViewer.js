// src/PdfViewer.js
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState('');

  // Try different paths for the PDF file
  const pdfFile = '/sample.pdf'; // This should work if file is in public folder

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPdfError('');
    console.log('PDF loaded successfully with', numPages, 'pages');
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setPdfError(`Failed to load PDF: ${error.message}. Please check if the file exists at ${pdfFile}`);
  }

  const goToPreviousPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Test if PDF is accessible
  const testPdfAccess = () => {
    fetch(pdfFile)
      .then(response => {
        if (response.ok) {
          console.log('PDF file is accessible at:', pdfFile);
          setPdfError('');
        } else {
          setPdfError(`PDF not found at ${pdfFile}. Status: ${response.status}`);
        }
      })
      .catch(error => {
        setPdfError(`Cannot access PDF: ${error.message}`);
      });
  };

  // Test on component mount
  React.useEffect(() => {
    testPdfAccess();
  }, []);

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-header">
        <h1>PDF Viewer</h1>
        <div>
          <button 
            className="test-btn"
            onClick={testPdfAccess}
            style={{marginRight: '10px', background: '#ffc107', color: 'black'}}
          >
            Test PDF Access
          </button>
          <button 
            className="download-btn"
            onClick={downloadPdf}
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="pdf-error-message">
          <strong>Error:</strong> {pdfError}
          <div style={{marginTop: '10px'}}>
            <strong>Possible solutions:</strong>
            <ul style={{textAlign: 'left', margin: '10px 0'}}>
              <li>Make sure 'sample.pdf' exists in the public folder</li>
              <li>Check the filename (case-sensitive)</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
        </div>
      )}

      <div className="pdf-controls">
        <button 
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
          className="nav-btn"
        >
          ← Previous
        </button>
        
        <span className="page-info">
          Page {pageNumber} of {numPages || '--'}
        </span>
        
        <button 
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="nav-btn"
        >
          Next →
        </button>
      </div>

      <div className="pdf-display">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="pdf-loading">Loading PDF...</div>}
          noData={<div className="pdf-no-data">No PDF file specified</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            width={Math.min(800, window.innerWidth - 40)}
            loading={<div className="page-loading">Loading page {pageNumber}...</div>}
          />
        </Document>
      </div>

      {numPages && (
        <div className="pdf-footer">
          <span>Total pages: {numPages}</span>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;