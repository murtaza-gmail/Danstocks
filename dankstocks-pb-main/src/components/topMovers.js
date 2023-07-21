import React from 'react';
import {Box, Grid, Stack, Skeleton} from '@mui/material'
import {Loading} from '../misc/components';
import {pallete, ghr, fsr, style} from '../misc/style';

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

function TopMoverRow(props) {
	return (
		<Stack direction='row' justifyContent='space-around' width={1} sx={{borderBottom: 1, borderColor: pallete.darkMint, pt: '0.5vh', pb: '0.5vh', ...fsr(0.8, 0.7)}}>
			<Box sx={{width: '50%', textAlign: 'center', color: pallete.lightGrey}}>{props.k.toUpperCase()}</Box>
			<Box sx={{width: '50%', textAlign: 'center', color: pallete.white}}>{(props.ret*100).toFixed(1)}%</Box>
		</Stack>
	)};

export default function TopMovers({vw, data, width, height}) {
	if (data === undefined) {
		return <Skeletonw sx={{...width, ...height, bgcolor: style.defaults.foregroundLight, pb: ghr(vw, 0.05, 0.03).height}}/>
	};

	return (
		<Grid item>
		<Stack 
			direction='column'
			sx={{
				...width, ...fsr(vw, 0.9, 0.75), ...height,
				bgcolor: style.defaults.foregroundDark, 
				borderBottom: 1, 
				color: style.defaults.fontcolor,
				borderColor: style.defaults.accentLight, 
				borderRadius: '0.5vw',
				overflow: 'auto'
			}}
			>
			<Stack 
				direction='row' justifyContent='space-around' alignItems='center'
				sx={{
					width: 1, 
					borderTopRightRadius: '0.5vw', 
					borderTopLeftRadius: '0.5vw',
					pt: '1.5%', pb: '1.5%'
				}}
				>
				<Box> Top Losers </Box>
				<Box> Top Gainers </Box>
			</Stack>

			<Stack direction='row' sx={{width: 1}}>
				<Stack 
					direction='column' 
					sx={{width: '50%'}} 
					alignItems='center'
					>
					{Object.keys(data.top).map((k, idx) => 
						<TopMoverRow key={'b' + String(idx)} k={k} ret={data.top[k]}/>
					)}
				</Stack>
				<Stack 
					direction='column' 
					sx={{width: '50%'}} 
					alignItems='center'
					>
					{Object.keys(data.bot).map((k, idx) => 
						<TopMoverRow key={'t' + String(idx)} k={k} ret={data.bot[k]}/>
					)}
				</Stack>
			</Stack>
		</Stack>
		</Grid>
	)};

