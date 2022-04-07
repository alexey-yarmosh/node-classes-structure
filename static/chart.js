fetch("../data/data-v2-with-comments.json")
.then(response => {
  return response.json();
})
.then(jsondata => drawChart(jsondata));

function drawChart(data) {
  JSC.chart('chartDiv', {
    type: 'organization right',
    legend_visible: false,
    series: [
      {
        line_color: '#747c72',
        defaultPoint: {
          label: {
            text: '%name',
            autoWrap: false
          },
          annotation: {
            padding: 9,
            corners: ['cut', 'square', 'cut', 'square'],
            margin: [15, 5, 10, 0]
          },
          outline: { color: '#73bc6e', width: 1 },
          color: '#dcead7',
          tooltip: '<b>%name</b><br/>%description'
        },
        points: data
      }
    ]
  });
}
