import React from "react";
import PdfViewer from "./components/PdfViewer";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <PdfViewer src="/sample.pdf" />
    </div>
  );
}

export default App;
