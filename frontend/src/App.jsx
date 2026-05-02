import { useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [minSamples, setMinSamples] = useState(3);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const fileInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const runClustering = async () => {
    if (!file) {
      alert("Please upload a CSV file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("min_samples", minSamples);

    try {
      const response = await fetch(`${API_BASE_URL}/cluster`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Clustering failed");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!data) {
      alert("Please run clustering first");
      return;
    }

    let csvContent = "x,y,cluster\n";
    for (let i = 0; i < data.x.length; i++) {
      csvContent += `${data.x[i]},${data.y[i]},${data.labels[i]}\n`;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "result.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="app-container">
      <header>
        <h1>OPTICS Clustering Dashboard</h1>
        <div className="menu">
          <button onClick={() => setActiveModal('learn')}>Learn</button>
          <button onClick={() => setActiveModal('dev')}>Developed By</button>
          <button onClick={() => setActiveModal('help')}>Help</button>
          <button onClick={downloadResults}>Download</button>
        </div>
      </header>

      <main className="main-content">
        <div className="panel">
          <h2>Upload Dataset</h2>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
          />

          <label>Min Samples</label>
          <input 
            type="number" 
            value={minSamples} 
            onChange={(e) => setMinSamples(parseInt(e.target.value))}
            min="1"
          />

          <button 
            className="run-btn" 
            onClick={runClustering}
            disabled={loading}
          >
            {loading ? "Processing..." : "Run Clustering"}
          </button>

          <div className="result-box">
            <h3>Clusters Output</h3>
            <p>{data ? data.labels.join(", ") : "Waiting..."}</p>
          </div>
        </div>

        <div className="visual">
          <h2>Visualization</h2>
          <div className="graph-container">
            {data ? (
              <Plot
                data={getPlotData(data)}
                layout={{
                  title: 'Clustering Visualization',
                  paper_bgcolor: '#0a192f',
                  plot_bgcolor: '#0a192f',
                  font: { color: 'white' },
                  xaxis: { gridcolor: "#1f2937", zerolinecolor: "#1f2937" },
                  yaxis: { gridcolor: "#1f2937", zerolinecolor: "#1f2937" },
                  autosize: true,
                  margin: { t: 40, b: 40, l: 40, r: 40 }
                }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                config={{ displayModeBar: true, scrollZoom: true }}
              />
            ) : (
              <div className="graph-placeholder">Run clustering to see visualization</div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'learn' && (
        <Modal title="OPTICS Clustering — Detailed Explanation" onClose={closeModal}>
          <p>OPTICS (Ordering Points To Identify the Clustering Structure) is a density-based clustering algorithm...</p>
          <iframe src="https://www.youtube.com/embed/N3Am3mgVzj4" allowFullScreen title="Explainer Video"></iframe>
        </Modal>
      )}

      {activeModal === 'dev' && (
        <Modal title="Developed By" onClose={closeModal}>
          <div className="cards">
            <div className="card">
              <img src="/assets/your1.jpg" alt="Developer 1" />
              <h3>24BAI1321</h3>
            </div>
            <div className="card">
              <img src="/assets/your2.jpg" alt="Developer 2" />
              <h3>2BYB1169</h3>
            </div>
          </div>
          <h2>Guided By</h2>
          <div className="cards">
            <div className="card">
              <img src="/assets/guide.jpg" alt="Guide" />
              <h3>Guide</h3>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'help' && (
        <Modal title="How to Use" onClose={closeModal}>
          <p>Step 1 — Upload dataset (CSV with x,y columns).</p>
          <p>Step 2 — Enter min_samples value.</p>
          <p>Step 3 — Click Run Clustering.</p>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function getPlotData(data) {
  const uniqueLabels = [...new Set(data.labels)].sort((a, b) => a - b);
  return uniqueLabels.map(label => {
    const xs = [];
    const ys = [];
    data.labels.forEach((l, i) => {
      if (l === label) {
        xs.push(data.x[i]);
        ys.push(data.y[i]);
      }
    });
    return {
      x: xs,
      y: ys,
      mode: 'markers',
      type: 'scatter',
      name: label === -1 ? "Anomaly" : `Cluster ${label}`,
      marker: { size: 10 }
    };
  });
}

export default App;
