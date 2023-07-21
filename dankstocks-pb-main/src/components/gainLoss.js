import {useState} from 'react';
import axios from 'axios';
import {Box, Stack, Button, Grid, MenuItem, IconButton} from '@mui/material';
import {VictoryChart, VictoryAxis, LineSegment, VictoryLabel, VictoryCandlestick, VictoryPie, VictoryBar, VictoryLine, VictoryVoronoiContainer} from 'victory';
import CloseIcon from '@mui/icons-material/Close';
import {StyledSelect, StyledTextfield, Loading} from '../misc/components';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';

// function BarChart(props) {
// 	const [percent, setPercent] = React.useState(false)
// 	let data = props.data.map((i) => ({x: (new Date(i.x)), y: i.y/1000000000}))

// 	if (percent) {
// 		data = props.data.map((i, index) => ({
// 			x: new Date(i.x),
//   		y: index === 0 ? 0 : (i.y - props.data[index - 1].y) / props.data[index - 1].y * 100
// 		}));
// 	}

//   return (
//     <Box sx={{
//       height: props.h, width: props.w,
//       bgcolor: pallete.black, position: 'relative',
//       borderRadius: '0.5vw', mb: '1vw',
//       boxShadow: '0 0 0.5vw 0.5vw #121212',
//       border: 1, borderColor: pallete.midMint,
//     }}>
//     	<Box onClick={() => setPercent(!percent)} sx={{fontSize: '75%', color: pallete.white, position: 'absolute', 'z-index': 3, top: '3%', left: '3%', p: '0.5vw', borderRadius: '5vw', backgroundColor: pallete.dankstocksGreyDark, '&:hover': {boxShadow: '0 0 0.1vw 0.5vw #050505', backgroundColor: pallete.dankstocksGrey, cursor: 'pointer'}}}>% chg</Box>
//     	<Box sx={{position: 'absolute', 'z-index': 3, top: '3%', right: '3%'}}>
// 				<IconButton onClick={() => props.handler('plot', {idf: props.idf, key: props.k})} sx={{p: '15%', '&:hover': {bgcolor: pallete.greyTransparent, boxShadow: '0 0 0.1vw 0.5vw #101010'}}}>
// 					<Close sx={{color: pallete.red, fontSize: '75%'}}/>
// 				</IconButton>
// 			</Box>
//       <VictoryChart
//         width={Number(props.w.replace('px', ''))}
//         height={Number(props.h.replace('px', ''))}
//         domainPadding={{ x: (props.w.replace('px', ''))*0.25/data.length, y: [10, 10] }}
//         padding={{top: 40, bottom: 30, left: 40, right: 20}}
// 	  	containerComponent={
// 	  		<VictoryVoronoiContainer 
// 	  			voronoiDimension='x' cursorDimension="x" voronoiBlacklist={['axis']}
// 	  			cursorComponent={<LineSegment style={{stroke: pallete.mint, strokeWidth: 0.5, strokeDasharray: 5}}/>}
// 				labels={(d) => {if (d.datum.y !== undefined && d.datum.y !== null){return percent?(`${d.datum.y.toFixed(2)}%`):(`${d.datum.y.toFixed(2)}B`)} else {return `${d.datum.y}`}}}
// 	  			labelComponent={<VictoryLabel dy={(d) => (-d.y + 60)} textAnchor='middle'style={{fontSize: 12, fill: '#ee8800' }}/>}
// 	  		/>
// 	 		}
//       	>
// 	      <VictoryLabel
// 	      	scale='time' text={props.title}
// 	        textAnchor="middle" y={30}
// 	        x={Number(props.w.replace('px', ''))/2}
// 	        style={{ fontSize: 18, fill: '#ffffff' }}
// 	      />
//         <VictoryAxis
// 					scale='time' tickFormat={tickFormat} offsetY={30}
//           style={{
//             axis: { stroke: '#15bd8d50', strokeWidth: 0.5 },
//             tickLabels: { fontSize: 11, fill: pallete.white },
//           }}
//         />
//         <VictoryAxis
//           dependentAxis scale='time' tickFormat={(t) => percent?(`${t}%`):(`${t}B`)}
//           style={{
//             axis: { stroke: '#15bd8d' },
//             tickLabels: { fontSize: 11, fill: pallete.white },
//             grid: {stroke: '#15bd8d50', strokeWidth: 0.5}
//           }} 
//         />
// 	      <VictoryLine name='axis'
// 	        data={[{x: data[0].x, y: 0}, {x: data[data.length - 1].x, y: 0}]}
// 	        style={{ data: { stroke: pallete.white, strokeWidth: 1 } }}
// 	      />
//         <VictoryBar
//           style={{
//             data: { fill: pallete.mint },
//             labels: { fontSize: '1.5vw', fill: pallete.white },
//           }}
//           data={data}
//           barWidth={(props.w.replace('px', ''))*0.25/data.length}
//         />
//       </VictoryChart>
//     </Box>
//   )};

export default function GainLoss ({vw, data, height, width}) {
	const [mode, setMode] = useState('return')
	
	const chartHeight = Number(height.height.replace('px', ''))*2.5
	const chartWidth = Number(width.width.replace('px', ''))*2.5

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
				<Box>Component Contribution</Box>
				<StyledSelect 
					width={gwr(vw, 0.15, 0.2)}
					height={ghr(vw, 0.05, 0.025)}

					handler={(e) => setMode(e.target.value)} 
					value={mode} 
					label='Series' 
					id='gainLossSelect' 
					>
					<MenuItem value='inc_contribution'>Income Contribution</MenuItem>
					<MenuItem value='ret_contribution'>Return Contribution</MenuItem>
					<MenuItem value='vol_contribution'>Volatility Contribution</MenuItem>
					<MenuItem value='income'>income</MenuItem>
					<MenuItem value='return'>return</MenuItem>
					<MenuItem value='volatility'>volatility</MenuItem>
					<MenuItem value='return_to_volatility'>return-volatility ratio</MenuItem>
				</StyledSelect>
			</Stack>
			{data===undefined?(
				<Loading sx={{bgcolor: style.defaults.foregroundDark, ...width, ...height, borderRadius: '0.5vw', borderBottom: 1, borderColor: style.defaults.accentLight}}/>
			):(
				<Box>
					<VictoryChart 
						height={chartHeight} 
						width={chartWidth}
				    domainPadding={{x: chartWidth*0.25/showing.length, y: [10, 10] }}
				    padding={{top: chartWidth/15, bottom: chartWidth/15, left: chartWidth/15, right: chartWidth/25}}
					  containerComponent={
				  		<VictoryVoronoiContainer 
				  			voronoiDimension='x' 
				  			cursorDimension="x" 
				  			voronoiBlacklist={['axis']}
				  			cursorComponent={<LineSegment style={{stroke: pallete.mint, strokeWidth: 0.5, strokeDasharray: 5}}/>}
								labels={(d) => {if (d.datum.y !== undefined && d.datum.y !== null){return `${(d.datum.y*100).toFixed(2)}%`}}}
				  			labelComponent={
				  				<VictoryLabel 
				  					dy={(d) => (-d.y + chartWidth/20)} 
				  					textAnchor='middle'
				  					style={{fontSize: chartWidth/50, fill: '#ee8800' }}
				  				/>
				  			}
				  		/>
				  	}
						>
						<VictoryAxis 
							offsetY={chartHeight/7}
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
			      <VictoryLine name='axis'
			      	data={showing.map((d) => ({x: d.x, y: 0}))}
			        style={{ data: { stroke: pallete.white, strokeWidth: 1 } }}
			      />
					  <VictoryBar 
					  	barWidth={chartWidth*0.25/showing.length}
					  	style={{data: {fill: pallete.mint}}} 
					  	data={showing}
					  />
					</VictoryChart>
				</Box>
			)}
		</Stack>
		</Grid>
	)};