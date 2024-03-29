// score-parser.js

fetchScores();
setInterval(fetchScores, 60000);

async function fetchScores() {
    // Add a cache buster to the URL to prevent caching
    const cacheBuster = new Date().getTime();
    const response = await fetch('scores.csv?_='+cacheBuster);
    if (!response.ok) {
        console.error("Failed to fetch scores:", response.statusText);
        return;
    }
    const data = await response.text();
    parseCSV(data);
}


function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const teamScores = {};
    let result = '<table class="table">';

    // Generate table headers
    const headers = lines[0].split(',');
    result += '<tr>';
    headers.forEach(header => {
        result += `<th>${header}</th>`;
    });
    result += '</tr>';

    // Generate table rows
    lines.slice(1).forEach(line => {
        const row = line.split(',');
        result += '<tr>';
        row.forEach((cell, cellIndex) => {
            result += `<td>${cell}</td>`;
            // Sum scores for each team
            if (cellIndex > 0) {
                const teamName = headers[cellIndex];
                if (!teamScores[teamName]) {
                    teamScores[teamName] = 0;
                }
                teamScores[teamName] += parseInt(cell, 10);
            }
        });
        result += '</tr>';
    });

    // Append total scores row
    result += '<tr><td>Total</td>';
    headers.slice(1).forEach(header => {
        result += `<td>${teamScores[header] || 0}</td>`;
    });
    result += '</tr>';

    result += '</table>';
    document.getElementById('scores').innerHTML = result;
}

fetchScores();
