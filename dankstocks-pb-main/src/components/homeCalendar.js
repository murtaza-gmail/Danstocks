import React from 'react';
import {Box, Grid, Stack, MenuItem, Skeleton} from '@mui/material'
import {Loading, StyledSelect} from '../misc/components';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';
import {getRoute, tickFormat, commarize} from '../misc/utils';

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function Skeletonw ({sx}) {
  return (
  	<Grid item>
    	<Stack direction='column' sx={sx} alignItems='center' justifyContent='space-around'>
    		<Stack direction='row' justifyContent='space-around' alignItems='center' sx={{width: 1, height: '5%'}}>
				<Skeleton variant="text" animation='wave' sx={{width: '50%', height: 1, bgcolor: style.defaults.foreground}} />
				<Skeleton variant="text" animation='wave' sx={{width: '20%', height: 1, bgcolor: style.defaults.foreground}}/>
				<Skeleton variant="text" animation='wave' sx={{width: '15%', height: 1, bgcolor: style.defaults.foreground}}/>
    		</Stack>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '22%', bgcolor: style.defaults.foreground}}/>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '22%', bgcolor: style.defaults.foreground}}/>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '22%', bgcolor: style.defaults.foreground}}/>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '22%', bgcolor: style.defaults.foreground}}/>
    	</Stack>
  	</Grid>
  )};

function CalendarRow(props) {
	return (
		<Stack direction='row' sx={{width: '90%', borderBottom: 1, borderColor: pallete.darkMint, pb: '0.5vh', mt: '0.5vh'}}>
			<Box sx={{width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: pallete.lightGrey}}>
				{props.tmf!==30?(
					(new Date(props.k)).toLocaleString('en-US', {weekday: 'long'})
				):(
					(new Date(props.k)).toLocaleDateString('en-US', { month: 'long', day: 'numeric'})
				)}
			</Box>
			<Box sx={{width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: pallete.white}}>
				<Grid container spacing='0.5vw'>
					{props.datum.map((d, i) => 
						<Grid key={'calRow' + String(i)} item>
							<Box> {d} </Box>
						</Grid>
					)}
				</Grid>
			</Box>
		</Stack>	
	)};

export default function HomeCalendar({vw, data, width, height}) { 
	const [timeframe, setTimeframe] = React.useState('ty')

	if (data === undefined) {
		return <Skeletonw sx={{...width, ...height, bgcolor: style.defaults.foregroundLight, pb: ghr(vw, 0.05, 0.03).height}}/>
	};

	return (
		<Grid item>
		<Stack 
			direction='column' alignItems='center'
			sx={{
				...width, 
				bgcolor: style.defaults.foregroundDark, 
				borderBottom: 1,
				borderColor: style.defaults.accentLight, 
				borderRadius: '0.5vw', 
				...fsr(vw, 0.9, 1),
				color: style.defaults.fontcolor, 
				
			}} 
			>
			<Stack 
				direction='row' alignItems='center' justifyContent='space-around'
				sx={{
					width: 1, 
					borderTopRightRadius: '0.5vw', 
					borderTopLeftRadius: '0.5vw',
					pb: '1.5%', pt: '1.5%'
				}} 
				>
				<Box>Upcoming Earnings</Box>
				<StyledSelect 
					width={gwr(vw, 0.08, 0.2)}
					height={ghr(vw, 0.04, 0.03)}
					value={timeframe} 
					handler={(e) => setTimeframe(e.target.value)} 
					>
					<MenuItem value={'ty'}>DAY</MenuItem>
					<MenuItem value={'wk'}>WEEK</MenuItem>
					<MenuItem value={'mt'}>MONTH</MenuItem>
				</StyledSelect>
			</Stack>
			<Stack sx={{width: 1}} direction='row' justifyContent='space-around'>
				<Box sx={{...fsr(0.8, 0.9),  color: style.defaults.accentLight, textAlign: 'center', width: '30%'}}>Ticker</Box>
				<Box sx={{...fsr(0.8, 0.9),  color: style.defaults.accentLight, textAlign: 'center', width: '30%'}}>Market Cap</Box>
				<Box sx={{...fsr(0.8, 0.9),  color: style.defaults.accentLight, textAlign: 'center', width: '40%'}}>Weekday</Box>
				<Box sx={{...fsr(0.8, 0.9),  color: style.defaults.accentLight, textAlign: 'center', width: '40%'}}>Date</Box>
			</Stack>
			<Stack direction='column' sx={{width: 1, ...height, overflow: 'auto'}}>
				{data[timeframe].map((item, k) => 
					<Stack sx={{width: 1}} direction='row' key={k} justifyContent='space-around'>
						<Box sx={{textAlign: 'center', width: '30%'}}>{item.ticker}</Box>
						<Box sx={{textAlign: 'center', width: '30%'}}>{commarize(item.mcap)}</Box>
						<Box sx={{textAlign: 'center', width: '40%'}}>{days[(new Date(item.next_earnings)).getDay()]}</Box>
						<Box sx={{textAlign: 'center', width: '40%'}}>{(new Date(item.next_earnings)).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</Box>
					</Stack>
				)}
			</Stack>
		</Stack>
		</Grid>
	)};
