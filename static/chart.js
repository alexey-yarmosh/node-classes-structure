fetch("data/data-with-comments.json")
.then(response => {
  return response.json();
})
.then(jsondata => drawChart(jsondata));

function drawChart(data) {
  const ch = JSC.chart('chartDiv', {
    type: 'organization right',
    defaultTooltip: {
      outline: 'none',
      asHTML: true
    },
    legend_visible: false,
    series: [
      {
        line_color: '#747c72',
        defaultPoint: {
          label: {
            text: '%name',
            autoWrap: false,
            style: {
              fontSize: 10
            }
          },
          annotation: {
            padding: 9,
            corners: ['cut', 'square', 'cut', 'square'],
            margin: [10, 0, 10, 0]
          },
          outline: { color: '#73bc6e', width: 1 },
          color: '#dcead7',
          // tooltip: '<b>%name</b><br/>%description'
          tooltip: '<div class="tooltip-box"><b>%name</b><br/>%description</div>'
        },
        points: data
      }
    ]
  });
}
