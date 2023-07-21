import React from 'react';
import {Box, Stack, Grid, Checkbox, IconButton} from '@mui/material'
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import {VictoryChart, VictoryBar, VictoryLine, VictoryAxis, VictoryLabel, VictoryVoronoiContainer, LineSegment}  from 'victory';
import {Close,ViewColumn,TableRows,ArrowDropDown,KeyboardBackspace, ArrowRight} from '@mui/icons-material'

import {titleMap} from './objects'
import {pallete, ghr, gwr, fsr} from '../misc/style'
import {commarize, tickFormat} from '../misc/utils'
import {Loading} from '../misc/components'

function BarChart(props) {
	const [percent, setPercent] = React.useState(false)
	let data = props.data.map((i) => ({x: (new Date(i.x)), y: i.y/1000000000}))

	if (percent) {
		data = props.data.map((i, index) => ({
			x: new Date(i.x),
  		y: index === 0 ? 0 : (i.y - props.data[index - 1].y) / props.data[index - 1].y * 100
		}));
	}

  return (
    <Box sx={{
      height: props.h, width: props.w,
      bgcolor: pallete.black, position: 'relative',
      borderRadius: '0.5vw', mb: '1vw',
      boxShadow: '0 0 0.5vw 0.5vw #121212',
      border: 1, borderColor: pallete.midMint,
    }}>
    	<Box 
    		onClick={() => setPercent(!percent)} 
    		sx={{fontSize: '75%', color: pallete.white, position: 'absolute', 'z-index': 3, top: '3%', left: '3%', p: '0.5vw', borderRadius: '5vw', backgroundColor: pallete.dankstocksGreyDark, '&:hover': {boxShadow: '0 0 0.1vw 0.5vw #050505', backgroundColor: pallete.dankstocksGrey, cursor: 'pointer'}}}
    		>
    		% chg
    	</Box>
    	<Box
    		 sx={{position: 'absolute', 'z-index': 3, top: '3%', right: '3%'}}>
				<IconButton onClick={() => props.handler('plot', {idf: props.idf, key: props.k})} sx={{p: '15%', '&:hover': {bgcolor: pallete.greyTransparent, boxShadow: '0 0 0.1vw 0.5vw #101010'}}}>
					<Close sx={{color: pallete.red, fontSize: '75%'}}/>
				</IconButton>
			</Box>
      <VictoryChart
        width={Number(props.w.replace('px', ''))}
        height={Number(props.h.replace('px', ''))}
        domainPadding={{ x: (props.w.replace('px', ''))*0.25/data.length, y: [10, 10] }}
        padding={{top: 40, bottom: 30, left: 40, right: 20}}
			  containerComponent={
			  	<VictoryVoronoiContainer 
			  		voronoiDimension='x' cursorDimension="x" voronoiBlacklist={['axis']}
			  		cursorComponent={<LineSegment style={{stroke: pallete.mint, strokeWidth: 0.5, strokeDasharray: 5}}/>}
			  		labels={(d) => {if (d.datum.y !== undefined && d.datum.y !== null){return percent?(`${d.datum.y.toFixed(2)}%`):(`${d.datum.y.toFixed(2)}B`)} else {return `${d.datum.y}`}}}
			  		labelComponent={<VictoryLabel dy={(d) => (-d.y + 60)} textAnchor='middle'style={{fontSize: 12, fill: '#ee8800' }}/>}
			  	/>
			 	}
      	>
	      <VictoryLabel
	      	scale='time' text={props.title}
	        textAnchor="middle" y={30}
	        x={Number(props.w.replace('px', ''))/2}
	        style={{ fontSize: 18, fill: '#ffffff' }}
	      />
        <VictoryAxis
					scale='time' tickFormat={tickFormat} offsetY={30}
          style={{
            axis: { stroke: '#15bd8d50', strokeWidth: 0.5 },
            tickLabels: { fontSize: 11, fill: pallete.white },
          }}
        />
        <VictoryAxis
          dependentAxis scale='time' tickFormat={(t) => percent?(`${t}%`):(`${t}B`)}
          style={{
            axis: { stroke: '#15bd8d' },
            tickLabels: { fontSize: 11, fill: pallete.white },
            grid: {stroke: '#15bd8d50', strokeWidth: 0.5}
          }} 
        />
	      <VictoryLine name='axis'
	        data={[{x: data[0].x, y: 0}, {x: data[data.length - 1].x, y: 0}]}
	        style={{ data: { stroke: pallete.white, strokeWidth: 1 } }}
	      />
        <VictoryBar
          style={{
            data: { fill: pallete.mint },
            labels: { fontSize: '1.5vw', fill: pallete.white },
          }}
          data={data}
          barWidth={(props.w.replace('px', ''))*0.25/data.length}
        />
      </VictoryChart>
    </Box>
  )};

function BarChartStack (props) {
	const total = (props.checkedList['BALANCE_SHEET'].concat(props.checkedList['INCOME'], props.checkedList['CASH_FLOW'])).length
	let h = 0
	let w = 0

	if (props.vw) {
		if (total === 1) {
			w = `${props.bw*0.45}px`
			h = `${props.bw*0.25}`
		} else {
			w = `${props.bw*0.3}px`
			h = `${props.bw*0.166}`
		}
	} else {
		w = `${props.bw*0.8}px`
		h = `${props.bw*0.3}`
	}

	return (
		<Grid container sx={{p: 0}} width={1} justifyContent='space-around'>
			{props.checkedList['BALANCE_SHEET'].map((item, idx) => 
				<Grid key={'bar_chart_' + String(idx)} item>
					<BarChart 
						data={[...props.data.charts.BALANCE_SHEET[item]].reverse()} k={item}
						h={h} w={w} title={titleMap[item]}
						handler={props.handler} idf={'BALANCE_SHEET'}
					/>
				</Grid>
			)}
			{props.checkedList['INCOME'].map((item, idx) => 
				<Grid key={'bar_chart_' + String(idx)} item>
					<BarChart 
						data={[...props.data.charts.INCOME[item]].reverse()} k={item}
						h={h} w={w} title={titleMap[item]}
						handler={props.handler} idf={'INCOME'}
					/>
				</Grid>
			)}
			{props.checkedList['CASH_FLOW'].map((item, idx) => 
				<Grid key={'bar_chart_' + String(idx)} item>
					<BarChart 
						data={[...props.data.charts.CASH_FLOW[item]].reverse()} k={item}
						h={h} w={w} title={titleMap[item]}
						handler={props.handler} idf={'CASH_FLOW'}
					/>
				</Grid>
			)}
		</Grid>
	)};

function Row(props) {
  let values = props.values;
  let idf = props.idf;
  let isOddRow = props.idx % 2 === 0;
  let rowColor = isOddRow ? pallete.dankstocksGreyDark : pallete.dankstocksGrey

  return (
    <TableRow sx={{bgcolor: rowColor, '&:hover': {bgcolor: '#3F3F3F'}}}>
    	<TableCell sx={{border: 0, p: 0, bgcolor: pallete.black}}>
    		<Checkbox 
    			checked={props.checked} 
    			onChange={() => props.handler('plot', {key: props.title, idf: idf})} 
    			sx={{
    				p: '0.3vw', color: pallete.white, 
    				'& .MuiSvgIcon-root': { fontSize: '1.5rem'}
    			}}
    		/>
    	</TableCell>
      <TableCell 
      	sx={{
      		color: pallete.white,
      		padding: '0.35rem', 
      		borderBottom: 0, 
      	}}
      	>
        {titleMap[props.title]}
      </TableCell>
      {values.map((v, idx) => (
        <TableCell key={idf + '_' + String(props.idx) + 'r' + String(idx) + 'v'}
        	sx={{
        		bgcolor: rowColor, 
        		borderBottom: 0, 
        		padding: '0.45rem', 
        		color: pallete.white,
        		textAlign: 'center'
        	}} 
        	>
          {commarize(v)}
        </TableCell>
      ))}
    </TableRow>
  )};

function DataTable(props) {
	let rows = props.data
	let mode = props.mode
	let head = rows.reportDate
	let idf = props.idf
	let hidden = props.hide[idf]

	const HeaderTitleMap = {
		'BALANCE_SHEET': 'Balance Sheet',
		'CASH_FLOW': 'Cashflow Statement',
		'INCOME': 'Income Statement'
	}

  return (
  	<Stack direction='column' 
  	 	sx={{width: mode==='row'?('32%'):('81%')}}
  		
  		>
    	<Stack direction='row' sx={{bgcolor: pallete.darkMint, borderTopRightRadius: '0.5vw', borderTopLeftRadius: '0.5vw'}}>
    		<IconButton 
    			onClick={() => props.handler('hide', {field: idf})} 
    			sx={{p: '0.05vw', '&:hover': {bgcolor: pallete.greyTransparent}}}
    			>
    			{!hidden?(
    				<ArrowDropDown sx={{color: pallete.white}}/>
    			):(
    				<ArrowRight sx={{color: pallete.white}}/>
    			)}
    		</IconButton>
    		<Box sx={{width: 1, textAlign: 'center', color: pallete.white}}>
    			{HeaderTitleMap[props.idf]}
    		</Box>
    	</Stack>
    	<Box sx={{height: hidden?(ghr(props.vw, 0.15, 0.15)):(ghr(props.vw, 0.5, 0.5)), overflow: 'auto'}}>
	    	<Table stickyHeader>
	  		  <TableHead>
	  		    <TableRow sx={{bgcolor: pallete.black}}>
				    	<TableCell sx={{border: 0, p: 0, bgcolor: pallete.black}}>
				    		<Checkbox 
				    			checked={props.checkedList[idf].length !== 0} 
				    			onChange={() => props.handler('clean', {idf: idf})} 
				    			sx={{
				    				p: '0.3vw', color: pallete.white, 
				    				'& .MuiSvgIcon-root': { fontSize: '1.5rem'}
				    			}}
				    		/>
				    	</TableCell>
	  		  		<TableCell sx={{border: 0, p: 0, bgcolor: pallete.black}}></TableCell>
	  		    	{head.map((date, idx) => 
	  		    		<TableCell 
	  		    			key={idf+'_h_'+String(idx)} 
	  		    			sx={{
	  		    				bgcolor: pallete.black, borderBottom: 0, p: 0, 
	  		    				color: pallete.mint, textAlign: "center"
	  		    			}}
	  		    			> 
	  		    			{tickFormat(new Date(date))} 
	  		    		</TableCell>
	  		    	)}
	  		    </TableRow>
	  		  </TableHead>
	  		  <TableBody>
	  		    {Object.keys(rows).filter((k) => k !== "reportDate").map((key, idx) => 
	  		  		<Row 
	  		  			key={idf+'_r_'+String(key)} vw={props.vw}
	  		  			idx={idx} idf={idf} title={key} mode={mode}
	  		  			values={rows[key]} handler={props.handler}
	  		  			checked={props.checkedList[idf].includes(key)} 
	  		  		/>
	  		   	)}
	  		  </TableBody>
    		</Table>
    	</Box>
    </Stack>
  )};

function filterObject(obj) {
	const {date, id, subkey, symbol, updated, key, filingType, fiscalDate, fiscalYear, fiscalQuarter, currency, ...rest} = obj
  return rest
	};

export default function StockFinancials (props){
	const [hide, setHide] = React.useState({'BALANCE_SHEET': false, 'CASH_FLOW': false, 'INCOME': false});
	const [checkedList, setCheckedList] = React.useState({'BALANCE_SHEET': [], 'CASH_FLOW': [], 'INCOME': []});
	const [vw, setVw] = React.useState(window.innerWidth/window.innerHeight>1.5)
	const [mode, setMode] = React.useState(window.innerWidth/window.innerHeight>1.5?('row'):('column'));
	const [bh, setBh] = React.useState(document.documentElement.clientHeight)
	const [bw, setBw] = React.useState(document.documentElement.clientWidth)
	
	window.addEventListener("resize", () => {
		if (vw !== ((window.innerWidth/window.innerHeight)>1.5)){
			setBh(document.documentElement.clientHeight)
			setBw(document.documentElement.clientWidth)
		}
		setVw(window.innerWidth/window.innerHeight>1.5)
		if (window.innerWidth/window.innerHeight<=1.5){
			setMode('column')
		}
	});

	function handler (operation, args) {
		if (operation === 'hide') {
			let field = args.field
			hide[field] = !hide[field]
			setHide({...hide})
		} else if (operation === 'plot') {
			let key = args.key
			let idf = args.idf

			if (checkedList[idf].includes(key)) {
				checkedList[idf].splice(checkedList[idf].indexOf(key), 1)
				setCheckedList({...checkedList})
			} else {
				checkedList[idf].push(key)
				setCheckedList({...checkedList})
			}
		} else if (operation === 'clean') {
			checkedList[args.idf] = []
			setCheckedList({...checkedList})
		}
	};

	if (props.mode === 'FINANCIALS' && props.data === undefined) {
		return <Loading sx={{height: '91vh', width: '100vw', bgcolor: pallete.dankstocksGreyDarkest, display: 'flex', justifyContent: 'center', alignItems: 'center'}}/>
	}

	if (props.mode === 'FINANCIALS' && props.data !== undefined) {
		let BALANCE_SHEET = props.data.tables.BALANCE_SHEET
		let CASH_FLOW = props.data.tables.CASH_FLOW
		let INCOME = props.data.tables.INCOME

		let balanceTable = filterObject(BALANCE_SHEET)
		let cashflowTable = filterObject(CASH_FLOW)
		let incomeTable = filterObject(INCOME)

		return (
			<Stack 
				direction='column' width={1} spacing='0.5vw'
				sx={{bgcolor: pallete.dankstocksGreyDarkest}}
				>
				<Box sx={{position: 'absolute', 'z-index': 2, right: '2vw', bottom: '2vw'}}>
					{mode==='row'?(
						<IconButton onClick={() => setMode('column')} sx={{p: '0.15vw', '&:hover': {bgcolor: pallete.greyTransparent}}}>
							<TableRows sx={{fontSize: '4vh', color: pallete.white}}/>
						</IconButton>
						):(
						<IconButton onClick={() => setMode('row')} sx={{p: '0.15vw', '&:hover': {bgcolor: pallete.greyTransparent}}}>
							<ViewColumn sx={{fontSize: '4vh', color: pallete.white}}/>
						</IconButton>
					)}
				</Box>
				<Box sx={{position: 'absolute', 'z-index': 2, left: '2vw', bottom: '2vw'}}>
					<IconButton onClick={() => props.setMode('OVERVIEW')} sx={{p: '0.15vw', '&:hover': {bgcolor: pallete.greyTransparent}}}>
						<KeyboardBackspace sx={{fontSize: '4vh', color: pallete.white}}/>
					</IconButton>
				</Box>

				<BarChartStack 
					data={props.data} 
					checkedList={checkedList}
					handler={handler} vw={vw}
					bw={bw} bh={bh}
				/>
				<Stack 
					direction={mode} width={1} spacing={'1.5vw'}
					alignItems={mode==='row'?('flex-start'):('center')}
					justifyContent={mode==='row'?('center'):('flex-start')}
					>
					<DataTable 
						data={balanceTable} mode={mode}
						checkedList={checkedList} idf='BALANCE_SHEET'
						hide={hide} handler={handler} vw={vw} bh={bh}
					/>
					<DataTable 
						data={cashflowTable} mode={mode}
						checkedList={checkedList} idf='CASH_FLOW'
						hide={hide} handler={handler} vw={vw} bh={bh}
					/>
					<DataTable 
						data={incomeTable} mode={mode}
						checkedList={checkedList} idf='INCOME'
						hide={hide} handler={handler} vw={vw} bh={bh}
					/>
				</Stack>
			</Stack>
		)
	}};