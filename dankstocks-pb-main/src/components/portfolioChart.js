import {useState} from 'react';
import axios from 'axios';
import {Box, Stack, Button, Grid, MenuItem, IconButton} from '@mui/material';
import {VictoryChart, VictoryAxis, VictoryCandlestick, VictoryPie, VictoryBar} from 'victory';
import CloseIcon from '@mui/icons-material/Close';
import {StyledSelect, StyledTextfield, Loading} from '../misc/components';
import {generateAuthConfig, logout, getRoute, reduceGranularity} from '../misc/utils';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';

const btnstyle = {border: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '5vw', '&:hover': {border: 1, borderColor: pallete.mint, backgroundColor: pallete.greyTransparent}}

export default function PortChart ({vw, data, height, width, portfolio, current}) {
	const [range, setRange] = useState(528)
	const [tmf, setTmf] = useState(3)
	
	const chartWidth = Number(width.width.replace('px', ''))*0.9*2.5
	const chartHeight = Number(height.height.replace('px', ''))*0.7*2.5

	if (data === undefined) {
		return null
	}

	console.log(data)

	let slicedData = data
	let latestDate = ''
	let absReturn  = ''
	let pctReturn  = ''

	if (data.length > 0) {
		latestDate = data[data.length-1].x
		absReturn = data[data.length-1].close - data[data.length-2].close
		pctReturn = (absReturn/data[data.length-2].close)*100
	}
	
	console.log(latestDate, absReturn, pctReturn)

	if (tmf !== 1) {
		slicedData = reduceGranularity(data, tmf)
	}

	if (slicedData.length > range/tmf) {
		slicedData = slicedData.slice(slicedData.length - range/tmf, slicedData.length)
	}

	return (
		<Grid item>
		<Stack 
			direction='column' 
			sx={{
				...height, ...width, 
				bgcolor: pallete.black, 
				borderRadius: '0.5vw', 
				borderBottom: 1, 
				borderColor: pallete.mint,
				mt: '1vw'
			}}>
			<Stack direction='row' sx={{height: '15%', width: 1, bgcolor: pallete.darkMint, ...fsr(vw, 0.8, 1), color: style.defaults.fontcolor, borderTopRightRadius: '0.5vw', borderTopLeftRadius: '0.5vw'}} justifyContent='space-around' alignItems='center'>
				<Box>Historic Returns</Box>
				<StyledSelect value={tmf} handler={(e) => setTmf(e.target.value)} label='Timeframe' width={gwr(vw, 0.07, 0.05).width} height={ghr(vw, 0.04, 0.05).height}>
					<MenuItem value={1}>D</MenuItem>
					<MenuItem value={3}>3D</MenuItem>
					<MenuItem value={5}>W</MenuItem>
				</StyledSelect>
				<StyledSelect value={range} handler={(e) => setRange(e.target.value)} label='Range' width={gwr(vw, 0.07, 0.05).width} height={ghr(vw, 0.04, 0.05).height}>
					<MenuItem value={132} >6m</MenuItem>
					<MenuItem value={264} >1y</MenuItem>
					<MenuItem value={528}>2y</MenuItem>
					<MenuItem value={1320}>5y</MenuItem>
				</StyledSelect>
			</Stack>
			<Box>
				<VictoryChart 
					padding={{
						left: chartWidth/20, 
						right: chartWidth/20, 
						top: chartWidth/50, 
						bottom: chartWidth/50
					}}
					width={chartWidth}
					height={chartHeight}
					>
					<VictoryAxis 
						style={{
							tickLabels: {fontSize: 25, fill: pallete.mint}, 
							axis: {stroke: pallete.mint}, 
							grid: {'stroke': '#15bd8d5a', strokeWidth: 0.5}
						}} 
						tickCount={5}
					/>
					<VictoryAxis 
						style={{
							tickLabels: {fontSize: 25, fill: pallete.mint}, 
							axis: {stroke: pallete.mint}, 
							grid: {'stroke': '#15bd8d5a', strokeWidth: 0.5}
						}} 
						dependentAxis
					/>
					<VictoryCandlestick
						candleColors={{ positive: "#00ff00", negative: "#ff0000" }}
						data={slicedData}
						candleWidth={chartWidth*0.7/slicedData.length}
					/>
				</VictoryChart>			
			</Box>
		</Stack>
		</Grid>
	)};