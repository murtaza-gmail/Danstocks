import {useState} from 'react';
import axios from 'axios';
import {Box, Stack, Button, Grid, MenuItem, IconButton} from '@mui/material';
import {VictoryChart, VictoryAxis, VictoryBar} from 'victory';
import {StyledSelect, StyledTextfield, Loading} from '../misc/components';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';
import {getYearAndQuarter} from '../misc/utils'

export default function PayoutChart ({vw, data, height, width}) {
	const [mode, setMode] = useState('quarterly_income')
	const tickers = data===undefined?([]):(Object.keys(data[mode]))
	const [ticker, setTicker] = useState('A')
	const [flag, setFlag] = useState(false)

	const chartHeight = Number(height.height.replace('px', ''))*2.5
	const chartWidth = Number(width.width.replace('px', ''))*2.5

	if (data !== undefined && flag === false) {
		setFlag(true)
		setTicker(tickers[0])
	}

	let showing = data===undefined?([]):(data[mode][ticker])

	return (
		<Grid item>
		<Stack 
			direction='column' 
			sx={{
				bgcolor: style.defaults.foregroundDark, 
				...width,
				borderRadius: '0.5vw', 
				borderBottom: 1, 
				borderColor: style.defaults.accentLight,
				position: 'relative',
				...fsr(vw, 0.8, 0.9),
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
				<StyledSelect 
					width={gwr(vw, 0.15, 0.3)}
					height={ghr(vw, 0.05, 0.025)}
					handler={(e) => setMode(e.target.value)} 
					value={mode} 
					label='mode' 
					>
					<MenuItem value='payout'>Payout Ratio</MenuItem>
					<MenuItem value='quarterly_income'>Income: Quarterly</MenuItem>
					<MenuItem value='quarterly_yield'>Yield: Quarterly</MenuItem>
					<MenuItem value='yearly_yield'>Yield: Yearly</MenuItem>
				</StyledSelect>
				<StyledSelect 
					width={gwr(vw, 0.1, 0.2)}
					height={ghr(vw, 0.05, 0.025)}
					value={ticker} 
					handler={(e) => setTicker(e.target.value)} 
					label='ticker' 
					>
					{tickers.map((t, idx) => {return <MenuItem value={t} key={'PayoutTicker_' + String(idx)}>{t.toUpperCase()}</MenuItem>})}
				</StyledSelect>
			</Stack>
			<Box>
			{data===undefined?(
				<Loading sx={{bgcolor: style.defaults.foregroundDark, ...width, ...height, borderRadius: '0.5vw', borderBottom: 1, borderColor: style.defaults.accentLight}}/>
			):(
				<VictoryChart 
					height={chartHeight} 
					width={chartWidth}
					domainPadding={100}
					padding={{left: chartWidth/10, right: chartWidth/40, top: chartWidth/20, bottom: chartWidth/20}}
					>
					<VictoryAxis 
						tickCount={7}
						tickFormat={mode==='payout'?((x) => getYearAndQuarter(x)):((x) => {return x})}
						style={{
							tickLabels: {fontSize: 25, fill: '#ffffff'}, 
							axis: {stroke: '#000000'}
						}}
					/>
					<VictoryAxis 
						style={{
							tickLabels: {fontSize: 25, fill: pallete.mint}, 
							axis: {stroke: pallete.mint}
						}} 
						dependentAxis
					/>
					<VictoryBar 
						barWidth={data?(showing?(chartWidth*0.4/showing.length):(null)):(null)}
						style={{data: {fill: pallete.mint}}} 
						data={showing}
					/>
				</VictoryChart>
			)}
			</Box>
		</Stack>
		</Grid>
	)};