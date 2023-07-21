import React from 'react';
import {Box, Grid, Stack, MenuItem, Skeleton} from '@mui/material'
import {Loading, StyledSelect} from '../misc/components';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';

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
    		<Skeleton variant="rounded" animation='wave' sx={{width: '96%', height: '90%', bgcolor: style.defaults.foreground}} />
    	</Stack>
  	</Grid>
  )};

function SectorRow(props) {
	return (
		<Stack direction='row' width={1} justifyContent='center' sx={{borderBottom: 1, borderColor: pallete.darkMint, pt: '0.5vh', pb: '0.5vh', ...fsr(props.vw, 0.8, 0.7)}}>
			<Box sx={{width: '80%', color: pallete.lightGrey, pl: '5%'}}>{props.k}</Box>
			<Box sx={{width: '20%', color: pallete.white, pr: '5%'}}>{(props.datum*100).toFixed(2)}%</Box>
		</Stack>
	)};

export default function SectorBreakdown({vw, data, width, height}) { 
	const [timeframe, setTimeframe] = React.useState('current')

	if (data === undefined) {
		return <Skeletonw sx={{...width, ...height, bgcolor: style.defaults.foregroundLight, pb: ghr(vw, 0.05, 0.03).height}}/>
	}

	return (
		<Grid item>
		<Stack 
			direction='column'
			sx={{
				...width, ...fsr(vw, 0.85, 0.75), ...height,
				bgcolor: style.defaults.foregroundDark, 
				borderBottom: 1, 
				color: style.defaults.fontcolor,
				borderColor: style.defaults.accentLight, 
				borderRadius: '0.5vw',
				
			}}
			>
			<Stack 
				direction='row' alignItems='center' justifyContent='space-around'
				sx={{
					width: 1, 
					borderTopLeftRadius: '0.5vw',
					borderTopRightRadius: '0.5vw',
					pt: '1.5%', pb: '1.5%'
					}} 
				>
				<Box>Sector Breakdown</Box>
				<StyledSelect 
					width={gwr(vw, 0.08, 0.17)}
					height={ghr(vw, 0.04, 0.04)}
					value={timeframe} 
					handler={(e) => setTimeframe(e.target.value)} 
					id='sectorBreakdown' 
					bgcolor={pallete.black}
					>
					<MenuItem value='current'>DAY</MenuItem>
					<MenuItem value='7'>WEEK</MenuItem>
					<MenuItem value='30'>MONTH</MenuItem>
					<MenuItem value='90'>3 MONTHS</MenuItem>
					<MenuItem value='365'>YEAR</MenuItem>
				</StyledSelect>
			</Stack>
			<Stack sx={{height: 1, overflow: 'auto'}}>
				{Object.keys(data[timeframe]).map((k) => {return (
					<SectorRow vw={vw} datum={data[timeframe][k]} key={k} k={k}/>
				)})}
			</Stack>
		</Stack>
		</Grid>
	)};
