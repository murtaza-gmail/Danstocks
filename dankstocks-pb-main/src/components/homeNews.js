import React from 'react';
import {Box, Grid, Stack, MenuItem, Skeleton} from '@mui/material'
import {Loading, StyledSelect} from '../misc/components';
import {pallete, ghr, gwr, fsr, style} from '../misc/style';
import {getRoute, tickFormat, commarize} from '../misc/utils';

function Skeletonw ({sx}) {
  return (
  	<Grid item>
    	<Stack direction='column' sx={sx} alignItems='center' justifyContent='space-around'>
    		<Stack direction='row' justifyContent='space-around' alignItems='center' sx={{width: 1, height: '5%'}}>
				<Skeleton variant="text" animation='wave' sx={{width: '50%', height: 1, bgcolor: style.defaults.foreground}} />
				<Skeleton variant="text" animation='wave' sx={{width: '20%', height: 1, bgcolor: style.defaults.foreground}}/>
				<Skeleton variant="text" animation='wave' sx={{width: '15%', height: 1, bgcolor: style.defaults.foreground}}/>
    		</Stack>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '20%', bgcolor: style.defaults.foreground}}/>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '20%', bgcolor: style.defaults.foreground}}/>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '20%', bgcolor: style.defaults.foreground}}/>
			<Skeleton variant="rounded" animation='wave' sx={{width: '95%', height: '20%', bgcolor: style.defaults.foreground}}/>
    	</Stack>
  	</Grid>
  )};

function ArticlePreview(props) {
  const { datum } = props;
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  const imgSx = {height: '90%', width: '20%'};
  const containerSx = {maxHeight: '20vh', width: '90%', borderBottom: 1, borderColor: pallete.darkMint, pb: '1vh', mb: '1vh'};

  return (
    <Stack direction='row' sx={containerSx} spacing={'1vw'}>
    	<img src={datum.imageUrl} alt="article" style={imgSx} />
    	<Stack direction='column' width={'75%'} height={'90%'} justifyContent='space-between'>
      	<Box sx={{height: '70%', overflow: 'ellipsis'}} >{datum.headline.replace("''", "'")}</Box>
      	<Stack direction='row' sx={{width: 1, height: '15%'}} justifyContent='space-between'>
     	 		<Box sx={{color: pallete.mint}}>
     	 			{new Date(datum.datetime).toLocaleDateString('en-US', options )} {new Date(datum.datetime).toLocaleTimeString('en-US')}
     	 		</Box>
     	 		<Box sx={{color: pallete.mint}}>
     	 			{datum.source}
     	 		</Box>
      	</Stack>
    	</Stack>
    </Stack>
  )};

export default function HomeNews({vw, data, height, width}) { 

	if (data === undefined) {
		return <Skeletonw sx={{...width, ...height, bgcolor: style.defaults.foregroundLight, pb: ghr(vw, 0.05, 0.03).height}}/>
	};

	return (
		<Grid item>
		<Stack 
			direction='column' 
			sx={{
				...height, ...width, ...fsr(vw, 0.9, 0.7), 
				bgcolor: style.defaults.foregroundDark, 
				borderBottom: 1, borderRadius: '0.5vw', 
				borderColor: style.defaults.accentLight, 
				color: style.defaults.fontcolor, 
				
				overflow: 'auto'
			}} 
			alignItems='center'
			>
			<Box 
				sx={{
					width: 1, textAlign: 'center',
					pb: '1.5%', pt: '1.5%', 
					borderTopRightRadius: '0.5vw', 
					borderTopLeftRadius: '0.5vw', 
				}}> 
				News 
			</Box>
			<Stack 
				direction='column' 
				alignItems='center' 
				width={1}
				>
				{data.map((item, idx) => 
					<ArticlePreview 
						datum={{...item, 'headline': item.headline.replace("''", "'")}} 
						key={idx}
					/>
				)}
			</Stack>
		</Stack>
		</Grid>
	)};
