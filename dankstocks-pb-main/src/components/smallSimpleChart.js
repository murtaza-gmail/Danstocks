import {useState, useEffect} from 'react';
import axios from 'axios';
import {Box, Grid, CircularProgress, Stack, MenuItem, Skeleton} from '@mui/material'
import {VictoryChart, LineSegment, VictoryLine, VictoryAxis, VictoryLabel, VictoryCandlestick, createContainer}  from 'victory';
import {BaseComponent, Footer, StyledSelect, Loading, RangeSelector} from '../misc/components';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';
import {getRoute, tickFormat, commarize} from '../misc/utils';

const VictoryMasterContainer = createContainer("voronoi", "cursor");

function victoryHoverContainer (isTouchDevice, offsetHeight=25, labelFontSize=25) {
	if (isTouchDevice) {return undefined}

	return (
		<VictoryMasterContainer 
			voronoiDimension='x' 
			cursorDimension='x' 
			voronoiBlacklist={["stock"]} 
			cursorComponent={<LineSegment style={{stroke: style.defaults.accentLight}}/>} 
			labels={(d) => `${d.datum.x.toLocaleDateString()} - ${d.datum.y}`} 
			labelComponent={<VictoryLabel dy={(d) => - d.y + offsetHeight}textAnchor='middle' style={{fontSize: labelFontSize, fill: pallete.white }}/>}
		/>
	)};

function CandleLineToggle () {
	return null
}

function TimeframeSelector () {
	return null
}

function HeaderBar ({vw, title, quote, candle, timeframe, handler}) {

	quote = quote===undefined?({last: '-', pctReturn: '-', absReturn: '-'}):(quote)

	return (
		<Stack
			direction='row' justifyContent='space-between'
			sx={{
				position: 'absolute', width: 1,
				top: '0vw', left: '0vw',
				'z-index': 6, textAlign: 'center', 
				pt: '1.5%', pb: '1.5%', 
				borderTopRightRadius: '0.5vw', 
				borderTopLeftRadius: '0.5vw', 
				...fsr(vw, 0.8, 0.65)
			}}
			>
			<Stack direction='row' justifyContent='space-around' width='70%'>
				<Box>{title}</Box>
				<Box>{quote.last}</Box>
				<Box>{quote.pct_return}</Box>
				<Box>{quote.abs_return}</Box>
			</Stack>
			<Stack direction='row' width='30%'>
				<CandleLineToggle/>
				<TimeframeSelector/>
			</Stack>
		</Stack>
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
    		<Skeleton variant="rounded" animation='wave' sx={{width: '96%', height: '80%', bgcolor: style.defaults.foreground}} />
    	</Stack>
  	</Grid>
  )};

export default function SmallSimpleChart({vw, data, height, width, title, isTouchDevice, quote}) {
	const [params, setParams] = useState({
		range: 132,
		timeframe: 1,
		candle: false
	})

	function handler (field, value) {
		params[field] = value
		setParams({...params})
	}

	const chartHeight = Number(height.height.replace('px', ''))*2.5
	const chartWidth = Number(width.width.replace('px', ''))*2.5

	if (data === undefined) {return <Skeletonw sx={{...width, ...height, bgcolor: style.defaults.foregroundLight, mt: '3%', borderRadius: '0.5vw'}}/>};

	let slicedData = data.map((i) => {return {x: new Date(i.x), y: i.close}})
	slicedData = slicedData.slice(slicedData.length - params.range, slicedData.length)

	return (
		<Grid item>
		<Box 
			sx={{
				position: 'relative', ...width, 
				bgcolor: style.defaults.foregroundDark, 
				borderRadius: '0.5vw', borderBottom: 1, 
				
				borderColor: style.defaults.accentLight, 
				color: style.defaults.fontcolor, mt: '2%'
			}}
			>
			<HeaderBar
				title={title}
				quote={quote}
				candle={params.candle}
				timeframe={params.timeframe}
				handler={handler}
			/>
			<RangeSelector 
					value={params.range} 
					handler={(v) => handler('range', v)} 
					buttonSx={{
						color: pallete.white, 
						display: 'flex', 
						justifyContent: 'center', 
						alignItems: 'center',
						borderRadius: '100vw', 
						// width: gwr(vw, 0.01, 0.02).width, 
						// height: gwr(vw, 0.01, 0.02).width,
						'&:hover': {bgcolor: pallete.greyTransparent},
						...fsr(vw, 0.65, 0.55), p: '7px'
					}}
					containerSx={{position: 'absolute', right: '4%', bottom: vw?('14%'):('18%'), 'z-index': 3}}
					buttons={{66: '3m', 132: '6m', 264: '1y', 528: '2y', 792: '3y'}}
			/>
			<Box sx={{pt: '5%'}}>
				<VictoryChart 
					height={chartHeight} width={chartWidth}
					padding={{left: chartWidth/15, right: chartWidth/25, top: chartHeight/20, bottom: vw?(chartHeight/10):(chartHeight/7)}}
					domainPadding={{x: [10, chartWidth/5], y: [20, 20]}}
				  containerComponent={victoryHoverContainer(isTouchDevice, chartHeight/20, 25)}
					>
					<VictoryAxis 
						scale='time' 
						// tickFormat={tickFormat} 
						// tickCount={5} 
						tickFormat={(x) => x.toLocaleDateString('en-us', {year: '2-digit', month: 'short'})}
						style={{
							tickLabels: {fontSize: 25, fill: style.defaults.accentLight}, 
							axis: {stroke: style.defaults.accentLight}, 
							grid: {'stroke': '#15bd8d40', strokeWidth: 0.5}
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
					<VictoryLine 
						data={slicedData} 
						style={{
							data: {stroke: '#77b329', strokeWidth: 1}
						}}
					/>
				</VictoryChart>
			</Box>
		</Box>
		</Grid>
	)};
