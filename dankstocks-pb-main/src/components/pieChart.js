import {useState} from 'react';
import axios from 'axios';
import {Box, Stack, Button, Grid, MenuItem, IconButton} from '@mui/material';
import {VictoryChart, VictoryAxis, VictoryCandlestick, VictoryPie, VictoryBar} from 'victory';
import CloseIcon from '@mui/icons-material/Close';
import {StyledSelect, StyledTextfield, Loading} from '../misc/components';
import {commarize} from '../misc/utils';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';

const fields = ['industry', 'marketCap', 'sector', 'vol', 'weights']
const titles = {
	'industry': 'Industry',
	'sector': 'Sector',
	'marketCap': 'Market Cap',
	'vol': 'Volatility',
	'weights': 'Weight'
}

export default function PieChart ({vw, data, height, width}) {
	const [mode, setMode] = useState('sector')

	const chartHeight = Number(height.height.replace('px', ''))*3
	const chartWidth = Number(width.width.replace('px', ''))*3

	let showing = data?(
		Object.keys(data[mode]).map((k) => ({'x': k, 'y': data[mode][k]}))
		) : ([])

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
				color: style.defaults.fontcolor,
				pt: ghr(vw, 0.07, 0.07).height,
				...fsr(vw, 0.8, 0.9),
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
				<Box>Diversification</Box>
				<StyledSelect 
					width={gwr(vw, 0.1, 0.2)}
					height={ghr(vw, 0.05, 0.025)}
					handler={(e) => setMode(e.target.value)} 
					value={mode} 
					label='Data' 
					id='pieChartSelect'
					>
					<MenuItem value='sector'>    Sector     </MenuItem>
					<MenuItem value='industry'>  Industry   </MenuItem>
					<MenuItem value='marketCap'> Market Cap </MenuItem>
					<MenuItem value='vol'>       Volatility </MenuItem>
					<MenuItem value='weights'>   weights    </MenuItem>
				</StyledSelect>
			</Stack>
			<Box>
				<VictoryChart height={chartHeight} width={chartWidth}>
					<VictoryAxis 
						style={{
							axis: {stroke: "transparent"}, 
							ticks: {stroke: "transparent"}, 
							tickLabels: {fill:"transparent"}
						}}
					/>
					<VictoryPie
						colorScale={["tomato", "orange", "purple", "gold", "cyan", "navy", "green", "pink"]} 
						data={showing}
						style={{labels: {fontSize: 35, fill: pallete.mint}}}
					/>
				</VictoryChart>
			</Box>
		</Stack>
		</Grid>
	)};