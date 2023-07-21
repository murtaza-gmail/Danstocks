import React from 'react';
import {MenuItem, Button, IconButton, Box, Stack, Grid} from '@mui/material'
import {VictoryChart, LineSegment, VictoryLine, VictoryAxis, VictoryLabel, VictoryCandlestick, createContainer}  from 'victory';

import ShowChartIcon from '@mui/icons-material/ShowChart';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';


import {StyledSelect, Loading, RangeSelector} from '../misc/components';
import {reduceGranularity, tickFormat} from '../misc/utils';

import {pallete, ghr, gwr, fsr, style} from '../misc/style'
const VictoryMasterContainer = createContainer("voronoi", "cursor")

function ChartHeader ({quote, title, ticker, values, handler, vw, setPopup}) {
	if (quote === undefined) {return null}

	return (
		<Grid 
			container 
			sx={{
				position: 'absolute', left: '0vw', 
				'z-index': 6, width: 1, top: '0vw',
				pb: '0.5%', pt: '0.5%', 
				borderTopLeftRadius: '0.5vw', 
				borderTopRightRadius: '0.5vw'
			}} 
			justifyContent='space-around'
			>
			<Grid item md={5.5} xs={12}>
				<Stack 
					direction='row' spacing='0.5vw' 
					justifyContent='space-around' alignItems='center'
					sx={{color: pallete.white, width: 1, height: 1}}
					>
					<Box> {ticker.toUpperCase()}             </Box>
					<Box> {title}                            </Box>
					<Box> ${quote.current.toFixed(2)}        </Box>
					<Box> {quote.abs_ret.toFixed(2)}         </Box>
					<Box> {(quote.pct_ret*100).toFixed(2)}%  </Box>
					<Box> {quote.isOpen?('OPEN'):('CLOSED')} </Box>
				</Stack>
			</Grid>
			<Grid item md={4.5} xs={12}>
				<Stack
					direction='row' justifyContent='space-around' 
					alignItems='center' spacing='0.5vw' 
					sx={{width: 1, height: 1, pb: '1vh', pt: '0.5vh'}}
					>
					{!values.candle?(
						<IconButton 
							sx={{p: 0, '&:hover': {bgcolor: pallete.greyTransparent}}} 
							onClick={() => handler('candle', !values.candle)}
							>
							<CandlestickChartIcon sx={{color: pallete.white}}/>
						</IconButton>
					):(
						<IconButton 
							sx={{p: 0, '&:hover': {bgcolor: pallete.greyTransparent}}} 
							onClick={() => handler('candle', !values.candle)}
							>
							<ShowChartIcon sx={{color: pallete.white}}/>
						</IconButton>
					)}
					<Button 
						onClick={() => setPopup('indicators')} 
						sx={{
							borderBottom: 1, borderColor: pallete.mint, 
							bgcolor: style.defaults.foregroundDark, 
							color: pallete.white,
							...ghr(vw, 0.05, 0.05)
						}}
					> 
						INDICATORS 
					</Button>
					<StyledSelect
							value={values.tmf} label={'timeframe'} 
							height={ghr(vw, 0.05, 0.05).height}
							width={gwr(vw, 0.07, 0.1).width}
							handler={(e) => handler('tmf', e.target.value)}
						>
						<MenuItem value={1}>D</MenuItem>
						<MenuItem value={3}>3D</MenuItem>
						<MenuItem value={5}>W</MenuItem>
					</StyledSelect>
				</Stack>
			</Grid>
		</Grid>
	)};

function treatStock(array, p) {
	let sliced = []

	if (p.candle) {
		sliced = array.map((item) => {return {...item, x: new Date(item.x)}})
	} else {
		sliced = array.map((item) => {return {x: new Date(item.x), y: item.close}})
	}

	if (p.tmf !== 1) {
		sliced = reduceGranularity(sliced, p.tmf, p.candle)
	}

	if (sliced.length > p.range/p.tmf) {
		sliced = sliced.slice(sliced.length - p.range/p.tmf, sliced.length)
	}

	return sliced
	};

function treatIndicator (array, p){
	let sliced = []

	sliced = array.map((item) => {return {...item, x: new Date(item.x)}})

	if (p.tmf !== 1) {
		sliced = reduceGranularity(sliced, p.tmf, false)
	}

	if (sliced.length > p.range/p.tmf) {
		sliced = sliced.slice(sliced.length - p.range/p.tmf, sliced.length)
	}

	return sliced
	};

function Chart ({stock, quote, title, ticker, vw, width, height, setPopup, indicators}) {
	const [params, setParams] = React.useState({range: 132, candle: true, tmf: 1});

	function paramHandler (field, value) {
		if (field === 'range' && value > 528){
			params['candle'] = false
			setParams({...params})
		}
		params[field] = value
		setParams({...params})
	};

	let slicedStock = treatStock(stock, params);

	const chartHeight = Number(height.height.replace('px', ''))*2
	const chartWidth = Number(width.width.replace('px', ''))*2

	return (
		<Stack direction='column' sx={{position: 'relative', ...width, bgcolor: style.defaults.foregroundDark, borderBottom: 1, borderColor: style.defaults.accentLight, borderRadius: '0.5vw', ...fsr(vw, 1, 1.1), color: style.defaults.fontcolor, mt: '1%'}}>
			<ChartHeader 
				quote={quote} 
				title={title} 
				ticker={ticker}
				values={params}
				handler={paramHandler}
				vw={vw}
				setPopup={setPopup}
			/>
			<Box sx={{width: 1, ...height, position: 'relative'}}>
				<RangeSelector 
					value={params.range} 
					handler={(e) => paramHandler('range', e)} 
					buttonSx={{
						color: pallete.white, display: 'flex', 
						justifyContent: 'center', alignItems: 'center',
						borderRadius: '100vw', 
						p: '0.5vw', width: gwr(vw, 0.02, 0.07).width, height: gwr(vw, 0.02, 0.07).width,
						'&:hover': {bgcolor: pallete.greyTransparent},
						...fsr(vw, 1.15, 1.25)
					}}
					containerSx={{position: 'absolute', bottom: vw?('10%'):('5%'), right: '5%', 'z-index': 3}}
					buttons={{66: '3m', 132: '6m', 264: '1y', 528: '2y', 792: '3y'}}
				/>
				<VictoryChart 
					width={chartWidth} height={chartHeight}
					domainPadding={{x: [10, chartWidth/7], y: [chartHeight/25, chartHeight/25]}}
					padding={{left: chartWidth/15, right: chartWidth/15, bottom: chartHeight/20, top: chartHeight/8}}
				  	containerComponent={
					  	<VictoryMasterContainer 
					  		voronoiDimension='x' 
					  		cursorDimension="x"
					  		voronoiBlacklist={['indicator']}
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
				  					y={chartHeight/20} 
				  					textAnchor='middle'
				  					style={{fontSize: 25, fill: pallete.white }}
				  				/>
					  		):(
				  				<VictoryLabel 
				  					dy={(d) => (-d.y +chartHeight/20)} 
				  					textAnchor='middle'
				  					style={{fontSize: 25, fill: pallete.white }}
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
							tickLabels: {fontSize: 25, fill: pallete.mint}, 
							axis: {stroke: pallete.mint}, 
							grid: {'stroke': '#15bd8d40', strokeWidth: 0.5}
						}}
					/>
					<VictoryAxis 
						scale='time' 
						dependentAxis 
						style={{
							tickLabels: {fontSize: 25, fill: pallete.mint}, 
							axis: {stroke: pallete.mint}, 
							grid: {'stroke': '#15bd8d40', strokeWidth: 0.5}
						}}
					/>
					{params.candle?(
						<VictoryCandlestick name='stock'
							candleWidth={(slicedStock.length>264?(3):(1))*chartWidth*0.5/slicedStock.length} 
							data={slicedStock} 
							candleColors={{ positive: pallete.chartPos, negative: pallete.chartNeg }}
						/>
					):(
						<VictoryLine name='stock'
							data={slicedStock} 
							style={{data: {stroke: '#77b329', strokeWidth: 1}}}
						/>
					)}
					{indicators.map((ind, idx) => 
						<VictoryLine name='indicator'
							key={'indicator'+String(idx)}
							style={{data: {stroke: pallete[ind.color]}}}
							data={treatIndicator(ind.data, params)}
						/>
					)}
				</VictoryChart>
			</Box>
		</Stack>
	)};

export default function StockChart (props){
	const [vw, setVw] = React.useState(window.innerWidth/window.innerHeight>1)
	const [bh, setBh] = React.useState(document.documentElement.clientHeight)
	const [bw, setBw] = React.useState(document.documentElement.clientWidth)
	
	window.addEventListener("resize", () => {
		if (vw !== ((window.innerWidth/window.innerHeight)>1)){
			setBh(document.documentElement.clientHeight)
			setBw(document.documentElement.clientWidth)
		}
		setVw(window.innerWidth/window.innerHeight>1)
	});

	if (props.mode === 'CHART' && (props.quote === undefined || props.stats === undefined || props.data === undefined )) {
		return <Loading sx={{height: '91vh', width: 1, bgcolor: pallete.dankstocksGreyDark}}/>
	}

	if (props.mode === 'CHART') {
		return (
			<Stack 
				direction='column' 
				alignItems='center'
				sx={{width: 1}}>
				<Chart 
					height={ghr(vw, 0.87, 0.87)}
					width={gwr(vw, 0.95, 0.95)}
					vw={vw}
					setPopup={props.setPopup}
					title={props.stats.companyName} 
					quote={props.quote} 
					ticker={props.ticker} 
					stock={props.data.stock} 
					indicators={props.data.indicators}
				/>
			</Stack>
		)
	}};
