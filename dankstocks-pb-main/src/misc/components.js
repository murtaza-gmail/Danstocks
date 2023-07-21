import React, {useEffect, useState, useContext, useRef} from 'react';
import axios from 'axios';
import {useNavigate, useLoaderData} from 'react-router-dom';
import {Box, Stack, TextField, Button, IconButton, Link, CircularProgress, Autocomplete, MenuItem, Divider, Switch} from '@mui/material';
import {ArrowLeft, Menu, Close, Search, AccountCircle, Home, PieChart, ShowChart, PriceChange, Build, Logout} from '@mui/icons-material';
import {pallete, style, gwr, ghr, fsr} from './style';
import {logout, getRoute, validatePassword} from './utils';
import {config} from '../config';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
  useAuth, SignIn
} from "@clerk/clerk-react";
import {AuthContext} from '../AuthContext'

const links = [
	{title: 'Home', href: '/'},
	{title: 'Single Equity', href: '/stock/aapl/OVERVIEW'},
	{title: 'Portfolio', href: '/portfolio'},
	{title: 'Earnings', href: '/earnings'},
	{title: 'Account',  href: '/account'}
	];

function NavigationTray ({vw, mode, setMode, setTicker, navigate, ticker, options, route}){
	const sidebarRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Click/tap occurred outside the sidebar, so close it
        setMode(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

	if (mode === false){

		return (
		<Stack ref={sidebarRef}
			direction='column' 
			alignItems='center'
			spacing= {vw?('0.7vw'):('2.5vw')}
			sx={{
				position: 'absolute',  left: '0vw',  
				bottom: '0vw', 
				height: '100vh',  
				width: vw?('20vw'):('50vw'),
				'z-index': 10,  
				color: pallete.white, 
				bgcolor: '#00000077', 
				backdropFilter: 'blur(5px)',
			}}
			>
			<Stack direction='row' justifyContent='space-around' alignItems='center' sx={{height: '10%', width: 1}}>
				<img height={'70%'} src={require("../assets/headerImage.png")} alt='header'/>
				<IconButton sx={{p: 0, '&:hover': {bgcolor: style.defaults.hover}}}>
					<AccountCircle sx={{color: style.defaults.fontcolor, fontSize: vw?('2vw'):('5vw')}}/>
				</IconButton>
			</Stack>
			<Stack direction='row' sx={{width: '80%'}} justifyContent='space-around'>
				<Autocomplete
					disablePortal
					autoComplete
					id='tickerSearch'
					options={options}
					sx={{
						width: '80%', 
						height: vw?('7vh'):('8vh'),
						borderRadius: '5vw', 
						background: 'linear-gradient(20deg, #011d0a, #1a1a1a77)',
						'& #tickerSearch': {fontSize: vw?('1vw'):('2vw')},
  					'& .MuiInputLabel-root': {color: style.defaults.fontcolor, height: vw?('7vh'):('8vh')},
  					'& .MuiInputBase-root': {color: style.defaults.fontcolor, height: vw?('7vh'):('8vh')},
  					'& .MuiIconButton-root': {color: style.defaults.fontcolor},
  					'& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
  						bgcolor: style.select.menu_bgcolor,
  						color: style.select.menu_fontcolor,
  						'&:hover': {
							bgcolor: style.select.menuHover_bgcolor, 
							color: style.select.menuHover_fontcolor
  						}
  					}
					}}
					renderInput={(p) => <TextField {...p} label='Ticker'/>}
					onInputChange={(e, v) => setTicker(v)}
				/>
				<IconButton onClick={() => navigate(`/stock/${ticker}/OVERVIEW`)}>
					<Search sx={{color: style.defaults.fontcolor, fontSize: vw?('2vw'):('4vw')}}/>
				</IconButton>
			</Stack>
			<Stack spacing={vw?'0.5vw':'2vw'} direction='column' sx={{width: 1, height: '50%', fontSize: vw?('1vw'):('3vw')}} alignItems='center'>
				<Box sx={{width: '80%', textAlign: 'flex-start', fontSize: vw?('1vw'):('1.5vw'), color: style.defaults.secondaryFontcolor}}>MENU</Box>
				<Stack alignItems='center' onClick={() => navigate('/')} direction='row' sx={{borderRadius: '0.5vw', p: '0.5vw', bgcolor: route==='Home'?(style.defaults.accentDark):(undefined), width: '80%', '&:hover': {cursor: 'pointer', bgcolor: style.defaults.hoverSubtle}}} spacing='0.5vw'>
					<Home sx={{fontSize: vw?('1.5vw'):('4vw')}}/>
					<Box> Home </Box>
				</Stack>
				<Stack alignItems='center' onClick={() => navigate('/stock/AAPL/OVERVIEW')} direction='row' sx={{borderRadius: '0.5vw', p: '0.5vw', bgcolor: route==='Single Equity'?(style.defaults.accentDark):(undefined), width: '80%', '&:hover': {cursor: 'pointer', bgcolor: style.defaults.hoverSubtle}}} spacing='0.5vw'>
					<ShowChart sx={{fontSize: vw?('1.5vw'):('4vw')}}/>
					<Box> Single Equity </Box>
				</Stack>
				<Stack alignItems='center' onClick={() => navigate('/portfolio')} direction='row' sx={{borderRadius: '0.5vw', p: '0.5vw', bgcolor: route==='Portfolio'?(style.defaults.accentDark):(undefined), width: '80%', '&:hover': {cursor: 'pointer', bgcolor: style.defaults.hoverSubtle}}} spacing='0.5vw'>
					<PieChart sx={{fontSize: vw?('1.5vw'):('4vw')}}/>
					<Box> Portfolio </Box>
				</Stack>
				<Stack alignItems='center' onClick={() => navigate('/earnings')} direction='row' sx={{borderRadius: '0.5vw', p: '0.5vw', bgcolor: route==='Earnings'?(style.defaults.accentDark):(undefined), width: '80%', '&:hover': {cursor: 'pointer', bgcolor: style.defaults.hoverSubtle}}} spacing='0.5vw'>
					<PriceChange sx={{fontSize: vw?('1.5vw'):('4vw')}}/>
					<Box> Earnings </Box>
				</Stack>
				<Stack alignItems='center' onClick={() => navigate('/account', {replace: true})} direction='row' sx={{borderRadius: '0.5vw', p: '0.5vw', bgcolor: route==='Account'?(style.defaults.accentDark):(undefined), width: '80%', '&:hover': {cursor: 'pointer', bgcolor: style.defaults.hoverSubtle}}} spacing='0.5vw'>
					<Build sx={{fontSize: vw?('1.5vw'):('4vw')}}/>
					<Box> Account </Box>
				</Stack>
			</Stack>
		</Stack>
	)}};

function HeaderBar ({vw, route, changeTicker}) {
	const [isHidden, setIsHidden] = useState(true);
	const [ticker, setTicker] = useState('');
	const navigate = useNavigate()
	const options = ['AAPL', 'AMD', 'XOM', 'JPM', 'OXY', 'NUE', 'NVDA', 'WFC', 'MSFT', 'META', 'SNAP', 'INTC'];

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.keyCode === 27) {
				setIsHidden(true)
			}
		};

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	return (
		<Box sx={{width: '100vw', height: '9vh', display: 'flex', justifyContent: 'center'}}>
			<NavigationTray
				vw={vw}
				mode={isHidden} 
				setMode={setIsHidden}
				setTicker={setTicker}
				navigate={navigate}
				ticker={ticker}
				options={options}
				route={route}
				changeTicker={changeTicker}
			/>
			<Stack 
				direction='row' alignItems='center' justifyContent='space-between'
				sx={{width: 1, height: 1, bgcolor: style.defaults.headerBar, position: 'relative'}}
				>
				<Box sx={{pl: '1.5%'}}>
					<IconButton onClick={() => setIsHidden(!isHidden)} sx={{p: '0.2vw', '&:hover': {bgcolor: pallete.greyTransparent}}}>
						<Menu sx={{fontSize: vw?('2.5vw'):('7vw'), color: pallete.white}}/>
					</IconButton>
				</Box>

				<Box sx={{position: 'absolute', 'z-index': 2, left: '10%', bottom: '0vw'}}>
					{vw?(<img width='20%' src={require("../assets/headerImage.png")} alt='header'/>):(null)}
				</Box>

				<Stack direction='row' alignItems='center' sx={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', 'z-index': 5}}>
					<Autocomplete disablePortal autoComplete size="small" options={options}
						sx={{
							width: vw?('20vw'):('40vw'), 
							borderRadius: '5vw', 
							background: 'linear-gradient(45deg, #011d0a, #1a1a1a77)',
    					'& .MuiInputLabel-root': {color: style.defaults.fontcolor},
    					'& .MuiInputBase-root': {color: style.defaults.fontcolor},
    					'& .MuiIconButton-root': {color: style.defaults.fontcolor},
    					'& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
    						bgcolor: style.select.menu_bgcolor,
    						color: style.select.menu_fontcolor,
    						'&:hover': {
    							bgcolor: style.select.menuHover_bgcolor, 
    							color: style.select.menuHover_fontcolor
    						}
    					}
						}}
						renderInput={(p) => <TextField {...p} label='Ticker'/>}
						onInputChange={(e, v) => setTicker(v)}
					/>
					<IconButton onClick={changeTicker?(() => changeTicker(ticker)) : (() => navigate(`/stock/${ticker}/OVERVIEW`, {replace: true}))}>
						<Search sx={{color: style.defaults.fontcolor}}/>
					</IconButton>
				</Stack>

				<Box sx={{pr: '1.5%'}}>
					<UserButton/>
				</Box>
			</Stack>
		</Box>
	)};

export function BaseComponent (props) {
	const [vw, setVw] = useState(window.innerWidth/window.innerHeight>1);
	const {userId, sessionId, isLoaded, getToken} = useAuth();
	const {token, login} = useContext(AuthContext)
	
	async function roundTrip () {
		const token = await getToken();
		const cfg = {headers: {Authorization: `Bearer ${token}`}}
		const body = {sessionId: sessionId, userId: userId}

		axios.post(getRoute('clerk_auth'), body, cfg)
			.then((r) => {
				login(r.data.token, r.data.userData)
			})
			.catch((e) => console.log(e))
	}

	// Authentication workflow integration with clerk
	useEffect(() => {
		// if (isLoaded && !token) {
		// 	roundTrip()
		// }
	}, [isLoaded, token])

	window.addEventListener("resize", () => {
		setVw((window.innerWidth/window.innerHeight)>1)
	});

	function ViewContents () {
		return (
			<Stack direction='column' sx={{width: 1, height: '91vh', overflow: 'auto', bgcolor: style.defaults.background}}>
				{props.children}
				<Box sx={{height: 1, display: 'flex', alignItems: 'flex-end'}}>
					{props.footer?(<Footer vw={vw}/>):(null)}
				</Box>
			</Stack>
		)
	};

	return (
		<Stack direction='column' alignItems='center' sx={{width: '100vw', height: '100vh', bgcolor: style.defaults.background}}>
			<HeaderBar 
				vw={vw} 
				changeTicker={props.changeTicker} 
				route={props.route}
			/>
			{props.forceAuth?(
				<>
				<SignedIn>
					<ViewContents/> 
				</SignedIn>
				<SignedOut>
					<Box sx={{height: '100vh', width: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: style.defaults.background}}>
						<SignIn appearance={{
							variables: {
								colorBackground: style.defaults.foregroundDark,
								colorPrimary: style.defaults.foregroundDark,
								colorTextOnPrimaryBackground: style.defaults.accentLight,
								colorTextSecondary: style.defaults.accentLight,
								colorInputText: style.defaults.fontcolor,
								colorInputBackground: style.defaults.foregroundLight,
							},
							elements: {
								headerTitle: {color: style.defaults.accentLight},
								headerSubtitle: {color: style.defaults.fontcolor},
								socialButtonsBlockButton: {color: style.defaults.fontcolor, backgroundColor: style.defaults.foregroundLight},
								formFieldLabel: {color: style.defaults.secondaryFontcolor},
								formButtonPrimary: {backgroundColor: style.defaults.foregroundDark},
								logoBox: {height: '10vh'}
							}
						}}
						/>
					</Box>
				</SignedOut>
				</>
			):(<ViewContents/>)}
		</Stack>
	)};

export function Footer (props) {return (
  <Stack
  	direction='column' justifyContent='space-around' alignItems='space-around'
    sx={{bgcolor: pallete.black, width: 1,  mt: '1.5%', pt: '3%', ...ghr(props.vw, 0.15, 0.2),  ...fsr(props.vw, 0.8, 0.6) }}
  	>
    <Stack direction="row" justifyContent="space-around" alignItems='center'>
      <Link href="#" sx={{ color: pallete.white, textDecorationColor: pallete.midMint, maxWidth: '13%'}}> About Us </Link>
      <Link href="#" sx={{ color: pallete.white, textDecorationColor: pallete.midMint, maxWidth: '13%'}}> Products & Services </Link>
      <Link href="#" sx={{ color: pallete.white, textDecorationColor: pallete.midMint, maxWidth: '13%'}}> FAQ </Link>
      <Link href="#" sx={{ color: pallete.white, textDecorationColor: pallete.midMint, maxWidth: '13%'}}> Premium </Link>
      <Link href="#" sx={{ color: pallete.white, textDecorationColor: pallete.midMint, maxWidth: '13%'}}> Contact Us </Link>
      <Link href="#" sx={{ color: pallete.white, textDecorationColor: pallete.midMint, maxWidth: '13%'}}> Privacy Policy </Link>
      <Link href="#" sx={{ color: pallete.white, textDecorationColor: pallete.midMint, maxWidth: '13%'}}> Terms and Conditions </Link>
    </Stack>
    <Box sx={{color: pallete.lightGrey, pl: '5%', ...fsr(props.vw, 0.75, 0.55)}}>
      <p>&copy; 2023 DankStocks Inc. All rights reserved.</p>
    </Box>
  </Stack>
	)};

export function Loading (props) {return (
	<Box sx={{...props.sx, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
		<CircularProgress/>
	</Box>
	)};

function Header (props) {
	return (
		<Stack direction='row' sx={{width: '100%', height: '5vh', backgroundColor: pallete.navyBlueDark}}>
			<Box sx={{width: '20%'}}></Box>
			<Box sx={{width: '60%', fontSize: '1.4vw', color: pallete.white, display: 'flex', justifyContent: 'center', alignItems: 'center'}}> {props.title} </Box>
			<Box sx={{width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
				<IconButton 
					sx={{mr: '10%', p: '0.25vw', borderBottom: 1, borderColor: pallete.red, '&:hover': {backgroundColor: pallete.greyTransparent, border: 1, borderColor: pallete.red}}} 
					onClick={props.closeHandler}
					>
					<Close sx={{color: pallete.red, fontSize: '70%'}}/>
				</IconButton>
			</Box>
		</Stack>
	)};

export function PopUpWrapper (props) {

	if (props.mode === props.toRenderPopUp){
		return (
			<Box 
				sx={{
					position: 'absolute', 
					left: '0vw', bottom: '0vh', 
					width: '100vw', height: '100vh', 
					backgroundColor: '#1a1a1acc', 
					display: 'flex', 
					justifyContent: 'center', 
					alignItems: 'center', 
					'z-index': 20
				}}
				>
				<Stack direction='column'>
					{props.title===!undefined?(
						<Header title={props.title} closeHandler={props.onClose}/>
					):(null)}
					{props.children}
				</Stack>
			</Box>
		)
	} else {
		return null
	}};

export function RangeSelector ({buttonSx, containerSx, buttons, handler, value}) {
	return (
		<Stack 
			sx={containerSx} spacing={'1vw'}
			direction='row' alignItems='center' justifyContent='space-around'
			>
			{Object.keys(buttons).map((k, idx) => 
				<Box 
					key={idx} onClick={() => handler(k)}
					sx={{...buttonSx, textDecoration: value==k?('underline'):(undefined), textDecorationColor: style.defaults.accentLight}} 
				> {buttons[k]} </Box>
			)}
		</Stack>
	)};

export function StyledButton ({title, onClick, href, sx}) {return (
	<Box>
		<Button 
			href={href} 
			onClick={onClick} 
			variant='outlined' 
			sx={{bgcolor: pallete.black, color: pallete.white, fontSize: '0.7rem', p: '0.8vw', ...sx}}
			> 
			{title} 
		</Button>
	</Box>
	)};

export function StyledSelect ({value, handler, label, id, width, height, children}) {
	return (
		<TextField 
			value={value} onChange={handler}
			label={label} id={id} select
			sx={{width: width}}
			InputLabelProps={{
				style: {
					
					color: style.select.labelFontcolor, 
					fontSize: style.select.labelFontsize
				}
			}}
			inputProps={{style: {height: height, p: 0}}}
			SelectProps={{
				MenuProps: {sx: {
					'& .MuiMenu-paper': {
						bgcolor: style.select.menu_bgcolor,
						color: style.select.menu_fontcolor
					}, 
					'& .MuiMenuItem-root:hover': {
						bgcolor: style.select.menuHover_bgcolor, 
						color: style.select.menuHover_fontcolor
					},
					'& .Mui-selected': {
						bgcolor: style.select.menuSelected_bgcolor, 
						color: style.select.menuSelected_fontcolor
					}
				}},
				id: 'styledselect',
				sx: {
					'.MuiSvgIcon-root ': {
						fill: style.select.iconColor, 
						fontSize: style.select.iconFontsize
					},
					'& #styledselect': {
						fontSize: style.select.fontsize, 
						color: style.select.fontcolor
					},
					borderBottom: 1, 
					borderColor: style.select.borderColor, 
					width: width, 
					height: height,
					borderRadius: '0.25vw', 
					bgcolor: style.select.bgcolor, 
				}
			}}
		>
			{children}
		</TextField>
	)};

export function StyledSwitch ({sx, value, handler}) {return (
	<Switch 
		sx={{
			'& .MuiSwitch-thumb': {bgcolor: pallete.mint}, 
			'& .MuiSwitch-track': {bgcolor: pallete.black},
			...sx
		}}
		checked={value} 
		onChange={handler}
	/>
	)};

export function StyledTextfield ({id, label, value, handler, type, width}) {
	return (
		<TextField 
			autoComplete="off"
			size='small' 
			id={id} 
			label={label}
			value={value} 
			onChange={handler} 
			type={type}
			sx={{ 
				borderBottom: 1, 
				borderColor: style.textfield.borderColor, 
				width: width,
				borderRadius: '0.25vw', 
				bgcolor: style.textfield.bgcolor, 
			}}
			InputLabelProps={{style: {color: style.textfield.labelFontcolor}}} 
			inputProps={{style: {color: style.textfield.fontcolor}}}
		/>
	)};