export default () => {
	
const priceInSlpElement = document.querySelector('input[name="slp_price"]');
const priceInVesElement = document.querySelector('input[name="ves_price"]');
const priceInUsdElement = document.querySelector('input[name="usd_price"]');

const Slp = 'SLP';
const Ves = 'VES';
const Usd = 'USD';

let slpToUsdPrice = 0;
let vesToUsdPrice = 0;

priceInSlpElement.addEventListener('input', e => updateValue(Slp, e.target.value));
priceInVesElement.addEventListener('input', e => updateValue(Ves, e.target.value));
priceInUsdElement.addEventListener('input', e => updateValue(Usd, e.target.value));

priceInSlpElement.addEventListener('blur', e => resetValues(e));
priceInVesElement.addEventListener('blur', e => resetValues(e));
priceInUsdElement.addEventListener('blur', e => resetValues(e));

const getSlpPrice = async newValue => {
	const url = 'https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion&vs_currencies=usd';
	try{
		const res = await fetch(url);
		const data = await res.json();
		slpToUsdPrice = data["smooth-love-potion"].usd;
		priceInSlpElement.value = 1;
		updateValue(Slp, priceInSlpElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}
const getVesPrice = async newValue => {
	const url = 'https://s3.amazonaws.com/dolartoday/data.json';
	try{
		const res = await fetch(url);
		const data = await res.json();
		vesToUsdPrice = data.USD.dolartoday;
		priceInSlpElement.value = 1;
		updateValue(Slp, priceInSlpElement.value);
		checkData();
	} catch (e){
		console.log(e);
	}
}

const updateValue = (currency, value) => {

	const parsedValue = value === '' ? 1 : parseFloat(value);

	if(currency === Slp){
		priceInVesElement.value =  (parsedValue * slpToUsdPrice * vesToUsdPrice).toFixed(2);
		priceInUsdElement.value = (parsedValue * slpToUsdPrice).toFixed(2);

	} else if(currency === Ves){
		priceInSlpElement.value = (parsedValue / (slpToUsdPrice * vesToUsdPrice)).toFixed(2);
		priceInUsdElement.value = (parsedValue / vesToUsdPrice).toFixed(2);

	} else if(currency === Usd){
		 priceInSlpElement.value = (parsedValue / slpToUsdPrice).toFixed(2);
		 priceInVesElement.value = (parsedValue * vesToUsdPrice).toFixed(2);
	}
}
const resetValues = e => {
	if (e.target.value === '' || parseFloat(e.target.value) === 0) {
		priceInSlpElement.value = 1;
		updateValue(Nano, 1);
	};
}

const checkData = () => {
	if (slpToUsdPrice !== 0 && vesToUsdPrice !== 0) {
		setTimeout(() => {
			document.querySelector('.card').classList.toggle('animation');
			document.querySelector('.card .card__loader').classList.toggle('card__loader--loading');
			setTimeout(() => {
				document.querySelector('.card .card__loader').style.display = 'none';
			}, 500);
		}, 500);
	}
}

getSlpPrice();
getVesPrice();
}