export const pallete = {
	'black': '#000000',
	'white':  '#c2b9b0',
	'midMint': '#034a2d',
	'darkMint': '#011d0a',
	'dankstocksGrey': '#1C2025',
	'dankstocksGreyDark': '#0C1012',
	'dankstocksGreyDarkest': '#060809',
	'greyTransparent': '#6a6a6a99',
	'hover': '#3a3a3a55',
	'mint': '#15bd8d',
	'red': '#ff0000',
	'yellow': '#ffff00',
	'pink': '#ff00ff',
	'lightGrey': '#5a5a5a',
	'lightGreyBlue': '#2a2a35',
	'navyBlueLight': '#131232',
	'navyBlue': '#050310',
	'navyBlueMedium': '#090e18',
	'navyBlueDark': '#070515',
	'whiteTransparent': '#acacaccc',
	'greyOutOfFocus': '#1a1a1add',
	'grey': '#242324',
	'greyGreen' :'#afc4bc',
	'chartPos': '#04DA90',
	'chartNeg': '#AB0444'
}


export const style = {
	select: {
		menu_bgcolor: '#000000',
		menu_fontcolor: '#c2b9b0',
		menuHover_bgcolor: '#15bd8d',
		menuHover_fontcolor: '#c2b9b0',
		menuSelected_bgcolor: '#15bd8d',
		menuSelected_fontcolor: '#c2b9b0',
		iconColor: '#c2b9b0',
		iconFontsize: '1.3rem',
		fontsize: '0.75rem',
		fontcolor: '#c2b9b0',
		bgcolor: '#000000',
		borderColor: '#15bd8d',
		labelFontcolor: '#7a7a7a',
		labelFontsize: '0.70rem'
	},
	textfield: {
		borderColor: '#15bd8d',
		bgcolor: '#000000',
		labelFontcolor: '#7a7a7a',
		fontcolor: '#c2b9b0'
	},
	defaults: {
		fontcolor: '#c2b9b0',
		secondaryFontcolor: '#7a7a7a',
		foregroundDark: '#000000', //black
		background: '#060809', //dankstocksGreyDarkest
		foreground: '#0C1012', //dankstocksGreyDark
		foregroundLight: '#1C2025', //dankstocksGrey
		borderColor: '#15bd8d',
		accentLight: '#15bd8d',
		accent: '#023a20',
		accentDark: '#011d0a',
		hover: '#9a9a9a9a',
		hoverSubtle: '#5a5a5a5a',
		accentSelected: '#15bd8d6a',
		outOfFocus: '#15151599',
		error: '#ff0000',
		success: '#00ff00',
		headerBar: '#000000'
	}
}

export const styleLight = {
	select: {
		menu_bgcolor: '#ffffff',
		menu_fontcolor: '#4a4a4a',
		menuHover_bgcolor: '#15bd8d',
		menuHover_fontcolor: '#ffffff',
		menuSelected_bgcolor: '#15bd8d',
		menuSelected_fontcolor: '#ffffff',
		iconColor: '#4a4a4a',
		iconFontsize: '2rem',
		fontsize: '1rem',
		fontcolor: '#4a4a4a',
		bgcolor: '#ffffff',
		borderColor: '#15bd8d',
		labelFontcolor: '#7a7a7a',
		labelFontsize: '0.75rem'
	},
	textfield: {
		borderColor: '#15bd8d',
		bgcolor: '#ffffff',
		labelFontcolor: '#7a7a7a',
		fontcolor: '#4a4a4a'
	},
	defaults: {
		fontcolor: '#4a4a4a',
		secondaryFontcolor: '#7a7a7a',
		foregroundDark: '#ffffff', //white
		background: '#f2f2f2', //light grey
		foreground: '#e6e6e6', //medium grey
		foregroundLight: '#d9d9d9', //light grey
		borderColor: '#15bd8d',
		accentLight: '#15bd8d',
		accent: '#034a2d',
		accentDark: '#011d0a',
	}
}


export const styleSettings = {backgroundColor:pallete.black, width: 1, height: '16vh', borderBottom: 1, borderColor: pallete.lightGreyBlue}
export const styleDataPoints = {color: pallete.white, fontSize: '0.9rem', width: '6vw', borderRight: 1, borderColor: pallete.midMint}
export const styleDataBox = {color: pallete.white, fontSize: '0.9rem', width: '18vw'}
export const style4 = {height: 1, width: 1, pl: 1}
export const style5 = {p: 0.5, borderBottom: 1, borderColor: pallete.lightGreyBlue, color: pallete.mint, fontSize: '1.2rem', '&:hover': {borderBottom: 1, borderColor: pallete.midMint, backgroundColor: pallete.darkMint}}
export const buttonStyle = {color: pallete.white, borderColor: pallete.mint, fontSize: '0.85rem', p: 0.4, pl: 3, pr: 3}

export function fs(num){
	return `${window.innerWidth*window.devicePixelRatio*num/120}px`
};

export function gwr (vw, a, b) {
	return {
		width: vw?(
			`${a*window.devicePixelRatio*window.innerWidth/1.4}px`
		):(
			`${b*window.devicePixelRatio*window.innerWidth/1.4}px`
		)}
	};

export function ghr (vw, a, b) {
	return {
		height: vw?(
			`${a*window.devicePixelRatio*window.innerHeight/1.4}px`
		):(
			`${b*window.devicePixelRatio*window.innerHeight/1.4}px`
		)}
	};

export function fsr (desktop, a=0.8, b=1) {
	return {fontSize: desktop?(`${a}rem`):(`${b}rem`)}
	};