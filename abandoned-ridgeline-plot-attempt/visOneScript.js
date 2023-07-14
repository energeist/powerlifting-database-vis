// Leaving this here - I was trying to get this set up as a ridgeline plot but couldn't figure out
// how to properly organize my data to do so.  Dropped this in favour of something simpler to have anything
// to turn in.

async function loadData() {
  let data = await d3.csv('../openpowerlifting.csv');

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

  const currentGender = document.getElementById('gender').value
  const currentLift = document.getElementById('lift').value

  // console.log("currentGender")
  // console.log(currentGender)

  // console.log("currentLift")
  // console.log(currentLift)
  
  let currentData = data.filter(d => d.sex === currentGender)
  
  // console.log("currentData")
  // console.log(currentData)
  
  maleData = data.filter(d => d.sex === 'M');
  femaleData = data.filter(d => d.sex === 'F');
  weightClasses = [...new Set(data.map(d => d.weightClassKg))];
  maleAgeClasses = [...new Set(maleData.map(d => d.ageClass.toString()))];
  maleWeightClasses = [...new Set(maleData.map(d => d.weightClassKg))];
  ageClasses = [...new Set(data.map(d => d.ageClass.toString()))];
  femaleAgeClasses = [...new Set(femaleData.map(d => d.ageClass.toString()))];
  femaleWeightClasses = [...new Set(femaleData.map(d => d.weightClassKg))];
  
  currentData = document.getElementById('gender')
    .addEventListener('change', e => {
      console.log(e.target.value)
      console.log(data.filter(d => d.sex === e.target.value))
      return data.filter(d => d.sex === e.target.value)
    })

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

  maleDataByAge = {}
  femaleDataByAge = {}

  console.log(`men's weight classes: ${maleWeightClasses}`);
  console.log(`men's age classes before sorting: ${maleAgeClasses}`);
  console.log(`women's weight classes: ${femaleWeightClasses}`);
  console.log(`women's age classes: ${femaleAgeClasses}`);
  console.log(`all age classes: ${ageClasses}`);
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
        maleDataByAge[weight][age].avgSquat = (maleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3SquatKg) 
        }, 0) / maleDataByAge[weight][age].length).toFixed(1);
        maleDataByAge[weight][age].avgBench = (maleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3BenchKg) 
        }, 0) / maleDataByAge[weight][age].length).toFixed(1);
        maleDataByAge[weight][age].avgDeadlift = (maleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3DeadliftKg) 
        }, 0) / maleDataByAge[weight][age].length).toFixed(1);
      }
      if (femaleData.filter(d => d.weightClassKg === weight && d.ageClass === age).length > 0) {
        femaleDataByAge[weight][age] = femaleData.filter(d => d.weightClassKg === weight && d.ageClass === age);
        femaleDataByAge[weight][age].maxSquat = d3.max(femaleDataByAge[weight][age].map(d => parseFloat(d.best3SquatKg)));
        femaleDataByAge[weight][age].maxBench = d3.max(femaleDataByAge[weight][age].map(d => parseFloat(d.best3BenchKg)));
        femaleDataByAge[weight][age].maxDeadlift = d3.max(femaleDataByAge[weight][age].map(d => parseFloat(d.best3DeadliftKg)));
        femaleDataByAge[weight][age].avgSquat = (femaleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3SquatKg) 
        }, 0) / femaleDataByAge[weight][age].length).toFixed(1);
        femaleDataByAge[weight][age].avgBench = (femaleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3BenchKg) 
        }, 0) / femaleDataByAge[weight][age].length).toFixed(1);
        femaleDataByAge[weight][age].avgDeadlift = (femaleDataByAge[weight][age].reduce((acc, item) => {
          return acc + parseFloat(item.best3DeadliftKg) 
        }, 0) / femaleDataByAge[weight][age].length).toFixed(1) ;
      }
    });
  })

  console.log('maleDataByAge');
  console.log(maleDataByAge);
  console.log('femaleDataByAge');
  console.log(femaleDataByAge);

  testData = maleDataByAge['82.5'];
  console.log("testData");
  console.log(testData);

  squatMaxArray = []
  squatAvgArray = []
  ageClasses.forEach(age => {
    squatMaxArray.push({'age': age, 'squatMax': parseFloat(testData[age]?.maxSquat) || 0})
    squatAvgArray.push({'age': age, 'squatAvg': parseFloat(testData[age]?.avgSquat) || 0}) 
  })

  console.log(squatMaxArray)
  console.log(squatAvgArray)
  // DRAWING THINGS HERE

  // Define some variables for width and height
  const margin = {top: 250, right: 0, bottom: 20, left:150}
  const width = 800;
  const height = 1000;

  // Set up SVG
  const svg = d3.select('#myDataViz')
    .append('svg')
      .attr('width', width)
      .attr('height', height);

  // Add X axis
  const xScale = d3.scaleBand()
    .domain(squatMaxArray.map(d => d.age))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  svg.append('g')
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));
  
  // create a Y scale for densities 
  const yScale = d3.scaleLinear()
    .domain(d3.extent(squatMaxArray, d => d.squatMax))
    .range([height - margin.bottom, margin.top]);

  const yName = d3.scaleBand()
    .domain([0, ageClasses.length - 1])
    .range([height - margin.bottom, margin.top])
    .paddingInner(1);
  
  svg.append('g')
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yName));

  const stuff = squatMaxArray.map(d => d.squatMax)
  console.log("stuff")
  console.log(stuff)
  // const areagen = d3.area()
  //   .x((d, i) => xScale(i))
  //   .y0(d => yScale(parseFloat(d.squatMax) || 0))
  //   .y1(height - margin.bottom)
  //   .curve(d3.curveBasis)

  // svg
  //   .append('path')
  //   .attr('d', areagen(squatMaxArray))
  //   .attr('stroke-width', 1)
  //   .attr('stroke', 'cornflowerblue')
  //   .attr('fill', 'cornflowerblue')
  //   .attr('opacity', 0.4)

  console.log("testData")
  console.log(testData)

  // Add chart title
  const chartTitle = svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', width / 2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '24px')
    .text('OpenPowerlifting data for raw, tested meets in the USA');
}

loadData();