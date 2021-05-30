import './App.css';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import { sortData,prettyPrintStat } from './util'
import "leaflet/dist/leaflet.css";



function App() {

  const [countries, setCountries] = useState([])
  const [country,setCountry] = useState("worldwide")
  const [countryInfo,setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796])
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")


  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) =>({
            name : country.country,
            value : country.countryInfo.iso2
          }))

          const sortedData = sortData(data)
          setTableData(sortedData)
          setCountries(countries)
          setMapCountries(data)
        })
      }
    getCountriesData();
  }, [])

  useEffect(() => {
     fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data)
    })
  }, [])

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value
    console.log(countryCode)
  
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((response) => response.json())
    .then(data =>{
      // All the data for that country
      setCountry(countryCode)
      setCountryInfo(data);
      console.log(data)
      setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      setMapZoom(4)
    })
  }
  
  console.log("casestype------->>>>>",casesType)

  return (
    <div className="app">
      <div className="app__left">  
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined"
            value={country}
            onChange={onCountryChange} >

              {/* Loop through list of all the Countries and show drop
              down list of countries */}
              <MenuItem value="worldwide">World Wide</MenuItem>
              {
                countries.map(country =>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }

              {/* <MenuItem value="worldwide">World Wide</MenuItem>
              <MenuItem value="worldwide">Option 2</MenuItem>
              <MenuItem value="worldwide">Option 3</MenuItem>
              <MenuItem value="worldwide">Option 4</MenuItem>  */}
            </Select>
            </FormControl> 
            </div>
            
            {/* Info Boxes*/}
            <div className="app__stats">
              <InfoBox
              isRed
              active={casesType==="cases"} 
              title="Coronavirus Cases" 
              onClick={(e) => setCasesType('cases')} 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)} />
              
              <InfoBox
              active={casesType==="recovered"} 
              title="Recovered" 
              onClick={(e) => setCasesType('recovered')} 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)} />

              <InfoBox 
              isRed
              title="Death"
              active={casesType==="deaths"}
               onClick={(e) => setCasesType('deaths')}
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)} />
            </div>   
          <Map center={mapCenter} zoom={mapZoom} casesType={casesType} countries={mapCountries} /> 
        </div> 
        <Card className="app__right">
          <CardContent>
            <h3>Cases by Country</h3>

            <Table countries={tableData} />
            <h3>World Wide Cases</h3>
            <LineGraph casesType={casesType}/>  
          </CardContent>
        </Card>      
    </div>
  );
}

export default App;
