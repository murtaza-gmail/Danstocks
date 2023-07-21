import {useState, useEffect} from 'react';
import axios from 'axios';
import {Box, Stack} from '@mui/material'
import {useLoaderData, useNavigate} from  "react-router-dom";
import {BaseComponent, PopUpWrapper} from './misc/components';
import {getRoute} from './misc/utils';
import {style} from './misc/style';

import StockFinancials from './SingleEquity/stockFinancials';
import StockOverview from './SingleEquity/stockOverview';
import StockChart from './SingleEquity/stockChart';
import {singleEquityData} from './mockData';

const data = singleEquityData

function ModeSelector ({vw, mode, setMode}) {
	const navigate = useNavigate()
	return (
		<Stack direction='row' sx={{color: '#ffffff', fontSize: vw?('1.2vw'):('2.5vw')}} spacing={vw?('1vw'):('1.5vw')}>
			<Box onClick={() => setMode('OVERVIEW')} sx={{borderBottom: mode==='OVERVIEW'?(2):(0), borderColor: style.defaults.accentLight, '&:hover': {borderBottom: 2, borderColor: style.defaults.fontcolor}}} >Overview</Box>
			<Box onClick={() => setMode('CHART')} sx={{borderBottom: mode==='CHART'?(2):(0), borderColor: style.defaults.accentLight, '&:hover': {borderBottom: 2, borderColor: style.defaults.fontcolor}}} >Chart</Box>
			<Box onClick={() => setMode('FINANCIALS')} sx={{borderBottom: mode==='FINANCIALS'?(2):(0), borderColor: style.defaults.accentLight, '&:hover': {borderBottom: 2, borderColor: style.defaults.fontcolor}}} >Financials</Box>
		</Stack>
	)
}

export default function SingleEquity () {
	const navigate = useNavigate()
	let loaderData = useLoaderData();
	let mode = loaderData.view.toUpperCase()

	if (mode !== 'CHART' && mode !== 'OVERVIEW' && mode !== 'FINANCIALS') {
		mode = 'OVERVIEW'
	}

	const [fetched, setFetched]       = useState(false);
	const [data_, setData]             = useState({
		chart: {stock: undefined, indicators: undefined},
		stats: undefined,
		news: undefined,
		description: undefined,
		quote: undefined,
		financials: undefined
	});
	const [popup, setPopup]           = useState('');
	const [indicators, setIndicators] = useState([
		{type: 'sma', period: 20, color: 'yellow', hidden: false}
	]);
	const [vw, setVw] = useState(window.innerWidth/window.innerHeight>1.3);
	const [ticker, setTicker] = useState(loaderData.ticker)

	console.log(data)

	function handleResize () {
		setVw(window.innerWidth / window.innerHeight > 1.3);
	};

	window.addEventListener("resize", handleResize);

	function changeTicker (ticker) {
		setData({
			chart: {stock: undefined, indicators: undefined},
			stats: undefined,
			news: undefined,
			description: undefined,
			quote: undefined,
			financials: undefined
		})
		navigate(`/stock/${ticker}/OVERVIEW`)
		setTicker(ticker)
		setFetched(false)
	}

	function indicatorHandler(operation, args){

		if (operation === 'add'){
			indicators.push({type: 'sma', period: 20, color: 'yellow', hidden: false})
			setIndicators([...indicators])

		} else if (operation === 'remove'){
			indicators.splice(args.idx, 1)
			setIndicators([...indicators])

		} else if (operation === 'update'){
			if (args.field === 'period'){
				indicators[args.idx][args.field] = Number(args.value)
			} else {
				indicators[args.idx][args.field] = args.value
			}
			setIndicators([...indicators])

		}
	};

	function fetchData (route) {
		let body = {ticker: ticker.toLowerCase()}

		if (route === 'chart'){
			body.timeframe = 1080
			body.indicators = indicators
		}

		axios.post(getRoute(`get_stock_${route}`), body)
			.then((r) => {
				data[route] = r.data.data
				setData({...data})
			})
			.catch((e) => {console.log(e)})		
	};

	function fetchAll () {
		fetchData('chart')
		fetchData('stats')
		fetchData('news')
		fetchData('description')
		fetchData('quote')
		fetchData('financials')
	};

	function setMode(v) {
		navigate(`/stock/${ticker}/${v}`)
	}

	if (fetched === false) {
		setFetched(true)
		// fetchAll()
	};

	return (
		<BaseComponent route='Single Equity' footer changeTicker={changeTicker}
			slotComponentTwo={<ModeSelector vw={vw} mode={mode} setMode={setMode}/>}
			>
			<Box sx={{width: 1, display: 'flex', justifyContent: 'center', pt: '0.5vh', pb: '0.5vh', bgcolor: style.defaults.foreground}}>
				<Stack direction='row' alignItems='center' spacing='5%' sx={{width: '90%', color: style.defaults.fontcolor}}>
					<Box onClick={() => setMode("OVERVIEW")} sx={{textDecoration: mode==="OVERVIEW"?('underline'):(null), textDecorationColor: style.defaults.accentLight, p: '5px', '&:hover': {textDecoration: 'underline', cursor: 'pointer', textDecorationColor: style.defaults.accentLight}}}>Overview</Box>
					<Box onClick={() => setMode("CHART")} sx={{textDecoration: mode==="CHART"?('underline'):(null), textDecorationColor: style.defaults.accentLight, p: '5px', '&:hover': {textDecoration: 'underline', cursor: 'pointer', textDecorationColor: style.defaults.accentLight}}}>Chart</Box>
					<Box onClick={() => setMode("FINANCIALS")} sx={{textDecoration: mode==="FINANCIALS"?('underline'):(null), textDecorationColor: style.defaults.accentLight, p: '5px', '&:hover': {textDecoration: 'underline', cursor: 'pointer', textDecorationColor: style.defaults.accentLight}}}>Financials</Box>
				</Stack>
			</Box>
			<StockFinancials 
				data={data.financials} 
				mode={mode} 
				setMode={setMode}
			/>
			<StockChart 
				setPopup={setPopup}
				mode={mode}
				data={data.chart}
				stats={data.stats}
				quote={data.quote}
				ticker={ticker}
			/>
			<StockOverview 
				setMode={setMode} 
				mode={mode} 
				ticker={ticker}
				stats={data.stats} 
				description={data.description}
				quote={data.quote} 
				chart={data.chart} 
				news={data.news}
			/>
		</BaseComponent>
	)
}