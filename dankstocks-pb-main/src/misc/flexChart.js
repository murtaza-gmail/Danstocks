import React from 'react';
import {Box, Stack, Grid, IconButton, MenuItem} from '@mui/material';
import {VictoryChart, LineSegment, VictoryLine, VictoryAxis, VictoryLabel, VictoryCandlestick, createContainer}  from 'victory';
import {ShowChart, CandlestickChart} from '@mui/icons-material';
import {StyledSelect, Footer, Loading, RangeSelector} from './components';
import {commarize, reduceGranularity, tickFormat} from './utils';
import {pallete, ghr, gwr, fsr, style} from './style';

const VictoryMasterContainer = createContainer("voronoi", "cursor")

function ChartHeader ({vw, infoComponent, values, handler, chartWidth}) {

	return (
	<Stack 
		direction='row'
		justifyContent='space-between'
		sx={{
			width: '90%',
			position: 'absolute',
			top: '0vw', left: chartWidth/25,
			pt: '1.5%', pb: '1.5%', 
			'z-index': 3,
			borderTopRightRadius: '0.5vw',
			borderTopLeftRadius: '0.5vw'
		}}
			>
			<Box>
				{infoComponent}
			</Box>
			<Stack
				direction='row' 
				alignItems='center' 
				spacing={gwr(vw, 0.01, 0.02).width}
				>
				{!values.candle?(
					<IconButton 
						sx={{p: 0, '&:hover': {bgcolor: pallete.greyTransparent}}} 
						onClick={() => handler('candle', !values.candle)}
						>
						<CandlestickChart sx={{color: pallete.white}}/>
					</IconButton>
				):(
					<IconButton 
						sx={{p: 0, '&:hover': {bgcolor: pallete.greyTransparent}}} 
						onClick={() => handler('candle', !values.candle)}
						>
						<ShowChart sx={{color: pallete.white}}/>
					</IconButton>
				)}
				<StyledSelect
						value={values.tmf} 
						handler={(e) => handler('tmf', e.target.value)}
						height={ghr(vw, 0.04, 0.035).height} 
						width={gwr(vw, 0.05, 0.15).width}
						label={'timeframe'} bgcolor={pallete.black}
					>
					<MenuItem value={1}>D</MenuItem>
					<MenuItem value={3}>3D</MenuItem>
					<MenuItem value={5}>W</MenuItem>
				</StyledSelect>
			</Stack>
		
	</Stack>
	)};

export default function FlexChart ({data, vw, width, height, infoComponent}) {
	const [params, setParams] = React.useState({range: 132, candle: true, tmf: 1});

	function paramHandler (field, value) {
		if (field === 'range' && value > 528){
			params['candle'] = false
			setParams({...params})
		}
		params[field] = value
		setParams({...params})
	}
	
	if (data===undefined) {
		return <Loading sx={{...width, ...height, bgcolor: style.defaults.foregroundDark, color: style.defaults.fontcolor, borderBottom: 1, borderColor: style.defaults.accentLight, borderRadius: '0.5vw', ...fsr(vw, 0.9, 1)}}/>
	}
		
	let slicedData = []

	if (params.candle) {
		slicedData = data.map((item) => {return {...item, x: new Date(item.x)}})
	} else {
		slicedData = data.map((item) => {return {x: new Date(item.x), y: item.close}})
	}

	if (params.tmf !== 1) {
		slicedData = reduceGranularity(slicedData, params.tmf, params.candle)
	}

	if (slicedData.length > params.range/params.tmf) {
		slicedData = slicedData.slice(slicedData.length - params.range/params.tmf, slicedData.length)
	}

	const chartHeight = Number(height.height.replace('px', ''))*2
	const chartWidth = Number(width.width.replace('px', ''))*2

	return (
		<Grid item>
		<Stack 
			direction='column' 

			sx={{
				bgcolor: style.defaults.foregroundDark, 
				color: style.defaults.fontcolor, 
				borderBottom: 1, 
				borderColor: style.defaults.accentLight, 
				borderRadius: '0.5vw', 
				...width, 
				...fsr(vw, 0.9, 1)
			}}
			>
			<Box sx={{position: 'relative'}}>
				<ChartHeader 
					infoComponent={infoComponent} 
					values={params}
					handler={paramHandler}
					chartWidth={chartWidth}
					vw={vw}
				/>
				<RangeSelector 
					value={params.range} 
					handler={(e) => paramHandler('range', e)} 
					buttonSx={{
						color: pallete.white, display: 'flex', 
						justifyContent: 'center', alignItems: 'center',
						borderRadius: '100vw', 
						p: '0.5vh', width: gwr(vw, 0.02, 0.05).width, height: gwr(vw, 0.02, 0.05).width,
						'&:hover': {bgcolor: pallete.greyTransparent}
					}}
					containerSx={{position: 'absolute', right: '2%', bottom: '10%', 'z-index': 3}}
					buttons={{66: '3m', 132: '6m', 264: '1y', 528: '2y', 792: '3y'}}
				/>
				<VictoryChart 
					width={chartWidth} height={chartHeight}
					domainPadding={{x: [10, chartWidth/7], y: [chartHeight/10, chartHeight/5]}}
					padding={{
						left: chartWidth/15, 
						right: chartWidth/30, 
						bottom: chartWidth/35, 
						top: chartWidth/30
					}}
				  containerComponent={
				  	<VictoryMasterContainer 
				  		voronoiDimension='x' 
				  		cursorDimension="x"
				  		cursorComponent={<LineSegment style={{stroke: pallete.mint, strokeWidth: 0.5, strokeDasharray: 5}}/>}
				  		labels={(d) => {
				  			if (params.candle) {
				  				return `${d.datum.x.toLocaleDateString()} - ${d.datum.close}`
				  			} else {
				  				return `${d.datum.x.toLocaleDateString()} - ${d.datum.y}`}
				  			}
				  		}
				  		labelComponent={params.candle?(
			  				<VictoryLabel 
			  					y={chartHeight/5} 
			  					textAnchor='middle'
			  					style={{fontSize: chartWidth/60, fill: pallete.white }}
			  				/>
				  		):(
			  				<VictoryLabel 
			  					dy={(d) => (-d.y + chartHeight/8)} 
			  					textAnchor='middle'
			  					style={{fontSize: chartWidth/60, fill: pallete.white }}
			  				/>
			  			)}
				  	/>
				 	}
					>
					<VictoryAxis 
						scale='time' 
						tickFormat={tickFormat} 
						tickCount={7} 
						style={{
							tickLabels: {fontSize: chartWidth/60, fill: pallete.mint}, 
							axis: {stroke: pallete.mint}, 
							grid: {'stroke': '#15bd8d40', strokeWidth: 0.5}
						}}
					/>
					<VictoryAxis 
						scale='time' 
						dependentAxis 
						style={{
							tickLabels: {fontSize: chartWidth/60, fill: pallete.mint}, 
							axis: {stroke: pallete.mint}, 
							grid: {'stroke': '#15bd8d40', strokeWidth: 0.5}
						}}
					/>
					{params.candle?(
						<VictoryCandlestick 
							candleWidth={(slicedData.length>264?(3):(1))*chartWidth*0.5/slicedData.length} 
							data={slicedData} 
							candleColors={{ positive: pallete.chartPos, negative: pallete.chartNeg }}
						/>
					):(
						<VictoryLine 
							data={slicedData} 
							style={{data: {stroke: '#77b329', strokeWidth: 1}}}
						/>
					)}
				</VictoryChart>
			</Box>
		</Stack>
		</Grid>
	)};
