import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Grid, Stack, Box, Button, IconButton, Checkbox} from '@mui/material';
import {BaseComponent, StyledButton, StyledTextfield} from './misc/components';
import {Close, Delete, Add, Folder} from '@mui/icons-material';
import {generateAuthConfig, getRoute, formatNegNumber} from './misc/utils';
import {pallete, gwr, ghr, fsr, style} from './misc/style';

import PayoutChart  from './components/payoutChart';
import PieChart from './components/pieChart';
import GainLoss from './components/gainLoss';
import PortStats from './components/portfolioStats';
import PortDivs from './components/portfolioDividends';
import FlexChart from './misc/flexChart';
import {AuthContext} from './AuthContext';

import {portfolioData} from './mockData'

function InfoComponent ({vw, data, title, setMode}) {

	if ( data === undefined || title === undefined) {
		return null
	}

	let slicedData = data
	let latestDate = data[data.length - 1].x
	let absReturn  = data[data.length - 1].close - data[data.length - 2].close
	let pctReturn  = (absReturn/data[data.length - 2].close)*100

	return (
		<Stack 
			direction='row' 
			justifyContent='space-around' 
			alignItems='center'
			spacing={gwr(vw, 0.01, 0.02).width}
			sx={{height: 1, ...fsr(vw, 1, 0.75)}}
			>
			<StyledButton sx={{borderRadius: '0.25vw', border: 0, borderBottom: 1, p: '2%', borderColor: style.defaults.accentLight, '&:hover': {border: 0, bgcolor: style.defaults.hoverSubtle, borderBottom: 1, borderColor: style.defaults.accentLight}}} onClick={() => setMode('portfolios')} title={'Portfolios'}/>
			<Box>{title}</Box>
			<Box>${(data[data.length -1].close).toFixed(2)}</Box>
			<Box 
				sx={{color: absReturn>0?('#00ff00'):('#ff0000')}}
				>
				${formatNegNumber(absReturn.toFixed(2))}
			</Box>
			<Box 
				sx={{color: absReturn>0?('#00ff00'):('#ff0000')}}
				>
				{pctReturn.toFixed(2)}%
			</Box>
		</Stack>
	)};

function Components ({composition, handler, setMode}) {
	const [ticker, setTicker] = useState('')
	const [shares, setShares] = useState('')

	function handleKey (e) {
		if (e.key === 'Enter') {
			handler('add', {ticker: ticker, shares: shares})
		}
	}

	return (
		<Stack
			direction='column' 
			alignItems='center'
			justifyContent='space-between'
			sx={{
				height: '91vh', 
				width: '25vw', 
				position: 'absolute', 
				right: '0vw', 
				bottom: '0vw', 
				'z-index': 6, 
				bgcolor: '#00090088',
				backdropFilter: 'blur(7px)',
				color: style.defaults.fontcolor,
			}}
			>
			<Stack alignItems='center' direction='row' justifyContent='space-between' sx={{height: '7vh', width: 1, bgcolor: style.defaults.foreground}}>
				<IconButton onClick={()=>setMode(false)} sx={{p: '1%', ml: '0.5vw', mr: '0.5vw', '&:hover': {bgcolor: style.defaults.hover}}}>
					<Close sx={{color: style.defaults.error}}/>
				</IconButton>
				<Box></Box>
				<Stack direction='row' alignItems='center' sx={{pl: '0.5vw', pr: '0.5vw'}} spacing='0.5vw'>
					<Folder sx={{fontSize: '1.2rem', color: style.defaults.fontcolor}}/>
					<Box sx={{fontSize: '0.8rem', color: style.defaults.fontcolor}}>Portfolios</Box>
				</Stack>
			</Stack>
			<Stack 
				direction='column' 
				height='70vh' 
				alignItems='center'
				sx={{bgcolor: '#000000a1', width: '90%', height: '70vh'}}
				>
				{composition.map((item, idx) => <Box sx={{width: 1, textAlign: 'center'}}>{item.shares} x {item.ticker}</Box>)}
			</Stack>
			<Stack 
				direction='row' 
				width={'90%'} 
				height='10vh' 
				justifyContent='space-around' 
				alignItems='center'
				>
				<StyledTextfield 
					width={'9vw'}
					value={ticker.toUpperCase()}
					handler={(e) => setTicker(e.target.value)}
					label='ticker'
					id='ticker'

				/>
				<StyledTextfield 
					width={'9vw'}
					value={shares}
					handler={(e) => setShares(Number(e.target.value))}
					label='shares'
					id='shares'
					type='numeric'

				/>
				<IconButton>
					<Add sx={{color: style.defaults.fontcolor}}/>
				</IconButton>
			</Stack>
		</Stack>
		)
}

const data = portfolioData

export default function Portfolio () {
	const {userData, isTokenValid, token, login, logout} = useContext(AuthContext)
	const [vw, setVw]           = useState((window.innerWidth/window.innerHeight)>1);
	const [data_, setData]       = useState({
		chart: undefined,
		stats: undefined,
		dividends: undefined,
		pie: undefined,
		gain: undefined,
		payout: undefined
	});
	const [composition, setComposition] = useState([
		{ticker: 'AAPL', shares: 15}, 
		{ticker: 'AMD', shares: 15}, 
		{ticker: 'XOM', shares: 15}
		])
	const [mode, setMode] = useState(false)
  const [fetched, setFetched] = useState(false);

  console.log(data)

	window.addEventListener("resize", () => {
		let ar = (window.innerWidth/window.innerHeight) > 1.3
		if (ar !== vw){
			setVw(ar)
		}
	});

  useEffect(() => {
    if (!fetched) {
      setFetched(true);
      // fetchData('chart', composition);
      // fetchData('stats', composition);
      // fetchData('dividends', composition);
      // fetchData('pie', composition);
      // fetchData('gain', composition);
      // fetchData('payout', composition);
    }
  }, [fetched, composition]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.keyCode === 27) {
				setMode(false)
			}
		};

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

  function fetchData(route, comp) {
    let body = { comp: comp };
    axios.post(getRoute(`get_portfolio_${route}`), body)
      .then((r) => {
        data[route] = r.data.data;
        setData({ ...data });
      })
      .catch((e) => console.log(e));
  }

	return (
		<BaseComponent 
			forceAuth 
			route='Portfolio' 
			>
			{mode?<Components setMode={setMode} composition={composition}/>:null}
			<Grid 
				container spacing={vw?('1vw'):('3vw')} 
				alignItems='center' 
				justifyContent='center' 
				sx={{bgcolor: style.defaults.hoverSubtle, pt: '1vw', pb: '1vw'}} 
				>
				<Grid item>
					<FlexChart
						vw={vw} data={data.chart}
						height={ghr(vw, 0.5, 0.4)}
						width={gwr(vw, 0.55, 0.90)}
						infoComponent={
							<InfoComponent 
								setMode={setMode} 
								vw={vw} 
								title={'portfolio title'}
								data={data.chart}
							/>
						}
					/>
				</Grid>
				<Grid item>
					<Stack direction='column' justifyContent='center' alignItems='center' spacing={vw?('1vw'):('3vw')}>
						<PortStats 
							vw={vw} data={data.stats}
							height={ghr(vw, 0.12, 0.15)}
							width={gwr(vw, 0.27, 0.90)}
						/>
						<PortDivs 
							vw={vw} data={data.dividends}
							height={ghr(vw, 0.27, 0.30)}
							width={gwr(vw, 0.27, 0.90)}
						/>
					</Stack>
				</Grid>
				<PieChart
					vw={vw} data={data.pie}
					height={ghr(vw, 0.26, 0.20)}
					width={gwr(vw, 0.27, 0.90)}
				/>
				<GainLoss 
					vw={vw} data={data.gain}
					height={ghr(vw, 0.26, 0.20)}
					width={gwr(vw, 0.27, 0.90)}
				/>
				<PayoutChart 
					vw={vw} data={data.payout}
					height={ghr(vw, 0.26, 0.20)}
					width={gwr(vw, 0.27, 0.90)}
				/>
			</Grid>
		</BaseComponent>
	)
}