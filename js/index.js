const ctx = document.querySelector('.js-chart').getContext('2d');
const GLOBAL_MEAN_TEMPERATURE = 14;


fetchData().then(parseData).then(getLabelsAndData).then(({years, temps, nhem, shem}) => drawChart(years, temps, nhem, shem))

async function fetchData() {
    const response = await fetch("./ZonAnn.Ts+dSST.csv");
    const data = await response.text();
    return data;
};

function parseData(data) {
    return Papa.parse(data, { header: true }).data;
};

function getLabelsAndData(data) {
    return data.reduce((acc, entry) => {
        acc.years.push(entry.Year);      
        acc.temps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
        acc.nhem.push(entry.NHem);
        acc.shem.push(entry.SHem);

        return acc;
    }, { years: [], temps: [], nhem: [], shem: [] });
};

function drawChart(labels, data, nhem, shem) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,    
            datasets: [         
            {
                label: ' Средняя глобальная температура',
                data: data,
                backgroundColor: 'rgba(153, 102, 255, 1)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: ' Средняя температура Северного полушария',
                data: nhem,
                backgroundColor: 'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: ' Средняя температура Южного полушария',
                data: shem,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true,
            }
        ]
    },
    options: {
        scales: {
            y: {
                ticks: {
                    callback (value) {
                        return value + "°";
                    }
                }
            }
        }
    }
    });
}