import React, { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  FiZoomIn,
  FiZoomOut,
  FiRefreshCcw,
  FiDownload,
} from "react-icons/fi";
import "./viewer.css";

export default function PdfViewer({ src }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [pageWidth, setPageWidth] = useState(900);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateWidth = () =>
      setPageWidth(Math.min(900, window.innerWidth - 80));
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function onDocumentLoadSuccess(doc) {
    setNumPages(doc.numPages);
    setLoading(false);
    pageRefs.current = Array.from({ length: doc.numPages }, () =>
      React.createRef()
    );
  }

  useEffect(() => {
    if (!numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentPage(+entry.target.getAttribute("data-page-number"));
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 }
    );

    pageRefs.current.forEach(
      (ref) => ref.current && observer.observe(ref.current)
    );
    return () => observer.disconnect();
  }, [numPages]);

  const zoomIn = () => setScale((s) => Math.min(3, s + 0.25));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.25));
  const resetZoom = () => setScale(1);

  const goToPage = (n) => {
    const ref = pageRefs.current[n - 1];
    if (ref?.current) ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="pdf-root">
      {/* Top Toolbar */}
      <div className="toolbar">
        <div className="page-status">
          Page <strong>{currentPage}</strong> / {numPages || "—"}
        </div>

        <a href={src} download className="btn download">
          <FiDownload size={18} /> Download
        </a>
      </div>

      <div className="viewer-layout">
        {/* Thumbnails Sidebar */}
        <aside className="thumbs">
          {Array.from({ length: numPages || 0 }).map((_, idx) => (
            <div
              key={idx}
              className={`thumb ${currentPage === idx + 1 ? "active" : ""}`}
              onClick={() => goToPage(idx + 1)}
            >
              <Document file={src}>
                <Page pageNumber={idx + 1} width={95} renderText={false} />
              </Document>
            </div>
          ))}
        </aside>

        {/* PDF Pages */}
        <div className="pages" ref={containerRef}>
          <Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from({ length: numPages || 0 }).map((_, idx) => (
              <div
                key={idx}
                className="page-holder"
                data-page-number={idx + 1}
                ref={pageRefs.current[idx]}
              >
                <div className="page-card">
                  <Page
                    pageNumber={idx + 1}
                    width={Math.round(pageWidth * scale)}
                  />
                </div>
              </div>
            ))}
          </Document>

          {loading && <div className="loading-overlay">Loading…</div>}
        </div>
      </div>

      {/* Floating Zoom Controls */}
      <div className="zoom-floating">
        <button className="zoom-btn" onClick={zoomOut}>
          <FiZoomOut />
        </button>
        <button className="zoom-btn" onClick={resetZoom}>
          <FiRefreshCcw />
        </button>
        <button className="zoom-btn" onClick={zoomIn}>
          <FiZoomIn />
        </button>
      </div>
    </div>
  );
}
