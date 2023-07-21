import React from 'react';
import axios from 'axios';
import {Box, Grid, CircularProgress, Stack, MenuItem, Skeleton} from '@mui/material'
import {VictoryChart, LineSegment, VictoryLine, VictoryAxis, VictoryLabel, VictoryCandlestick, createContainer}  from 'victory';
import {BaseComponent, Footer, StyledSelect, Loading, RangeSelector} from '../misc/components';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';
import {getRoute, smoothArray, normalizeArray, reduceGranularity, tickFormat} from '../misc/utils';

const VictoryMasterContainer = createContainer("voronoi", "cursor");

function ChartHeader({values, handler, vw, infoComponent}) {return (
	<Grid spacing={'2%'} container sx={{width: 1, pb: '1.5%', pt: '1.5%', borderTopRightRadius: '0.5vw', borderTopLeftRadius: '0.5vw'}} justifyContent='space-around'>
		{infoComponent}
		<Grid item xs={11.5} md={7}>
			<Stack 
				direction='row' justifyContent='space-around' 
				alignItems='center' sx={{width: 1, height: 1, pb: '1%', pt: '1%'}}
				>
				<StyledSelect 
					width={gwr(vw, 0.10, 0.2)}
					height={ghr(vw, 0.04, 0.05)}
					value={values.selected} 
					handler={(e) => handler('selected', e.target.value)}
					label={'indicator'}
					>
					<MenuItem value={'osc'}>oscillator</MenuItem>
					<MenuItem value={'vvix'}>VVIX Correlation</MenuItem>
				</StyledSelect>
				<StyledSelect 
					width={gwr(vw, 0.05, 0.2)}
					height={ghr(vw, 0.04, 0.05)}
					value={values.normalization} 
					handler={(e) => handler('normalization', e.target.value)}
					label={'normalization'} 
					>
					<MenuItem value={'max'}>max</MenuItem>
					<MenuItem value={30}>30</MenuItem>
					<MenuItem value={45}>45</MenuItem>
					<MenuItem value={90}>90</MenuItem>
					<MenuItem value={180}>180</MenuItem>
				</StyledSelect>
				<StyledSelect 
					width={gwr(vw, 0.05, 0.2)}
					height={ghr(vw, 0.04, 0.05)}
					value={values.smoothing} 
					handler={(e) => handler('smoothing', e.target.value)}
					label={'smoothing'}
					>
					<MenuItem value={'no_smoothing'}>No Smoothing</MenuItem>
					<MenuItem value={2}>2</MenuItem>
					<MenuItem value={3}>3</MenuItem>
					<MenuItem value={5}>5</MenuItem>
					<MenuItem value={7}>7</MenuItem>
					<MenuItem value={9}>9</MenuItem>
				</StyledSelect>
				<StyledSelect 
					width={gwr(vw, 0.05, 0.2)}
					height={ghr(vw, 0.04, 0.05)}
					value={values.tmf} 
					handler={(e) => handler('tmf', e.target.value)}
					label={'timeframe'} 
					>
					<MenuItem value={1} >1D</MenuItem>
					<MenuItem value={3} >3D</MenuItem>
					<MenuItem value={5} >1W</MenuItem>
				</StyledSelect>
			</Stack>
		</Grid>
	</Grid>
	)};

function Skeletonw ({sx}) {
  return (
  	<Grid item>
    	<Stack direction='column' sx={sx} alignItems='center' justifyContent='space-around'>
    		<Stack justifyContent='space-around' direction='row' sx={{width: 1, height: '10%'}}>
    			<Skeleton variant="text" animation='wave' sx={{height: 1, width: '30%', bgcolor: style.defaults.foreground}}/>
    			<Skeleton variant="text" animation='wave' sx={{height: 1, width: '25%', bgcolor: style.defaults.foreground}}/>
    			<Skeleton variant="text" animation='wave' sx={{height: 1, width: '8%', bgcolor: style.defaults.foreground}}/>
    			<Skeleton variant="text" animation='wave' sx={{height: 1, width: '8%', bgcolor: style.defaults.foreground}}/>
    			<Skeleton variant="text" animation='wave' sx={{height: 1, width: '8%', bgcolor: style.defaults.foreground}}/>	
    		</Stack>
    		<Skeleton variant="rounded" animation='wave' sx={{width: '96%', height: '70%', bgcolor: style.defaults.foreground}} />
    		<Skeleton variant="rounded" animation='wave' sx={{width: '96%', height: '7%', bgcolor: style.defaults.foreground, mb: '1%'}} />
    	</Stack>
  	</Grid>
  )};

export default function IndicatorChart({vw, height, width, data, index, title, isTouchDevice, infoComponent}) {
	const [params, setParams] = React.useState({
		range: 528, tmf: 3,
		selected: 'osc',
		normalization: 90,
		smoothing: 5
	})

	function paramHandler (field, value) {
		params[field] = value
		setParams({...params})
	}

	const chartHeight = Number(height.height.replace('px', ''))*2.5
	const chartWidth = Number(width.width.replace('px', ''))*2.5

	if (data===undefined || index === undefined || data.length === 0 || index.length === 0) {
		return <Skeletonw sx={{...width, ...height, bgcolor: style.defaults.foregroundLight}}/>
	}

	let slicedIndex = index.map((item) => {return {...item, x: new Date(item.x)}})
	let slicedData = data.map((item) => {return {...item, x: new Date(item.x)}})

	if (params.normalization !== 'max'){
		slicedData = normalizeArray(slicedData, params.normalization)
	}

	if (params.smoothing !== 'no_smoothing'){
		slicedData = smoothArray(slicedData, params.smoothing)
	}

	if (params.tmf !== 1) {
		slicedData = reduceGranularity(slicedData, params.tmf)
		slicedIndex = reduceGranularity(slicedIndex, params.tmf)
	}

	if (slicedData.length > params.range/params.tmf) {
		slicedIndex = slicedIndex.slice(slicedIndex.length - params.range/params.tmf, slicedIndex.length)
		slicedData = slicedData.slice(slicedData.length - params.range/params.tmf, slicedData.length)
	}

	let max = Math.max(...slicedIndex.map((i) => i.close))
	let min = Math.min(...slicedIndex.map((i) => i.close))
	
	slicedData = slicedData.map((i) => {return {'x': i.x, 'y': Number((i.y*(max-min) + min).toFixed(2))}})
	slicedData = slicedData.filter((v) => {return !Number.isNaN(v.y)})

	return (
		<Grid item>
		<Stack 
			direction='column' 
			sx={{
				...width, ...fsr(vw, 0.8, 1),
				bgcolor: style.defaults.foregroundDark, 
				borderBottom: 1, borderRadius: '0.5vw',
				borderColor: style.defaults.accentLight,
				position: 'relative',
				
			}}
			>
			<ChartHeader values={params} handler={paramHandler} vw={vw} infoComponent={infoComponent}/>
			<Box sx={{position: 'relative'}}>
				<RangeSelector 
					value={params.range} 
					handler={(e) => paramHandler('range', e)} 
					buttonSx={{
						color: pallete.white, 
						display: 'flex', 
						justifyContent: 'center', 
						alignItems: 'center',
						borderRadius: '100vw', 
						// width: gwr(vw, 0.02, 0.06).width, 
						// height: gwr(vw, 0.02, 0.06).width,
						'&:hover': {bgcolor: pallete.greyTransparent},
						...fsr(vw, 0.85, 0.65), p: '7px'
					}}
					containerSx={{position: 'absolute', right: vw?('2%'):('4%'), bottom: vw?('7%'):('12%'), 'z-index': 3}}
					buttons={{66: '3m', 132: '6m', 264: '1y', 528: '2y', 792: '3y'}}
				/>
				<VictoryChart 
					height={chartHeight}
					width={chartWidth} 
					padding={{left: chartWidth/20, right: chartWidth/20, bottom: vw?(chartHeight/20):(chartHeight/10), top: 40}}
					domainPadding={{x: [10, chartWidth/10], y: [chartHeight/10, chartHeight/15]}}
				  	containerComponent={!isTouchDevice?(
			  			<VictoryMasterContainer 
			  				voronoiDimension='x' 
			  				cursorDimension='x' 
			  				voronoiBlacklist={["stock"]} 
			  				cursorComponent={<LineSegment style={{stroke: style.defaults.accentLight}}/>} 
  							labels={(d) => `${d.datum.x.toLocaleDateString()} - ${d.datum.y}`} 
  							labelComponent={ 
  								<VictoryLabel  
  									dy={(d) => - d.y + 20}
  									textAnchor='middle' 
  									style={{fontSize: chartHeight/25, fill: pallete.white }}
  								/>
  							}
  						/>
				  		):(undefined)}
				  >
					<VictoryAxis 
						scale='time' 
						// tickFormat={tickFormat} 
						// tickCount={7} 
						tickFormat={(x) => x.toLocaleDateString('en-us', {year: '2-digit', month: 'short'})}
						style={{
							tickLabels: {fontSize: 25, fill: style.defaults.accentLight}, 
							axis: {stroke: style.defaults.accentLight}, 
							grid: {'stroke': '#15bd8d25', strokeWidth: 0.5}
						}}
					/>
					<VictoryAxis 
						scale='time' 
						dependentAxis 
						style={{
							tickLabels: {fontSize: 25, fill: style.defaults.accentLight}, 
							axis: {stroke: style.defaults.accentLight}, 
							grid: {'stroke': '#15bd8d40', strokeWidth: 0.5}
						}}
					/>
					<VictoryCandlestick 
						name="stock" 
						candleWidth={chartWidth*0.5/slicedData.length} 
						data={slicedIndex} 
						candleColors={{positive: style.defaults.accentLight, negative: pallete.red}}
					/>
					<VictoryLine 
						name="indicator" 
						data={slicedData} 
						style={{data: {stroke: '#77b329', strokeWidth: 2}}}
					/>
				</VictoryChart>
			</Box>
		</Stack>
		</Grid>
	)};

