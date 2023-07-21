import {useState} from 'react';
import axios from 'axios';
import {Box, Stack, Button, Grid, MenuItem, IconButton} from '@mui/material';
import {VictoryChart, VictoryAxis, VictoryCandlestick, VictoryPie, VictoryBar} from 'victory';
import CloseIcon from '@mui/icons-material/Close';
import {StyledSelect, StyledTextfield, Loading} from '../misc/components';
import {generateAuthConfig, logout, getRoute} from '../misc/utils';
import {config} from '../config';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';

const options = {year: '2-digit', month: 'short', day: 'numeric'}
const rowStyle = {textAlign: 'center', width: '22%', height: '85%'}

function Row (props) {return (
	<Stack direction='row' justifyContent='center' width={1} alignItems='center'
		sx={{borderBottom: 1, borderColor: style.defaults.accentDark, pb: '0.25vw', mb: '0.25vw'}}
	>
	<Box sx={rowStyle}>{(new Date(props.datum.date)).toLocaleDateString('en-US', options)}</Box>
	<Box sx={rowStyle}>${props.datum.amount_per_share.toFixed(2)}</Box>
	<Box sx={rowStyle}>${props.datum.total.toFixed(2)}</Box>
	<Box sx={rowStyle}>{props.datum.yield.toFixed(2)}%</Box>
		
	</Stack>
	)};

export default function PortDivs ({vw, data, height, width}) {
	const [aggr, setAggr] = useState('e')
	const tickers = data===undefined?([]):(Object.keys(data))
	const [ticker, setTicker] = useState()
	const [flag, setFlag] = useState(false)

	if (data !== undefined && flag === false) {
		setFlag(true)
		setTicker(tickers[0])
	}
	
	return (
	<Stack alignItems='center' direction='column'
		sx={{
			bgcolor: style.defaults.foregroundDark, 
			color: style.defaults.fontcolor,
			...fsr(vw, 0.8, 0.9),
			...width, 
			borderRadius: '0.5vw',
			borderBottom: 1,
			borderColor: style.defaults.accentLight,
			position: 'relative',
			pt: ghr(vw, 0.07, 0.07).height
		}}
		>
		<Stack 
			direction='row'
			alignItems='center' 
			justifyContent='space-around' 
			sx={{
				position: 'absolute',
				width: 1,
				top: '0px',
				left: '0px',
				'z-index': 4,
				pt: '1.5vh', 
				pb: '1.5vh', 
			}}
			>
			<Box>Dividends</Box>
			<StyledSelect
				height={ghr(vw, 0.045, 0.055).height} 
				width={gwr(vw, 0.07, 0.15).width} 
				handler={(e) => setTicker(e.target.value)}
				value={ticker} label='component'
				>
				{tickers.map((t, idx) => 
					<MenuItem value={t} key={'ticker_' + String(idx)}>
						{t.toUpperCase()}
					</MenuItem>
				)}
			</StyledSelect>
			<StyledSelect
				height={ghr(vw, 0.045, 0.055).height} 
				width={gwr(vw, 0.07, 0.15).width} 
				value={'e'} 
				handler={(e) => setAggr(e.target.value)}
				label='aggregation' 
				>
				<MenuItem value={'e'}>Events</MenuItem>
				<MenuItem value={'q'}>Quarterly</MenuItem>
				<MenuItem value={'y'}>Yearly</MenuItem>
			</StyledSelect>
		</Stack>
		<Stack width={'90%'}>
			<Stack 
				direction='row' justifyContent='center' width={1} 
				sx={{...fsr(vw, 0.7, 0.85), color: style.defaults.secondaryFontcolor}}>
				<Box sx={rowStyle}>Date</Box>
				<Box sx={rowStyle}>per share</Box>
				<Box sx={rowStyle}>total</Box>
				<Box sx={rowStyle}>yield</Box>
			</Stack>
			<Stack direction='column' sx={{overflow: 'auto', ...height}}>
				{data&&data[ticker]?(data[ticker].map((item, idx) => 
					<Row key={'DividendRow'+String(idx)} idx={idx} datum={item}/>
				)):(null)}
			</Stack>
		</Stack>
	</Stack>
	)};