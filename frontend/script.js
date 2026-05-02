/* CLUSTERING WITHOUT BACKEND */
let finalCSV = "";

/* CLUSTERING */
window.runClustering = function(){
    let fileInput = document.querySelector("input[type=file]");
    let file = fileInput.files[0];
    let min_samples = parseInt(document.querySelector("input[type=number]").value);

    if(!file){
        alert("Please upload a CSV file first");
        return;
    }

    let reader = new FileReader();

    reader.onload = function(e){
        let text = e.target.result;
        let rows = text.trim().split("\n");
        
        // Remove header if it exists
        if (rows.length > 0 && isNaN(parseFloat(rows[0].split(",")[0]))) {
            rows = rows.slice(1);
        }

        let x = [];
        let y = [];

        rows.forEach(row=>{
            let values = row.split(",");
            if (values.length >= 2) {
                let valX = parseFloat(values[0]);
                let valY = parseFloat(values[1]);
                if (!isNaN(valX) && !isNaN(valY)) {
                    x.push(valX);
                    y.push(valY);
                }
            }
        });

        if (x.length === 0) {
            alert("No valid numerical data found in CSV. Ensure it has at least two columns with numbers.");
            return;
        }

        let labels = simpleClustering(x, y, min_samples);

        document.querySelector(".result-box p").innerText =
            labels.join(", ");

        drawGraph(x, y, labels);

        finalCSV = "x,y,cluster\n";
        for(let i=0;i<x.length;i++){
            finalCSV += `${x[i]},${y[i]},${labels[i]}\n`;
        }
    };

    reader.readAsText(file);
}

/* SIMPLE DENSITY BASED CLUSTERING (Approximation of OPTICS/DBSCAN) */
function simpleClustering(x, y, min_samples){
    let labels = new Array(x.length).fill(-1);
    let clusterId = 0;
    let eps = 5; // Default epsilon

    for(let i=0;i<x.length;i++){
        if(labels[i] !== -1){
            continue;
        }

        let neighbors = [];
        for(let j=0;j<x.length;j++){
            let distance = Math.sqrt(
                Math.pow(x[i]-x[j],2) + Math.pow(y[i]-y[j],2)
            );

            if(distance <= eps){
                neighbors.push(j);
            }
        }

        if(neighbors.length >= min_samples){
            neighbors.forEach(index=>{
                // If point is already in a cluster, we don't reassign (simplified)
                if (labels[index] === -1) {
                    labels[index] = clusterId;
                }
            });
            clusterId++;
        }
    }

    return labels;
}

/* GRAPH */
function drawGraph(x, y, labels){
    let unique = [...new Set(labels)];
    let traces = [];

    unique.sort((a, b) => a - b).forEach(c=>{
        let xs=[], ys=[];

        for(let i=0;i<labels.length;i++){
            if(labels[i]===c){
                xs.push(x[i]);
                ys.push(y[i]);
            }
        }

        traces.push({
            x: xs,
            y: ys,
            mode: 'markers',
            type: 'scatter',
            name: c===-1 ? "Anomaly" : "Cluster "+c,
            marker:{ size:10 }
        });
    });

    Plotly.newPlot("graph", traces, {
        title:"Clustering Visualization",
        paper_bgcolor:"#0a192f",
        plot_bgcolor:"#0a192f",
        font:{color:"white"},
        xaxis: { gridcolor: "#1f2937", zerolinecolor: "#1f2937" },
        yaxis: { gridcolor: "#1f2937", zerolinecolor: "#1f2937" }
    },{
        displayModeBar:true,
        responsive: true,
        scrollZoom:true
    });
}

/* DOWNLOAD RESULT */
window.downloadFiles = function(){
    if(finalCSV === ""){
        alert("Please run clustering first");
        return;
    }

    let blob = new Blob([finalCSV], {type:"text/csv"});
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "result.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Ensure modals functions are also global
window.openModal = function(id){
    document.getElementById(id).style.display = "block";
}

window.closeModal = function(id){
    document.getElementById(id).style.display = "none";
}