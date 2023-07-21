import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Box, Stack, IconButton, Button, CircularProgress, Switch, MenuItem} from '@mui/material';
import {BaseComponent, StyledTextfield, StyledSelect, StyledButton, StyledSwitch} from './misc/components';
import {generateAuthConfig, logout, getRoute} from './misc/utils';
import {Logout} from '@mui/icons-material';
import {pallete, gwr, ghr, fsr, style} from './misc/style';
import {AuthContext} from './AuthContext';
import {accountData} from './mockData'

const menus = [
	'Account',
	'Subscription', 
	'Appearance', 
	// 'Watchlist',
	// 'Portfolios',
	// 'Notifications',
	];

const lowerMenus = ['about', 'support']

function Navigation ({selected, setSelected, vw, setToken}) {return (
	<Stack 
		direction='column' 
		alignItems='flex-start' 
		sx={{borderRight: 2, borderColor: pallete.mint, pl: '1%', pr: '2%', bgcolor: pallete.black}}
		>
		<Stack alignItems='flex-start' spacing='5%' direction='column' sx={{pb: '15%'}}>
			{menus.map((m) => <Box onClick={() => setSelected(m)} sx={{...fsr(vw, 1.3, 1.4), borderBottom: selected===m?(1):(0), borderColor: pallete.mint, '&:hover': {bgcolor: pallete.greyTransparent, borderRadius: '2rem'}}} key={m}>{m}</Box>)}
		</Stack>
		<Stack direction='row' sx={{width: 1}} spacing='5%' justifyContent='space-around' alignItems='center'>
			<Stack alignItems='flex-start' spacing='15%' direction='column' sx={{mb: '5%'}}>
				{lowerMenus.map((m) => <Box onClick={() => setSelected(m)} sx={{color: pallete.lightGrey, ...fsr(vw, 1, 1.2), borderBottom: selected===m?(1):(0), borderColor: pallete.mint, '&:hover': {bgcolor: pallete.greyTransparent, borderRadius: '2rem'}}} key={m}>{m}</Box>)}
			</Stack>
			<IconButton onClick={() => {logout(); setToken('')}} sx={{...fsr(vw, 0.8, 1), p: '1%', color: '#00000000', '&:hover': {bgcolor: pallete.greyTransparent, color: pallete.lightGrey}}}>
				<Logout sx={{color: pallete.mint}}/>
				logout
			</IconButton>
		</Stack>
	</Stack>
	)};

function Datapoint ({title, datum, vw}) {return (
	<Stack direction='row' spacing='5%'>
		<Box sx={{width: '35%', color: pallete.lightGrey, ...fsr(vw, 0.8, 0.9)}}>{title}</Box>
		<Box sx={{width: '65%', color: pallete.white, ...fsr(vw, 0.9, 1)}}>{datum}</Box>
	</Stack>
	)};

function RowInput (props) {return (
	<Stack direction='row' alignItems='center' spacing='5%' sx={{width: 1}}>
		<Box sx={{width: '35%', color: pallete.lightGrey, ...fsr(props.vw, 0.8, 0.9)}}>{props.title}</Box>
		<Box sx={{width: '65%', color: pallete.white, ...fsr(props.vw, 0.9, 1)}}>{props.children}</Box>
	</Stack>
	)};

function AccountMenu ({data, selected, vw, setToken}) {
	const [params, setParams] = useState({
		newPassword: '',
		password: '',
		deleteme: ''
	})

	function handler (f, v) {
		params[f] = v
		setParams({...params})
	}

	function changePassword () {
		let token = sessionStorage.getItem('dankToken')
		let body = {...params, token: token}
		const cfg = generateAuthConfig()
		axios.post(getRoute('change_password'), body, cfg)
			.then((r) => console.log(r))
			.catch((e) => console.log(e))
	}

	function deleteAccount () {
		let token = sessionStorage.getItem('dankToken')
		let body = {...params, token: token}
		const cfg = generateAuthConfig()
		axios.post(getRoute('delete_account'), body, cfg)
			.then((r) => console.log(r))
			.catch((e) => console.log(e))
	}

	if (selected === 'Account') {return (
		<>
		<Stack direction='column' spacing={'2%'} width={'95%'} sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%'}}>
			<Box sx={{width:1, textAlign: 'center', pb: '2%', ...fsr(vw, 1.3, 1.45)}}>Account Information</Box>
			<Datapoint vw={vw} title={'email'} datum={data.email}/>
			<Datapoint vw={vw} title={'username'} datum={data.username}/>
			<Datapoint vw={vw} title={'purpose'} datum={data.purpose}/>
			<Datapoint vw={vw} title={'date created'} datum={data.date_created}/>
		</Stack>
		<Stack direction='column' spacing={'2%'} width={'95%'} sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%'}}>
			<Box sx={{width:1, textAlign: 'center', ...fsr(vw, 1.3, 1.45)}}> Account Actions </Box>
			<Box sx={{pb: '2%', ...fsr(vw, 1, 1.2)}}>Change Password</Box>
			<Stack direction='row' justifyContent='space-between' width={1}>
				<StyledTextfield 
					label={'new password'} id={'newPassword'} 
					type={'password'} width={'40%'} value={params.newPassword} 
					handler={(e) => handler('newPassword', e.target.value)}
				/>
				<StyledTextfield 
					label={'current password'} id={'password'} 
					value={params.password} type={'password'} width={'40%'}
					handler={(e) => handler('password', e.target.value)}
				/>
			</Stack>
			<StyledButton onClick={changePassword} title='Change'/>
		</Stack>
		<Stack direction='column' spacing={'4%'} width={'95%'} sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%'}}>
			<Box sx={{width:1, ...fsr(vw, 1, 1.2)}}> Delete Account </Box>
			<Stack direction='column'>
				<Box sx={{...fsr(vw)}}>Type "delete account" and your password in order to delete your account.</Box>
				<Box sx={{...fsr(vw)}}>This will permanently delete your account and all your data.</Box>
			</Stack>
			<Stack direction='row' justifyContent='space-between' width={1}>
				<StyledTextfield 
					label={'delete account'} width={'40%'}
					id={'deleteme'} value={params.deleteme} 
					handler={(e) => handler('deleteme', e.target.value)}
				/>
				<StyledTextfield 
					label={'password'} width={'40%'} type={'password'} 
					id={'deletepassword'} value={params.password} 
					handler={(e) => handler('password', e.target.value)}
				/>
			</Stack>
			<StyledButton onClick={deleteAccount} title='Delete Account'/>
		</Stack>
		</>
	)}};

function SubscriptionMenu ({data, selected, vw, create_payment_link, cancelSubscription, renewHandler}) {
	

	if (selected === 'Subscription') {return (
		<>
		<Stack direction='column' spacing={'2%'} width={'95%'} 
			sx={{
				borderBottom: 1, borderColor: pallete.midMint, 
				pb: '3%', mb: '3%', pt: '3%'
			}}>
			<Box sx={{width:1, textAlign: 'center', pb: '2%', ...fsr(vw, 1.3, 1.45)}}>
				Subscription Information
			</Box>
			<Datapoint 
				vw={vw} title={'status'} 
				datum={data.status}
			/>
			<Datapoint 
				vw={vw} title={'active since'} 
				datum={data.current_period_start?(data.current_period_start):(null)}
			/>
			<Datapoint 
				vw={vw} title={'active until'} 
				datum={data.current_period_start?(data.current_period_end):(null)}
			/>
			<Datapoint 
				vw={vw} title={'renew'} 
				datum={!data.cancel_at_period_end?('Subscription will be renewed automatically'):('Subscription will not be renewed automatically')}
			/>
		</Stack>
		{data.status!=='active'?(
			<Stack direction='column' spacing={'2%'} width={'95%'} sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%'}}>
				<Box sx={{width:1, ...fsr(vw, 1, 1.2)}}> Subscribe </Box>
				<Stack direction='row' sx={{width: 1}} justifyContent='space-around' alignItems='center'>
					<Box sx={{width: '70%', textAlign: 'center', ...fsr(vw)}}>
						Dankstocks Premium
					</Box>
					<Box sx={{width: '30%', textAlign: 'center'}}>
						<StyledButton 
							title='Subscribe'
							onClick={create_payment_link}
						/>
					</Box>
				</Stack>
			</Stack>
		):(null)}

		<Stack 
			direction='column' spacing='4%' width={'95%'} 
			sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%'}}
			>
			<Box sx={{width:1, ...fsr(vw, 1, 1.2)}}> Auto-Renew </Box>
			<Stack direction='row' sx={{width: 1}} alignItems='center'>
				<Box sx={{width: '70%', textAlign: 'center', ...fsr(vw)}}>
					{data.status==='active'&&!data.cancel_at_period_end?(
						'Next Billing - ' + data.current_period_end):(null)}
					{data.status==='active'&&data.cancel_at_period_end?(
						'Subscription will not be renewed automatically.'):(null)}
					{data.status!=='active'?('-'):(null)}
				</Box>
				<Box sx={{width: '30%', textAlign: 'center'}}>
					<StyledSwitch handler={renewHandler}/>
				</Box>
			</Stack>
		</Stack>

		<Stack direction='column' spacing={'2%'} width={'95%'} sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%'}}>
			<Box sx={{width:1, ...fsr(vw, 1, 1.2)}}> Cancel </Box>
			<Stack direction='row' sx={{width: 1}} justifyContent='space-around' alignItems='center'>
				<Box sx={{width: '70%', textAlign: 'center', ...fsr(vw)}}>
					{data.status==='active'?('Cancel - Services will continue until period end'):('-')}
				</Box>
				<Box sx={{width: '30%', textAlign: 'center'}}>
					<StyledButton title='Cancel' onChange={cancelSubscription}/>
				</Box>
			</Stack>
		</Stack>
		</>
	)}};

function AppearanceMenu ({vw, data, selected, handler}) {

	if (selected === 'Appearance'){return (
		<>
		<Stack direction='column' spacing='4%' width={'95%'} sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%', pt: '3%', minWidth: '30vw'}}>
			<Box sx={{width:1, textAlign: 'center', pb: '2%', ...fsr(vw, 1.3, 1.45)}}>General</Box>
			<RowInput vw={vw} title='theme'>
				<StyledSelect width={'90%'} height={ghr(vw, 0.06, 0.04).height}
					id='theme' label='Theme' value={data.theme} 
					handler={(e) => handler('theme', e.target.value)}
					>
					<MenuItem value='Dark'>Dark</MenuItem>
					<MenuItem value='Light'>Light</MenuItem>
				</StyledSelect>
			</RowInput>
			<RowInput vw={vw} title='fontsize'>
				<StyledSelect width={'90%'} height={ghr(vw, 0.06, 0.04).height}
					id='fontsize' label='Font Size' value={data.fontsize} 
					handler={(e) => handler('fontsize', e.target.value)}
					>
					<MenuItem value='Large'>Large</MenuItem>
					<MenuItem value='Medium'>Medium</MenuItem>
					<MenuItem value='Small'>Small</MenuItem>
				</StyledSelect>
			</RowInput>
		</Stack>
		<Stack direction='column' spacing={'2%'} width={'95%'} sx={{borderBottom: 1, borderColor: pallete.midMint, pb: '3%', mb: '3%', pt: '3%'}}>
			<Box sx={{width:1, textAlign: 'center', pb: '2%', ...fsr(vw, 1.3, 1.45)}}>Charts</Box>
			<RowInput vw={vw} title='chartDefault'>
				<StyledSelect width={'90%'} height={'70%'}
					id='chartDefault' label={'Default chart mode'} value={data.chartDefault} 
					handler={(e) => handler('chartDefault', e.target.value)}
					>
					<MenuItem value='candle'>Candle</MenuItem>
					<MenuItem value='line'>Line</MenuItem>
				</StyledSelect>
			</RowInput>
			{['chartTitles','chartLabels','chartGrid','chartAxisPrice','chartAxisTime'].map((field) => 
				<RowInput vw={vw} title={field} key={'Switch_' + field}>
					<StyledSwitch 
						value={field?(data[field]):(true)} 
						handler={() => handler(field, undefined, 'switch')}
					/>	
				</RowInput>
			)}
		</Stack>
		</>

	)}};

const userData = accountData

export default function Account () {
	const {isTokenValid, token, login, logout} = useContext(AuthContext)
	// const {userData, isTokenValid, token, login, logout} = useContext(AuthContext)
	const [vw, setVw]             = useState(window.innerWidth/window.innerHeight>1);
	const [selected, setSelected] = useState('Subscription');
	const [changes, setChanges]   = useState(false);
	const [data, setData]         = useState({
		subscription: {status: true, renew: false, next_billing: '24-2-23', active_since: undefined, active_until: undefined},
		profile: {email: undefined, username: undefined, purpose: undefined, date_created: undefined},
		settings: {theme: 'Dark', fontsize: 'medium', chartTitles: true, chartLabels: true, chartDefault: 'candle', chartGrid: true, chartAxisPrice: true, chartAxisTime: true}
	});

	window.addEventListener("resize", () => {
		setVw(((window.innerWidth/window.innerHeight)>1))
	});

	function create_payment_link () {
		const cfg = generateAuthConfig(token)
		const body = {token: token}
		axios.post(getRoute('create_payment_link'), body, cfg)
			.then((r) => window.open(r.data.link, "_blank"))
			.catch((e) => console.log(e))
	};

	function settingsHandler () {
		console.log('settings handler')
	}

	function cancelSubscription () {
		console.log('cancelSubscription')
	}
	function renewHandler () {
		console.log('renewHandler')
	}

	return (
		<BaseComponent forceAuth route='Account'>
			<Stack direction='row' sx={{color: pallete.white, width: 1}}>
				<Navigation vw={vw} selected={selected} setSelected={setSelected}/>
				<Box sx={{width: 1, minHeight: '89vh', display: 'flex', justifyContent: 'center'}}>
					<Stack direction='column' alignItems='center' sx={{bgcolor: pallete.dankstocksGreyDark, minHeight: 1, pl: '5%', pr: '5%'}}>
						<AccountMenu vw={vw}
							data={data.profile}
							selected={selected}
						/>
						<SubscriptionMenu vw={vw}
							data={data.subscription}
							selected={selected}
							create_payment_link={create_payment_link}
							cancelSubscription={cancelSubscription}
							renewHandler={renewHandler}
						/>
						<AppearanceMenu vw={vw} 
							data={data.settings} 
							selected={selected} 
							handler={settingsHandler}
						/>
					</Stack>
				</Box>
			</Stack>
		</BaseComponent>
	)};