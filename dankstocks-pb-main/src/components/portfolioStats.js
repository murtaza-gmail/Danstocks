import {useState} from 'react';
import axios from 'axios';
import {Box, Stack, Button, Grid, MenuItem, IconButton} from '@mui/material';
import {VictoryChart, VictoryAxis, VictoryCandlestick, VictoryPie, VictoryBar} from 'victory';
import CloseIcon from '@mui/icons-material/Close';
import {StyledSelect, StyledTextfield, Loading} from '../misc/components';
import {generateAuthConfig, logout, getRoute} from '../misc/utils';
import {config} from '../config';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';

const fields = [
	'alpha',
	'beta',
	'volatility',
	'correlation',
	'return',
	'quarterlyIncome',
	'yearlyIncome',
	'currentYield',
	]

const titles = {
	'alpha': 'alpha',
	'beta': 'beta',
	'volatility': 'vol',
	'correlation': 'corr',
	'return': '% ret',
	'quarterlyIncome': 'Income Q',
	'yearlyIncome': 'Income Y',
	'currentYield': 'yield',
}

function DataPoint ({vw, title, data}) {
	data = data===undefined?(0.00):(data)
	return (
		<Grid item>
		<Stack direction='column'>
			<Box sx={{textAlign: 'center', color: style.defaults.secondaryFontcolor, ...fsr(vw, 0.8, 1.2)}}>{titles[title]}</Box>
			<Box sx={{textAlign: 'center', color: style.defaults.fontcolor, ...fsr(vw, 0.9, 1.3)}}>{data.toFixed(2)}</Box>
		</Stack>
		</Grid>
		)
}

export default function PortStats ({vw, data, height, width}) {

	if (data === undefined) {
		return <Loading sx={{...height, ...width, bgcolor: pallete.black, borderRadius: '0.5vw', borderBottom: 1, borderColor: style.defaults.borderColor}}/>
	}

	return (
	
	<Grid 
		container justifyContent='space-around' alignItems='center'
		sx={{...width, ...height, bgcolor: pallete.black, borderRadius: '0.5vw', borderBottom: 1, borderColor: style.defaults.borderColor}}
		>
		{fields.map((k) => 
			<DataPoint 
				vw={vw} 
				key={k} 
				title={k} 
				data={data[k]}
			/>
		)}	
	</Grid>
	
	)};