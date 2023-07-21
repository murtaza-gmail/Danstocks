import React from 'react';
import {Box, Stack, Grid, IconButton, MenuItem, Skeleton} from '@mui/material'
import {VictoryChart, LineSegment, VictoryLine, VictoryAxis, VictoryLabel, VictoryCandlestick, createContainer}  from 'victory';
import {ShowChart, ExpandMore, CandlestickChart} from '@mui/icons-material';
import {StyledSelect, RangeSelector} from '../misc/components';
import {commarize, reduceGranularity, tickFormat} from '../misc/utils';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';

const summaryKeyMap = {
  nextEarningsDate: 'Next Earnings',
  dividendYield: 'Div. Yield',
  marketcap: 'Mkt Cap',
  beta: 'Beta',
  avg30Volume: '30d Volume',
  EBITDA: 'EBITDA',
  debtToEquity: 'Debt/Equity',
  forwardPERatio: 'Forward P/E',
  enterpriseValueToRevenue: 'EV/Rev',
  priceToBook: 'P/B',
  priceToSales: 'P/S',
  profitMargin: 'Profit Margin',
  putCallRatio: 'Put/Call Ratio',
  ytdChangePercent: 'YTD Change'
	};

const keyMap = {
  EBITDA: 'EBITDA',
  avg10Volume: '10-Day Avg Volume',
  avg30Volume: '30-Day Avg Volume',
  beta: 'Beta',
  companyName: 'Company Name',
  currentDebt: 'Current Debt',
  day5ChangePercent: '5-Day Change %',
  day30ChangePercent: '30-Day Change %',
  day50MovingAvg: '50-Day Moving Avg',
  day200MovingAvg: '200-Day Moving Avg',
  debtToEquity: 'Debt to Equity',
  dividendYield: 'Dividend Yield',
  employees: 'Employees',
  enterpriseValue: 'Enterprise Value',
  enterpriseValueToRevenue: 'EV to Revenue',
  exDividendDate: 'Ex-Dividend Date',
  float: 'Float',
  forwardPERatio: 'Forward P/E Ratio',
  grossProfit: 'Gross Profit',
  marketcap: 'Market Cap',
  maxChangePercent: 'Max Change %',
  month1ChangePercent: '1-Month Change %',
  month3ChangePercent: '3-Month Change %',
  month6ChangePercent: '6-Month Change %',
  nextDividendDate: 'Next Dividend Date',
  nextEarningsDate: 'Next Earnings Date',
  peHigh: 'High P/E Ratio',
  peLow: 'Low P/E Ratio',
  peRatio: 'P/E Ratio',
  pegRatio: 'PEG Ratio',
  priceToBook: 'Price to Book',
  priceToSales: 'Price to Sales',
  profitMargin: 'Profit Margin',
  putCallRatio: 'Put/Call Ratio',
  revenue: 'Revenue',
  revenuePerEmployee: 'Revenue per Employee',
  revenuePerShare: 'Revenue per Share',
  sharesOutstanding: 'Shares Outstanding',
  totalCash: 'Total Cash',
  totalRevenue: 'Total Revenue',
  ttmDividendRate: 'TTM Dividend Rate',
  ttmEPS: 'TTM EPS',
  week52change: '52-Week Change %',
  week52high: '52-Week High',
  week52highDate: '52-Week High Date',
  week52highDateSplitAdjustOnly: '52-Week High Date (Split Adjusted)',
  week52highSplitAdjustOnly: '52-Week High (Split Adjusted)',
  week52low: '52-Week Low',
  week52lowDate: '52-Week Low Date',
  week52lowDateSplitAdjustOnly: '52-Week Low Date (Split Adjusted)',
  week52lowSplitAdjustOnly: '52-Week Low (Split Adjusted)',
  year1ChangePercent: '1-Year Change %',
  year2ChangePercent: '2-Year Change %',
  year5ChangePercent: '5-Year Change %',
  ytdChangePercent: 'YTD Change %'
	};

const VictoryMasterContainer = createContainer("voronoi", "cursor");

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

function formatSummaryItem(item){
	let typeItem = typeof item

	if (typeItem === 'string'){
		return item
	}else if (typeItem === 'number'){
		if (Number.isInteger(item)){
			return commarize(item, 1e3)
		}else{
			return item.toFixed(2)
		}
	} else {return 'N/A'}};

function SummaryItem(props) {
	return (
	<Grid item>
	<Stack 
		direction='column' 
		justifyContent='center' 
		alignItems='center' 
		sx={{p: '0.75vw'}}
		>
		<Box sx={{color: pallete.lightGrey}}>
			{props.title}
		</Box>
		<Box sx={{color: pallete.white}}>
			{props.value}
		</Box>
	</Stack>
	</Grid>
	)};

function CompanyProfile ({data, vw, width, height, breakpoint}) {
	if (data===undefined) {
		return <Skeletonw sx={{...height, ...gwr(vw, 0.3, 0.95)}}/>
	};

 return (
 	<Grid item lg={breakpoint.lg} xs={breakpoint.xs} >
	<Stack 
		direction='column' alignItems='center'
		sx={{...height, ...width, bgcolor: style.defaults.foregroundDark, color: style.defaults.fontcolor, borderRadius: '0.5vw', mt: vw?('3%'):(0), ...fsr(0.8, 0.9), overflow: 'auto'}}>
		<Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 1, pt: '1.5%', pb: '1.5%', borderTopRightRadius: '0.5vw', borderTopLeftRadius: '0.5vw'}}>
			Company Profile
		</Box>
		<Box sx={{width: '90%', pl: '2.5%', pr: '2.5%'}}>
			{data}
		</Box>
	</Stack>
	</Grid>
	)};

function Summary ({data, vw, width, height, breakpoint}) {
	const [expanded, setExpanded] = React.useState(false)
	if (data===undefined) {
		return <Skeletonw sx={{...height, ...gwr(vw, 0.67, 0.95)}}/>
	};

	data = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, formatSummaryItem(value)]))
	return (
		<Grid item lg={breakpoint.lg} xs={breakpoint.xs} >
			<Stack direction='row' sx={{position: 'relative', ...height, ...width, bgcolor: style.defaults.foregroundDark, color: style.defaults.fontcolor, borderRadius: '0.5vw', mt: '1.5%'}}>
				<Grid container justifyContent='space-around' sx={{height: 1, overflow: 'auto'}}>
					{expanded?(
						Object.keys(data).map((key, idx) => <SummaryItem key={idx} title={keyMap[key]} value={data[key]}/>)
					):(
						Object.keys(summaryKeyMap).map((key, idx) => <SummaryItem key={idx} title={summaryKeyMap[key]} value={data[key]}/>)
					)}
				</Grid>
				<IconButton onClick={()=>setExpanded(!expanded)}>
					<ExpandMore sx={{color: style.defaults.fontcolor}}/>
				</IconButton>
			</Stack>
		</Grid>
	)};

function Headline ({vw, item, idx}) {
	return (
		<Stack 
			key={'headline' + String(idx)} 
			direction='row' spacing='1%'
			sx={{...fsr(vw, 0.8, 0.9)}}
			>
			<Box sx={{width: '73%'}}>{item.headline}</Box>
			<Stack direction='column' spacing='1%' sx={{width: '23%', color: pallete.lightGrey, ...fsr(vw, 0.6, 0.7)}}>
				<Box>{item.source}</Box>
				<Box>{(new Date(item.date)).toDateString()}</Box>
			</Stack>
		</Stack>
	)};

function News ({data, vw, width, height, breakpoint}) {
	if (data===undefined) {
		return <Skeletonw sx={{...height, ...gwr(vw, 0.3, 0.95)}}/>
	}

	return (
		<Grid item lg={breakpoint.lg} xs={breakpoint.xs} >
		<Stack 
			direction='column' alignItems='center'
			sx={{...height, width: 1, bgcolor: style.defaults.foregroundDark, color: style.defaults.fontcolor, borderRadius: '0.5vw', overflow: 'auto'}}
			>
			<Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: 1, pt: '1.5%', pb: '1.5%', borderTopRightRadius: '0.5vw', borderTopLeftRadius: '0.5vw'}}>
				News
			</Box>
			{/*<Box sx={{width: 1, textAlign: 'center', borderTopRightRadius: '0.5vw', borderTopLeftRadius: '0.5vw'}}> News </Box>*/}
			<Stack direction='column' spacing='5%' sx={{width: '90%'}}>
				{data.map((item, idx) => <Headline item={item} idx={idx} vw={vw}/>)}
    	</Stack>
		</Stack>
		</Grid>
	)};

function ChartHeader ({vw, quote, values, handler, title, ticker}) {

	if (quote === undefined) {return null}

	return (
	<Grid container sx={{width: 1, pt: '0.5%', pb: '0.5%', borderTopRightRadius: '0.5vw', borderTopLeftRadius: '0.5vw'}}>
		<Grid item xs={9}>
			<Stack 
				direction='row' spacing='0.5vw' 
				justifyContent='space-around' alignItems='center'
				sx={{color: pallete.white, width: 1, height: 1, ...fsr(vw, 1, 0.8)}}
				>
				<Box> {ticker.toUpperCase()}             </Box>
				<Box> {title}                            </Box>
				<Box> ${quote.current.toFixed(2)}        </Box>
				<Box> {quote.abs_ret.toFixed(2)}         </Box>
				<Box> {(quote.pct_ret*100).toFixed(2)}%  </Box>
				<Box> {quote.isOpen?('OPEN'):('CLOSED')} </Box>
			</Stack>
		</Grid>
		<Grid item xs={3}>
			<Stack
				direction='row' justifyContent='space-around' 
				alignItems='center' spacing='0.5vw' 
				sx={{width: 1}}
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
						height={ghr(vw, 0.04, 0.04).height} 
						width={gwr(vw, 0.05, 0.15).width}
						label={'timeframe'} bgcolor={pallete.black}
					>
					<MenuItem value={1}>D</MenuItem>
					<MenuItem value={3}>3D</MenuItem>
					<MenuItem value={5}>W</MenuItem>
				</StyledSelect>
			</Stack>
		</Grid>
	</Grid>
	)};

function Chart ({data, vw, width, height, quote, title, ticker, breakpoint}) {
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
		return <Skeletonw sx={{...height, ...width}}/>
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
		<Grid item lg={breakpoint.lg} xs={breakpoint.xs}>
		<Stack direction='column' sx={{...width, ...height, bgcolor: style.defaults.foregroundDark, color: style.defaults.fontcolor, borderRadius: '0.5vw', ...fsr(vw, 0.9, 1)}}>
			<ChartHeader 
				quote={quote} 
				title={title} 
				ticker={ticker}
				values={params}
				handler={paramHandler}
				vw={vw}
			/>
			<Box sx={{position: 'relative'}}>
				<RangeSelector 
					value={params.range} 
					handler={(e) => paramHandler('range', e)} 
					buttonSx={{
						color: pallete.white, display: 'flex', 
						justifyContent: 'center', alignItems: 'center',
						p: '0.5vw',
						'&:hover': {textDecoration: 'underline', textDecorationColor: style.defaults.hover, cursor: 'pointer'},
						...fsr(vw, 1.15, 1.25)
					}}
					containerSx={{position: 'absolute', right: '2%', bottom: '10%', 'z-index': 3}}
					buttons={{66: '3m', 132: '6m', 264: '1y', 528: '2y', 792: '3y'}}
				/>
				<VictoryChart 
					width={chartWidth} height={chartHeight*0.9}
					domainPadding={{x: [10, chartWidth/7], y: [chartHeight/25, chartHeight/25]}}
					padding={{left: chartWidth/20, right: chartWidth/20, top: chartHeight/20, bottom: chartHeight/10}}
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
			  					y={chartHeight/20} 
			  					textAnchor='middle'
			  					style={{fontSize: chartWidth/50, fill: pallete.white }}
			  				/>
				  		):(
			  				<VictoryLabel 
			  					dy={(d) => (-d.y + chartHeight/5)} 
			  					textAnchor='middle'
			  					style={{fontSize: chartWidth/50, fill: pallete.white }}
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
							tickLabels: {fontSize: vw?(chartHeight/25):(chartHeight/30), fill: pallete.mint}, 
							axis: {stroke: pallete.mint}, 
							grid: {'stroke': '#15bd8d40', strokeWidth: 0.5}
						}}
					/>
					<VictoryAxis 
						scale='time' 
						dependentAxis 
						style={{
							tickLabels: {fontSize: vw?(chartHeight/25):(chartHeight/30), fill: pallete.mint}, 
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

export default function StockOverview ({mode, description, stats, quote, ticker, chart, news}) {
	const [vw, setVw] = React.useState(((window.innerWidth/window.innerHeight)>1))
	const [bw, setBw] = React.useState(window.innerWidth)
	
	window.addEventListener("resize", () => {
		setBw(document.documentElement.clientWidth)
		setVw(((window.innerWidth/window.innerHeight)>1))
	});
	
	if (mode === 'OVERVIEW') {
		return (
			<Grid 
				container 
				spacing={vw?('1.5%'):('3%')}
				justifyContent='center' 
				>
				<Summary vw={vw}
					data={stats}
					height={ghr(vw, 0.25, 0.25)}
					width={1}
					breakpoint={vw?({lg: 7.85, xs: 11.5}):({lg: 11.5, xs: 11.5})}
				/>
				<CompanyProfile vw={vw}
					data={description}
					height={ghr(vw, 0.25, 0.25)}
					width={1}
					breakpoint={vw?({lg: 4, xs: 11.5}):({lg: 11.5, xs: 11.5})}
				/>
				<Chart 
					height={ghr(vw, 0.53, 0.5)}
					width={gwr(vw, 0.645, 0.95)}
					quote={quote} 
					ticker={ticker}
					data={chart.stock}
					title={stats===undefined?('Loading'):(stats.companyName)} 
					vw={vw}
					breakpoint={vw?({lg: 7.85, xs: 11.5}):({lg: 11.5, xs: 11.5})}
				/>
				<News vw={vw}
					data={news}
					height={ghr(vw, 0.53, 0.4)}
					width={1}
					breakpoint={vw?({lg: 4, xs: 11.5}):({lg: 11.5, xs: 11.5})}
				/>
			</Grid>
		)
	}};


