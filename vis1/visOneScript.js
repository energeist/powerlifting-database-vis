async function loadData() {
  let data = await d3.csv('../openpowerlifting.csv');
  
  // manually defining age/weight class lists because they can't be sorted easily
  ageClasses = [
    '5-12',
    '13-15',
    '16-17',
    '18-19', 
    '20-23', 
    '24-34',
    '35-39',
    '40-44',
    '45-49',
    '50-54',
    '55-59',
    '60-64',
    '65-69',
    '70-74',
    '75-79'
  ]

  maleWeightClasses = [
    '52',
    '56',
    '59',
    '60',
    '66',
    '67.5',
    '74',
    '75',
    '82.5',
    '83',
    '90',
    '93',
    '100',
    '105',
    '120+',
    '125',
    '125+',
    '140',
    '145+',
  ]

  femaleWeightClasses = [
    '44',
    '47',
    '48',
    '52',
    '56',
    '57',
    '60',
    '63',
    '67.5',
    '72',
    '75',
    '82.5',
    '84',
    '84+',
    '90',
    '90+',
    '100+'
  ]

  weightClassSelector = document.getElementById('weightClass')

  maleWeightClasses.forEach(weight => {
    const option = document.createElement('option');
    option.value = weight;
    option.textContent = weight;
    weightClassSelector.appendChild(option);
  })

  let currentWeightClass = weightClassSelector.value;

  console.log(currentWeightClass)

  data = data.filter(d => 
    d.country === "USA" && 
    d.sex &&
    d.equipment === "Raw" && 
    d.division === "Open" && 
    d.tested === "Yes" &&
    d.ageClass &&
    d.best3SquatKg > 0 && 
    d.best3BenchKg > 0 && 
    d.best3DeadliftKg > 0
  );
  
  maleData = data.filter(d => d.sex === 'M');
  femaleData = data.filter(d => d.sex === 'F');
  weightClasses = [...new Set(data.map(d => d.weightClassKg))];
  maleAgeClasses = [...new Set(maleData.map(d => d.ageClass.toString()))];
  femaleAgeClasses = [...new Set(femaleData.map(d => d.ageClass.toString()))];

  maleDataByAge = {}
  femaleDataByAge = {}

  // split data out in to male and female by age and weight, calculate max and average of best-of-3 lifts for squat/bench/deadlift
  weightClasses.forEach(weight => {
    if (maleData.filter(d => d.weightClassKg === weight).length > 0) {
      maleDataByAge[weight] = {};
    }
    if (femaleData.filter(d => d.weightClassKg === weight).length > 0) {
      femaleDataByAge[weight] = {};
    }
    ageClasses.forEach(age => {
      if (maleData.filter(d => d.weightClassKg === weight && d.ageClass === age).length > 0) {
        maleDataByAge[weight][age] = maleData.filter(d => d.weightClassKg === weight && d.ageClass === age);
        maleDataByAge[weight][age].maxSquat = d3.max(maleDataByAge[weight][age].map(d => parseFloat(d.best3SquatKg)));
        maleDataByAge[weight][age].maxBench = d3.max(maleDataByAge[weight][age].map(d => parseFloat(d.best3BenchKg)));
        maleDataByAge[weight][age].maxDeadlift = d3.max(maleDataByAge[weight][age].map(d => parseFloat(d.best3DeadliftKg)));
        maleDataByAge[weight][age].maxTotal = d3.max(maleDataByAge[weight][age].map(d => parseFloat(d.totalKg)));
        maleDataByAge[weight][age].avgSquat = (maleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3SquatKg) 
        }, 0) / maleDataByAge[weight][age].length).toFixed(1);
        maleDataByAge[weight][age].avgBench = (maleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3BenchKg) 
        }, 0) / maleDataByAge[weight][age].length).toFixed(1);
        maleDataByAge[weight][age].avgDeadlift = (maleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3DeadliftKg) 
        }, 0) / maleDataByAge[weight][age].length).toFixed(1);
        maleDataByAge[weight][age].avgTotal = (maleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.totalKg) 
        }, 0) / maleDataByAge[weight][age].length).toFixed(1);
      }
      if (femaleData.filter(d => d.weightClassKg === weight && d.ageClass === age).length > 0) {
        femaleDataByAge[weight][age] = femaleData.filter(d => d.weightClassKg === weight && d.ageClass === age);
        femaleDataByAge[weight][age].maxSquat = d3.max(femaleDataByAge[weight][age].map(d => parseFloat(d.best3SquatKg)));
        femaleDataByAge[weight][age].maxBench = d3.max(femaleDataByAge[weight][age].map(d => parseFloat(d.best3BenchKg)));
        femaleDataByAge[weight][age].maxDeadlift = d3.max(femaleDataByAge[weight][age].map(d => parseFloat(d.best3DeadliftKg)));
        femaleDataByAge[weight][age].maxTotal = d3.max(femaleDataByAge[weight][age].map(d => parseFloat(d.best3DeadliftKg)));
        femaleDataByAge[weight][age].avgSquat = (femaleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3SquatKg) 
        }, 0) / femaleDataByAge[weight][age].length).toFixed(1);
        femaleDataByAge[weight][age].avgBench = (femaleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3BenchKg) 
        }, 0) / femaleDataByAge[weight][age].length).toFixed(1);
        femaleDataByAge[weight][age].avgDeadlift = (femaleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3DeadliftKg) 
        }, 0) / femaleDataByAge[weight][age].length).toFixed(1);
        femaleDataByAge[weight][age].avgTotal = (femaleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.totalKg) 
        }, 0) / femaleDataByAge[weight][age].length).toFixed(1);
      }
    });
  })

  weightClassSelector.addEventListener('change', function(e) {
    console.log(e.target.value)
    currentWeightClass = e.target.value
    renderGraph(currentWeightClass)
  })

  let testData = maleDataByAge[currentWeightClass.toString()];
    console.log("testData");
    console.log(testData);

  renderGraph(weightClassSelector.value)

  function renderGraph(weightClass) {

    console.log("weightclass")
    console.log(weightClass)
    testData = maleDataByAge[weightClass.toString()];
    console.log("testData");
    console.log(testData);

    let squatMaxArray = []
    let squatAvgArray = []
    let benchMaxArray = []
    let benchAvgArray = []
    let deadliftMaxArray = []
    let deadliftAvgArray = []
    let totalMaxArray = []
    let totalAvgArray = []

    ageClasses.forEach(age => {
      squatMaxArray.push({'age': age, 'squatMax': parseFloat(testData[age]?.maxSquat) || 0})
      squatAvgArray.push({'age': age, 'squatAvg': parseFloat(testData[age]?.avgSquat) || 0})
      benchMaxArray.push({'age': age, 'benchMax': parseFloat(testData[age]?.maxBench) || 0})
      benchAvgArray.push({'age': age, 'benchAvg': parseFloat(testData[age]?.avgBench) || 0}) 
      deadliftMaxArray.push({'age': age, 'deadliftMax': parseFloat(testData[age]?.maxDeadlift) || 0})
      deadliftAvgArray.push({'age': age, 'deadliftAvg': parseFloat(testData[age]?.avgDeadlift) || 0})
      totalMaxArray.push({'age': age, 'totalMax': parseFloat(testData[age]?.maxTotal) || 0})
      totalAvgArray.push({'age': age, 'totalAvg': parseFloat(testData[age]?.avgTotal) || 0})  
    })
    // DRAWING THINGS HERE

    // Define some variables for width and height
    const margin = {top: 250, right: 0, bottom: 50, left:150}
    const width = 1500;
    const height = 1000;

    d3.select('svg').remove();

    // Set up SVG
    const svg = d3.select('#myDataViz')
      .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Add X axis
    const xScale = d3.scaleBand()
      .domain(squatMaxArray.map(d => d.age))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    svg.append('g')
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .text('Age Group (years)')
        .style('font-size', '20px')
        .style('font-weight', 'bold')

    // create a Y scale
    const yScale = d3.scaleLinear()
      .domain(d3.extent(totalMaxArray, d => d.totalMax))
      // .domain([0, 810])
      .range([height - margin.bottom, margin.top]);
    
    svg.append('g')
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    svg.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', margin.left / 2)
      .attr('text-anchor', 'middle')
      .text('Weight Lifted (kg)')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
    
    // Max Total Bars
    svg.selectAll('bar')
      .data(totalMaxArray)
      .join('rect')
        .transition()
        .duration(500)
        .ease(d3.easeExpIn)
        .attr('x', d => xScale(d.age))
        .attr('y', d => yScale(d.totalMax))
        .attr('width', xScale.bandwidth()/4 - 3)
        .attr('height', d => d.totalMax === 0 ? 0 : height - yScale(d.totalMax) - margin.bottom)
        .attr('fill', 'red')

    // Avg Total Bars
    svg.selectAll('bar')
      .data(totalAvgArray)
      .join('rect')
        .transition()
        .duration(500)
        .ease(d3.easeExpIn)
        .attr('x', d => xScale(d.age))
        .attr('y', d => yScale(d.totalAvg))
        .attr('width', (xScale.bandwidth()/4 - 3))
        .attr('height', d => d.totalAvg === 0 ? 0 : height - yScale(d.totalAvg) - margin.bottom)
        .attr('fill', 'orange')

    // Max Squat Bars
    svg.selectAll('bar')
      .data(squatMaxArray)
      .join('rect')
        .transition()
        .duration(500)
        .ease(d3.easeExpIn)
        .attr('x', d => xScale(d.age) + xScale.bandwidth()/4)
        .attr('y', d => yScale(d.squatMax))
        .attr('width', xScale.bandwidth()/4 - 3)
        .attr('height', d => d.squatMax === 0 ? 0 : height - yScale(d.squatMax) - margin.bottom)
        .attr('fill', '#1b0dde')

    // Avg Squat Bars
    svg.selectAll('bar')
      .data(squatAvgArray)
      .join('rect')
        .transition()
        .duration(500)
        .ease(d3.easeExpIn)
        .attr('x', d => xScale(d.age) + xScale.bandwidth()/4)
        .attr('y', d => yScale(d.squatAvg))
        .attr('width', xScale.bandwidth()/4 - 3)
        .attr('height', d => d.squatAvg === 0 ? 0 : height - yScale(d.squatAvg) - margin.bottom)
        .attr('fill', '#5e56b3')

    // Max Bench Bars
    svg.selectAll('bar')
      .data(benchMaxArray)
      .join('rect')
        .transition()
        .duration(500)
        .ease(d3.easeExpIn)
        .attr('x', d => xScale(d.age) + 2 * (xScale.bandwidth()/4))
        .attr('y', d => yScale(d.benchMax))
        .attr('width', xScale.bandwidth()/4 - 3)
        .attr('height', d => d.benchMax === 0 ? 0 : height - yScale(d.benchMax) - margin.bottom)
        .attr('fill', '#0b361e')

    // Avg Bench Bars
    svg.selectAll('bar')
      .data(benchAvgArray)
      .join('rect')
        .transition()
        .duration(500)
        .ease(d3.easeExpIn)
        .attr('x', d => xScale(d.age) + 2 * (xScale.bandwidth()/4))
        .attr('y', d => yScale(d.benchAvg))
        .attr('width', xScale.bandwidth()/4 - 3)
        .attr('height', d => d.benchAvg === 0 ? 0 : height - yScale(d.benchAvg) - margin.bottom)
        .attr('fill', '#6a9e81')

    // Max Deadlift Bars
    svg.selectAll('bar')
      .data(deadliftMaxArray)
      .join('rect')
        .transition()
        .duration(500)
        .ease(d3.easeExpIn)
        .attr('x', d => xScale(d.age) + 3 * (xScale.bandwidth()/4))
        .attr('y', d => yScale(d.deadliftMax))
        .attr('width', xScale.bandwidth()/4 - 3)
        .attr('height', d => d.deadliftMax === 0 ? 0 : height - yScale(d.deadliftMax) - margin.bottom)
        .attr('fill', '#960bd6')

      // Avg Deadlift Bars
      svg.selectAll('bar')
        .data(deadliftAvgArray)
        .join('rect')
          .transition()
          .duration(500)
          .ease(d3.easeExpIn)
          .attr('x', d => xScale(d.age) + 3 * (xScale.bandwidth()/4))
          .attr('y', d => yScale(d.deadliftAvg))
          .attr('width', xScale.bandwidth()/4 - 3)
          .attr('height', d => d.deadliftAvg === 0 ? 0 : height - yScale(d.deadliftAvg) - margin.bottom)
          .attr('fill', '#aa6bc7')

    const legendData = [
        { label: 'Max Total', color: 'red' },
        { label: 'Avg Total', color: 'orange' },
        { label: 'Max Squat', color: '#1b0dde' },
        { label: 'Avg Squat', color: '#5e56b3' },
        { label: 'Max Bench', color: '#0b361e' },
        { label: 'Avg Bench', color: '#6a9e81' },
        { label: 'Max Deadlift', color: '#960bd6' },
        { label: 'Avg Deadlift', color: '#aa6bc7' }
      ];

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`);

      const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);
    
    legendItems.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => d.color);
    
    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .text(d => d.label);

    // Add chart title
    const chartTitle = svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .text(`OpenPowerlifting data for men's ${currentWeightClass}kg division in raw, tested meets in the USA`);
  }
}

loadData();