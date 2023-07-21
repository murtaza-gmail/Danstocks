import {useState, useEffect} from 'react';
import axios from 'axios';
import {Box, Grid, CircularProgress, Stack, MenuItem} from '@mui/material'
import {BaseComponent, Footer, StyledSelect, Loading} from './misc/components';
import {pallete, ghr, gwr, fsr, style} from './misc/style';
import {getRoute, tickFormat, commarize} from './misc/utils';

import SmallSimpleChart from './components/smallSimpleChart'
import IndicatorChart from './components/indicatorChart';
import TopMovers from './components/topMovers';
import SectorBreakdown from './components/sectorBreakdown';
import HomeCalendar from './components/homeCalendar';
import HomeNews from './components/homeNews';

import {homeData} from './mockData'

const data = homeData

function InfoComponent ({info, vw}) {
	return (
		<Grid item xs={11.5} md={5}>
			<Stack 
				direction='row' spacing='0.5vw' 
				justifyContent='space-around' alignItems='flex-start'
				sx={{color: pallete.white, width: 1, height: 1, ...fsr(vw, 0.6, 0.5)}} 
				>
				<Stack direction='column' alignItems= 'center'>
					<Box sx={{color: pallete.lightGrey, ...fsr(vw, 0.5, 0.6)}}>indicator</Box>
					<Box sx={{width: 1, textAlign: 'center'}}>{info.indicator}</Box>
				</Stack>
				<Stack direction='column' alignItems= 'center'>
					<Box sx={{color: pallete.lightGrey, ...fsr(vw, 0.5, 0.6)}}>latest print</Box>
					<Box sx={{width: 1, textAlign: 'center'}}>{info.last}</Box>
				</Stack>
				<Stack direction='column' alignItems= 'center'>
					<Box sx={{color: pallete.lightGrey, ...fsr(vw, 0.5, 0.6)}}>deviation</Box>
					<Box sx={{width: 1, textAlign: 'center'}}>{info.deviation} std</Box>
				</Stack>
				<Stack direction='column' alignItems= 'center'>
					<Box sx={{color: pallete.lightGrey, ...fsr(vw, 0.5, 0.6)}}>signal</Box>
					<Box sx={{width: 1, textAlign: 'center'}}>{info.signal}</Box>
				</Stack>
			</Stack>
		</Grid>
	)};

export default function Home () {
	const [fetched, setFetched] = useState(false);
	const [currentIndicator, setCurrentIndicator] = useState('osc')
	const [data_, setData] = useState({
		charts: {
			info: {
				osc: {indicator: undefined, last: undefined, deviation: undefined, signal: undefined},
				vvix: {indicator: undefined, last: undefined, deviation: undefined, signal: undefined}
			},
			spy: undefined, qqq: undefined, vix: undefined, osc: undefined, vvix: undefined
		},
		news: undefined, movers: undefined, sector: undefined, calendar: undefined
	});
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const [vw, setVw] = useState(window.innerWidth/window.innerHeight>1.3)
	const [vh, setVh] = useState(window.innerWidth)

  function handleResize () {
    setVw(window.innerWidth / window.innerHeight > 1.3);
    setVh(window.innerWidth)
  };
  window.addEventListener("resize", handleResize);

  useEffect(() => {
    const onTouchStart = () => {
      setIsTouchDevice(true);
    };

    window.addEventListener("touchstart", onTouchStart);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

	function fetchData (route) {
		axios.get(getRoute(`get_home_${route}`))
			.then((r) => {
				data[route] = r.data
				setData({...data})
			})
			.catch((e) => console.log(e))
	};

	function fetchAll () {
		fetchData('news')
		fetchData('movers')
		fetchData('sector')
		fetchData('calendar')
		fetchData('charts')
	};

	if (fetched === false) {
		setFetched(true)
		// fetchAll()
	};

	return (
		<BaseComponent route='Home' footer>
		<Grid 
			container justifyContent='center'
			sx={{width: 1}} spacing={'1%'}
			>
			<SmallSimpleChart 
				vw={vw}
				height={ghr(vw, 0.25, 0.28)}
				width={gwr(vw, 0.3, 0.95)}
				title={'S&P 500'}
				data={data.charts.spy}
				isTouchDevice={isTouchDevice}
			/>
			<SmallSimpleChart 
				vw={vw}
				height={ghr(vw, 0.25, 0.28)}
				width={gwr(vw, 0.3, 0.95)}
				data={data.charts.qqq}
				title={'NASDAQ 100'}
				isTouchDevice={isTouchDevice}
			/>
			<SmallSimpleChart 
				vw={vw}
				height={ghr(vw, 0.25, 0.28)}
				width={gwr(vw, 0.3, 0.95)}
				data={data.charts.vix}
				title={'CBOE VIX'}
				isTouchDevice={isTouchDevice}
			/>
			<IndicatorChart 
				vw={vw}
				height={ghr(vw, 0.465, 0.50)}
				width={gwr(vw, 0.5, 0.95)}
				data={data.charts[currentIndicator]}
				index={data.charts.spy}
				title='S&P500 SENTIMENT OSCILLATOR'
				isTouchDevice={isTouchDevice}
				infoComponent={<InfoComponent vw={vw} info={data.charts.info[currentIndicator]}/>}
			/>
			<TopMovers 
				data={data.movers} vw={vw}
				height={ghr(vw, 0.55, 0.55)}
				width={gwr(vw, 0.2, 0.46)}
			/>
			<SectorBreakdown 
				data={data.sector} vw={vw}
				height={ghr(vw, 0.55, 0.55)}
				width={gwr(vw, 0.2, 0.46)}
			/>
			<HomeCalendar 
				data={data.calendar} vw={vw}
				height={ghr(vw, 0.52, 0.25)}
				width={gwr(vw, 0.305, 0.95)}
			/>
			<HomeNews
				data={data.news} vw={vw}
				height={ghr(vw, 0.60, 0.5)}
				width={gwr(vw, 0.605, 0.95)}
			/>
		</Grid>
		</BaseComponent>
	)
}