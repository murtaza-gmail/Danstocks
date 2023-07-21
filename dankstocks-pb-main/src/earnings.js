import {useState} from 'react';
import axios from 'axios';
import {Box, Stack, Grid, Button, MenuItem, IconButton, Checkbox} from '@mui/material';
import {Close, ArrowLeft, ArrowRight, ArrowDropDown, ArrowDropUp, TableView, CalendarMonth} from '@mui/icons-material';
import {Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell} from "@mui/material";
import {BaseComponent, StyledSelect, StyledButton, Loading} from './misc/components'
import {pallete, ghr, gwr, fsr, style} from './misc/style'
import {commarize, getFourWeekRanges} from './misc/utils'
import {config} from './config'
import {earningsData} from './mockData'

const sectors = [
	'Technology','Communication Services',
	'Consumer Cyclical','Financial Services',
	'Healthcare','Energy','Consumer Defensive',
	'Utilities','Basic Materials',
	'Industrials','Real Estate'
	];

const data = earningsData

function HeaderCell ({active, direction, sx, onClick, title, vw, orderBy, colId}) {
	return (
		<TableCell sx={{color: style.defaults.accentLight, bgcolor: style.defaults.foregroundDark, borderColor: style.defaults.accentLight}}>
		<Stack direction='row' alignItems='center'>
			<Box>{title}</Box>
			<Box>
				<IconButton onClick={onClick} sx={{p: '0.05vw', '&:hover': {bgcolor: style.defaults.hover}, bgcolor: orderBy===colId?(style.defaults.accentDark):(null)}}>
					{direction==="desc"?(
						<ArrowDropDown sx={{color: style.defaults.accentLight, ...fsr(vw, 2, 2)}}/>
					):(
						<ArrowDropUp sx={{color: style.defaults.accentLight, ...fsr(vw, 2, 2)}}/>
					)}
				</IconButton>
			</Box>
		</Stack>
		</TableCell>
	)};

function HeaderBar ({params, vw, handler, fetchData, ui, setUi}) {
	return (
		<Stack direction='row' alignItems='center' justifyContent='center' spacing='5%' sx={{bgcolor: pallete.darkMint, pt: '10px', pb: '10px', width: 1}}>
			<IconButton title={ui?('Calendar'):('Table')} sx={{p: 0, '&:hover': {bgcolor: style.defaults.hover}}} onClick={() => setUi(!ui)}>
				{ui?(<CalendarMonth sx={{color: style.defaults.fontcolor}}/>):(<TableView sx={{color: style.defaults.fontcolor}}/>)}
			</IconButton>
			<StyledSelect
				id={'marketcapLower'} label={'Min Market Cap'} 
				width={gwr(vw, 0.07, 0.17).width}
				height={ghr(vw, 0.045, 0.045).height}
				value={params.lower} bgcolor={pallete.black} 
				handler={(e) => handler('update', {field: 'lower', value: e.target.value})}
				>
				<MenuItem value={'min'}   > 10M  </MenuItem>
				<MenuItem value={10*1e6}  > 10M  </MenuItem>
				<MenuItem value={100*1e6} > 100M </MenuItem>
				<MenuItem value={1*1e9}   > 1B   </MenuItem>
				<MenuItem value={10*1e9}  > 10B  </MenuItem>
				<MenuItem value={20*1e9}  > 20B  </MenuItem>
				<MenuItem value={100*1e9} > 100B </MenuItem>
				<MenuItem value={200*1e9} > 200B </MenuItem>
			</StyledSelect>
			<StyledSelect
				id={'marketcapUpper'} label={'Max Market Cap'}
				width={gwr(vw, 0.07, 0.17).width}
				height={ghr(vw, 0.045, 0.045).height}
				value={params.upper} bgcolor={pallete.black}
				handler={(e) => handler('update', {field: 'upper', value: e.target.value})}
				>
				<MenuItem value={10*1e6}  > 10M  </MenuItem>
				<MenuItem value={100*1e6} > 100M </MenuItem>
				<MenuItem value={1*1e9}   > 1B   </MenuItem>
				<MenuItem value={10*1e9}  > 10B  </MenuItem>
				<MenuItem value={20*1e9}  > 20B  </MenuItem>
				<MenuItem value={100*1e9} > 100B </MenuItem>
				<MenuItem value={200*1e9} > 200B </MenuItem>
				<MenuItem value={'max'}   > Max  </MenuItem>
			</StyledSelect>
			<StyledButton sx={{...ghr(vw, 0.045, 0.045)}} onClick={fetchData} title='filter'/>
		</Stack>
	)};

function FilterTray (props) {
	const [open, setOpen] = useState(true);
	let params = props.params

	if (!open) {return (
		<Box onClick={() => setOpen(!open)} sx={{width: '3%', bgcolor: pallete.black, height: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', '&:hover': {bgcolor: pallete.dankstocksGreyDark}}}>
			<ArrowRight sx={{color: pallete.white}}/>
		</Box>
	)}

	function checkHandler (f) {
		if  (params.filters.includes(f)) {
			props.handler('remove', {key: params.filters.indexOf(f)})
		} else {
			props.handler('add', {value: f})
		}
	}
	
	return (
		<Stack direction='row' sx={{height: 1, ...gwr(props.vw, 0.2, 0.35), bgcolor: pallete.black}}>
			<Stack direction='column' alignItems='center' sx={{height: 1, width: '90%', bgcolor: pallete.black, borderRight: 1, borderColor: pallete.mint}}>
				<Stack justifyContent='space-around' alignItems='center' direction='row' sx={{width: 1, color: pallete.white, borderBottom: 1, borderColor: pallete.mint, pt: '0.5vw', pb: '0.5vw', mb: '0.5vw', textAlign: 'center'}}>
					<Box>Filter By Sector</Box>
					<Checkbox 
						checked={params.filters.length !== 0} 
						onChange={() => {
							if (params.filters.length !== 0) {
								props.handler('clear')
							} else {
								props.handler('fill')
							}
						}} 
						sx={{color: pallete.white, p: 0}}
					/>
				</Stack>
				{sectors.map((f, idx) => 
					<Stack 
						sx={{color: pallete.white, pb: '2%', borderBottom: 1, mb: '2%', width: '80%', borderColor: pallete.midMint, ...fsr(props.vw, 0.9, 0.8)}} 
						key={idx} direction='row' justifyContent='space-between'  alignItems='center'
						> 
						<Box> {f} </Box>
						<Checkbox 
							checked={params.filters.includes(f)} 
							onChange={() => checkHandler(f)} 
							sx={{color: pallete.white, p: 0}}
						/>
					</Stack>
				)}
			</Stack>
			<Box onClick={() => setOpen(!open)} sx={{width: '10%', height: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', '&:hover': {bgcolor: pallete.dankstocksGreyDark}}}>
				<ArrowLeft sx={{color: pallete.white}}/>
			</Box>
		</Stack>
	)};

function EarningsTable(props) {
	const [orderBy, setOrderBy] = useState("mcap");
	const [order, setOrder] = useState("asc");

	function handleSortClick (columnId) {
		const isAsc = orderBy === columnId && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(columnId);
	};

	if (props.rows === undefined) {
		return <Loading sx={{height: '80vh', width: 1, bgcolor: style.defaults.foregroundDark}}/>
	}

	let cellStyle = {color: pallete.white, pb: '0.4%', pt: '0.4%', border: 0, ...fsr(props.vw, 1, 1.1)}
	let headerStyle = {color: pallete.mint, bgcolor: pallete.black, borderColor: pallete.mint, pt: '1%', pb: '1%'}
	
  return (
  	<Box sx={{maxHeight: 1, overflow: 'auto', width: props.vw?('70%'):('95%'), borderBottom: 1}}>
    	<Table stickyHeader>
  		  <TableHead>
  		    <TableRow>
	  			<HeaderCell
						active={orderBy === "ticker"}
						direction={orderBy === "ticker" ? order : "asc"}
						onClick={() => handleSortClick("ticker")}
						title={'Ticker'} vw={props.vw} orderBy={orderBy} colId={"ticker"}
					/>
	  			<HeaderCell
						active={orderBy === "next_earnings"}
						direction={orderBy === "next_earnings" ? order : "asc"}
						onClick={() => handleSortClick("next_earnings")}
						title={'Next Earnings'} vw={props.vw} orderBy={orderBy} colId={"next_earnings"}
					/>
	  			<HeaderCell
						active={orderBy === "mcap"}
						direction={orderBy === "mcap" ? order : "asc"}
						onClick={() => handleSortClick("mcap")}
						title={'Market Cap'} vw={props.vw} orderBy={orderBy} colId={"mcap"}
					/>
	  			<HeaderCell
						active={orderBy === "sector"}
						direction={orderBy === "sector" ? order : "asc"}
						onClick={() => handleSortClick("sector")}
						title={'Sector'} vw={props.vw} orderBy={orderBy} colId={"sector"}
					/>
	  			<HeaderCell
						active={orderBy === "industry"}
						direction={orderBy === "industry" ? order : "asc"}
						onClick={() => handleSortClick("industry")}
						title={'Industry'} vw={props.vw} orderBy={orderBy} colId={"industry"}
					/>
  		  		{/*<TableCell sx={headerStyle}>Earnings</TableCell>*/}
  		  		{/*<TableCell sx={headerStyle}>Market Cap</TableCell>*/}
  		  		{/*<TableCell sx={headerStyle}>Sector</TableCell>*/}
  		  		{/*<TableCell sx={headerStyle}>Industry</TableCell>*/}
  		    </TableRow>
  		  </TableHead>
  		  <TableBody>
  		    {props.rows
  		    	.filter((item, idx) => (item.next_earnings !== null && item.next_earnings !== ''))
  		    	.map((item) => ({
  		    		...item,
  		    		next_earnings: (new Date(item.next_earnings)),
  		    	}))
  		    	.sort((a, b) => {
  		    		const isAsc = order === "asc";
  		    		return isAsc? a[orderBy] > b[orderBy]
  		    			? 1
  		    			: -1
  		    			: b[orderBy] > a[orderBy]
  		    			? 1
  		    			: -1;
  		    })
  		    	.map((item, idx) => 
  		    	<TableRow key={idx} sx={{bgcolor: idx%2==0?(pallete.black):(pallete.dankstocksGrey), border: 0}}>
  		  			<TableCell sx={cellStyle}>{item.ticker}</TableCell>
  		  			<TableCell sx={cellStyle}>{(new Date(item.next_earnings)).toLocaleDateString()}</TableCell>
  		  			<TableCell sx={cellStyle}>{commarize(item.mcap)}</TableCell>
  		  			<TableCell sx={cellStyle}>{item.sector}</TableCell>
  		  			<TableCell sx={cellStyle}>{item.industry}</TableCell>
  		    	</TableRow>
  		   	)}
  		  </TableBody>
  		</Table>
  	</Box>
  )};

function EarningsEvent ({data, vw}) {
	return (
		<Grid item>
		<Box sx={{display: 'table', p: '0.5vw', borderRadius: '0.5vw', bgcolor: style.defaults.foregroundLight, ...fsr(vw, 0.8, 0.8)}}>
			<Box sx={{mr: '15%'}}>{data.ticker}</Box>
			<Box sx={{color: style.defaults.secondaryFontcolor, ...fsr(vw, 0.6, 0.6)}}>{commarize(data.mcap)}</Box>
			<Box sx={{color: style.defaults.secondaryFontcolor, ...fsr(vw, 0.6, 0.6)}}>{(new Date(data.next_earnings)).toLocaleDateString('en-US', { month: 'long', day: 'numeric'})}</Box>
		</Box>
		</Grid>
	)};

function CalendarWeekColumn ({rows, ranges, vw, title}) {
	return (
		<Box sx={{width: vw?('23%'):(1), height: vw?(1):(undefined), bgcolor: style.defaults.foregroundDark}}>
			<Stack direction='column' sx={{width: 1, height: 1}}>
				<Box sx={{width: 1}}>week ending {title}</Box>
				<Grid container spacing='3%' sx={{p: '3%'}} justifyContent='center'>
					{rows.map((item, idx) => <EarningsEvent vw={vw} key={idx} data={item}/>)}
				</Grid>
			</Stack>
		</Box>
	)};

function EarningsCalendar({rows, vw}) {
	const ranges = getFourWeekRanges()
	console.log(ranges)

	return (
		<Stack 
			container
			direction={vw?('row'):('column')}
			spacing={!vw?('5%'):(null)}
			justifyContent={vw?('space-around'):(null)}
			
			sx={{height: 1, width: 1, color: style.defaults.fontcolor, textAlign: 'center'}}
			>
			<CalendarWeekColumn 
				ranges={ranges} vw={vw}
				rows={rows.filter((row) => (new Date(row.next_earnings) >= ranges.period1.start && new Date(row.next_earnings) < ranges.period1.end))}
				title={(ranges.period1.end).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}
			/>
			<CalendarWeekColumn 
				ranges={ranges} vw={vw}
				rows={rows.filter((row) => (new Date(row.next_earnings) >= ranges.period2.start && new Date(row.next_earnings) < ranges.period2.end))}
				title={(ranges.period2.end).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}
			/>
			<CalendarWeekColumn 
				ranges={ranges} vw={vw}
				rows={rows.filter((row) => (new Date(row.next_earnings) >= ranges.period3.start && new Date(row.next_earnings) < ranges.period3.end))}
				title={(ranges.period3.end).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}
			/>
			<CalendarWeekColumn 
				ranges={ranges} vw={vw}
				rows={rows.filter((row) => (new Date(row.next_earnings) >= ranges.period4.start && new Date(row.next_earnings) < ranges.period4.end))}
				title={(ranges.period4.end).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}
			/>	
		</Stack>
	)};

export default function Earnings (props) {
	const [tray, setTray]           = useState(true);
	const [params, setParams]       = useState({
		default_: false,
		filters: [],
		lower: 10*1e9,
		upper: 100*1e9,
	});
	const [data_, setData]           = useState(undefined);
	const [timeframe, setTimeframe] = useState('w');
	const [fetched, setFetched]     = useState(false);
	const [vw, setVw]               = useState((window.innerWidth/window.innerHeight)>1);
	const [ui, setUi]               = useState(true);

	window.addEventListener("resize", () => {
		setVw((window.innerWidth/window.innerHeight)>1.35)
	});
	
	function handler (operation, args) {
		if (operation === 'add') {
			params.filters.push(args.value)
			
		} else if (operation === 'remove') {
			params.filters.splice(args.key, 1)
			
		} else if (operation === 'update') {
			params[args.field] = args.value
			
		} else if (operation === 'clear') {
			params.filters = []

		} else if (operation === 'fill') {
			params.filters = sectors
		}

		setParams({...params})
	};

	function fetchData () {
		params['default_'] = (
			params.lower === 10*1e9 && 
			params.upper === 100*1e9 &&
			(params.filters === sectors || 
			params.filters.length === 0))

		setParams({...params})

		axios.post(`${config.backend_suffix}/earnings_calendar`, params)
			.then((r) => {setData(r.data)})
			.catch((e) => {console.log(e)})
	};

	if (fetched === false) {
		setFetched(true)
		// fetchData()
	};

	return (
		<BaseComponent route='Earnings'>
			<Stack direction='row' justifyContent='center' sx={{width: '100vw', bgcolor: style.defaults.background}}>
				<FilterTray vw={vw} params={params} handler={handler}/>
				<Stack alignItems='center' direction='column' sx={{...gwr(vw, 0.8, 0.65), minHeight: '91vh'}}>
					<HeaderBar vw={vw}
						params={params} 
						handler={handler} 
						timeframe={timeframe} 
						setTimeframe={setTimeframe} 
						fetchData={fetchData}
						ui={ui} setUi={setUi}
					/>
					{ui?(<EarningsTable rows={data} vw={vw}/>):(null)}
					{!ui?(<EarningsCalendar rows={data} vw={vw}/>):(null)}
				</Stack>
			</Stack>
		</BaseComponent>
	)
}