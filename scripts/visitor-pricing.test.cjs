/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};
const pricing = require('../lib/visitor-pricing.ts');
const { formatPrice } = require('../lib/currency.ts');

test('category mapping requires a deliberate valid choice', () => {
  assert.equal(pricing.getVisitorCurrency('egyptian-resident'), 'EGP');
  assert.equal(pricing.getVisitorCurrency('other'), 'USD');
  for (const value of [null, undefined, '', 'EGP', '{}']) {
    assert.equal(pricing.parseVisitorCategory(value), null);
    assert.equal(pricing.getVisitorCurrency(value), null);
  }
});
test('price parsing distinguishes missing from free and rejects invalid amounts', () => {
  for (const value of [null, undefined, '', ' ', -1, '-3', NaN, Infinity, 'bad', false, {}, '0x10']) {
    assert.equal(pricing.parsePrice(value), null);
  }
  assert.equal(pricing.parsePrice(0), 0);
  assert.equal(pricing.parsePrice('0'), 0);
  assert.equal(pricing.parsePrice('1250.75'), 1250.75);
});
test('visitor prices are independently selected without conversion or fallback', () => {
  assert.equal(pricing.resolveVisitorPrice(50.25, 1700.5, 'EGP'), 1700.5);
  assert.equal(pricing.resolveVisitorPrice(50.25, 1700.5, 'USD'), 50.25);
  assert.ok(Number.isNaN(pricing.resolveVisitorPrice(50, null, 'EGP')));
  assert.ok(Number.isNaN(pricing.resolveVisitorPrice(50, 1700, null)));
  assert.equal(pricing.resolveVisitorPrice(50, 0, 'EGP'), 0);
});
test('currency formatting preserves cents and default security-approval USD', () => {
  assert.equal(formatPrice(1250.75, 'en', 'EGP'), 'EGP 1,250.75');
  assert.equal(formatPrice(50.25, 'ar', 'USD'), '$50.25');
  assert.equal(formatPrice(50, 'en'), '$50');
  assert.ok(!formatPrice(NaN, 'en', 'EGP').includes('NaN'));
});
const hotelService = require('../lib/hotel-service.ts');
const tripService = require('../lib/trip-service.ts');
test('trip temporary slug update sends only the slug', async (t) => {
  let request;
  t.mock.method(globalThis, 'fetch', async (_url, init) => { request = init; return Response.json(tripApi); });
  await tripService.updateTripSlug('t1', 'temporary-slug');
  assert.equal(request.method, 'PATCH');
  assert.deepEqual([...request.body.entries()], [['slug', 'temporary-slug']]);
});
test('trip validation errors expose the rejected fields', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'بيانات الطلب غير صالحة', errors: [{field: 'price_egp', message: 'Invalid input'}] }, { status: 400 }));
  await assert.rejects(tripService.updateTripSlug('t1', 'temporary-slug'), /price_egp.*Invalid input/);
});
const hotelApi = { id: 'h1', destination: 'CAIRO', initial_price: '100.25', initial_price_egp: '3500.75', original_price: '120', original_price_egp: '4200', stars: 'FIVE', rating: 'UNRATED', is_discounted: true, discount_percentage: '10', rooms: [{id:'r1',capacity:'2',price:'100',price_egp:'3500'}], addons:[{id:'a1',price:'0',price_egp:'0'}] };
const tripApi = { id:'t1', slug:'test-trip',city:'CAIRO',price:'20.25',price_egp:'650.5',start_time:'08:00',end_time:'10:00',options:[{id:'o1',price:'20',price_egp:'650'}],addons:[{id:'a1',price:'0',price_egp:'0'}] };
test('API normalization carries independent nested EGP and preserves missing EGP', async (t) => {
  t.mock.method(globalThis,'fetch', async (url) => Response.json(String(url).includes('/hotel') ? hotelApi : tripApi));
  const hotel = await hotelService.getHotelById('h1');
  assert.equal(hotel.initialPriceEgp,3500.75);
  assert.equal(hotel.rooms[0].priceEgp,3500);
  assert.equal(hotel.addons[0].priceEgp,0);
  const trip = await tripService.getTripById('t1');
  assert.equal(trip.startingPriceEgp,650.5);
  assert.equal(trip.options[0].priceEgp,650);
  assert.equal(trip.addOns[0].priceEgp,0);
  delete hotelApi.initial_price_egp;
  assert.equal((await hotelService.getHotelById('h1')).initialPriceEgp,null);
  hotelApi.initial_price_egp='3500.75';
});
test('multipart hotel and trip mutations send main and nested EGP fields', async (t) => {
  const requests=[];
  t.mock.method(globalThis,'fetch',async (url,init) => {requests.push(init.body); return Response.json(String(url).includes('/hotel') ? hotelApi : tripApi);});
  const hotel=await hotelService.getHotelById('h1');
  await hotelService.createHotel(hotelService.toHotelMutationInput(hotel));
  const body=requests.find(x=>x instanceof FormData);
  assert.equal(body.get('initial_price_egp'),'3500.75');
  assert.equal(body.get('original_price_egp'),'4200');
  assert.equal(JSON.parse(body.get('rooms'))[0].price_egp,3500);
  assert.equal(JSON.parse(body.get('addons'))[0].price_egp,0);
  await tripService.createTrip({ destination:'CAIRO',slug:'test-trip',price:20.25,priceEgp:650.5,startTime:'08:00',endTime:'10:00',youtubeUrl:'',titleAr:'Trip',titleEn:'Trip',subtitleAr:'',subtitleEn:'',descriptionAr:'',descriptionEn:'',durationAr:'',durationEn:'',facilitiesAr:[],facilitiesEn:[],options:[{price:20,priceEgp:650,nameAr:'Option',nameEn:'Option',descriptionAr:'',descriptionEn:''}],addons:[{price:0,priceEgp:0,nameAr:'Free',nameEn:'Free',descriptionAr:'',descriptionEn:''}] });
  const tripBody=requests.at(-1);
  assert.equal(tripBody.get('price_egp'),'650.5');
  assert.equal(JSON.parse(tripBody.get('options'))[0].price_egp,650);
  assert.equal(JSON.parse(tripBody.get('addons'))[0].price_egp,0);
});
const { calculateHotelLineCost, calculateTripLineCost } = require('../lib/cart-pricing.ts');
const { resolveCartPrices } = require('../lib/cart-visitor-pricing.ts');
function sampleCart() { return {hotel:{slug:'h',pricePerNight:50,prices:{USD:50,EGP:2000},selectedRooms:[{id:'r',name:'Room',pricePerNight:50,prices:{USD:50,EGP:2000},count:2}],selectedAddOns:[{name:'View',price:5,prices:{USD:5,EGP:100}}]},trips:[{slug:'t',startingPrice:20,prices:{USD:20,EGP:600},selectedOptions:[{nameAr:'Boat',price:20,prices:{USD:20,EGP:600},persons:2}],selectedAddOns:[{nameAr:'Free',price:0,prices:{USD:0,EGP:0},persons:2}]}],nights:3,guests:{adults:2,children:0},travelDate:''}; }
test('cart switches currencies repeatedly without destroying raw amounts or quantities',()=>{
 const raw=sampleCart(); const original=JSON.stringify(raw);
 const egp=resolveCartPrices(raw,'EGP');
 assert.equal(calculateHotelLineCost(egp.hotel,egp.nights),12600);
 assert.equal(calculateTripLineCost(egp.trips[0],2),1200);
 const usd=resolveCartPrices(raw,'USD');
 assert.equal(calculateHotelLineCost(usd.hotel,usd.nights),330);
 assert.equal(calculateTripLineCost(usd.trips[0],2),40);
 assert.equal(JSON.stringify(raw),original);
});
test('legacy and incomplete carts cannot silently become free or partial totals',()=>{
 const raw=sampleCart(); delete raw.hotel.selectedAddOns[0].prices.EGP;
 const egp=resolveCartPrices(raw,'EGP');
 assert.ok(Number.isNaN(calculateHotelLineCost(egp.hotel,3)));
 const legacy={...sampleCart(),hotel:{slug:'legacy',pricePerNight:50},trips:[{slug:'legacy',startingPrice:20}]};
 assert.equal(calculateHotelLineCost(resolveCartPrices(legacy,'USD').hotel,3),150);
 assert.ok(Number.isNaN(calculateHotelLineCost(resolveCartPrices(legacy,'EGP').hotel,3)));
 assert.ok(Number.isNaN(calculateTripLineCost(resolveCartPrices(legacy,'EGP').trips[0],2)));
 assert.ok(Number.isNaN(calculateTripLineCost(resolveCartPrices(raw,null).trips[0],2)));
});
test('a trip without options includes its base price plus addons; unknown base stays unknown',()=>{
 assert.equal(calculateTripLineCost({startingPrice:20,selectedAddOns:[{price:5,persons:2}]},2),50);
 assert.ok(Number.isNaN(calculateTripLineCost({startingPrice:NaN,selectedAddOns:[{price:5,persons:2}]},2)));
 assert.ok(Number.isNaN(calculateTripLineCost({startingPrice:0},2)));
});
test('cart snapshots can detect stale or legacy price pairs without treating unknown as free',()=>{
 assert.equal(pricing.samePricePair(undefined,{USD:20,EGP:650}),false);
 assert.equal(pricing.samePricePair({USD:20,EGP:null},{USD:20,EGP:0}),false);
 assert.equal(pricing.samePricePair({USD:20,EGP:650},{USD:20,EGP:650}),true);
});
test('dashboard prices allow cents and explicit free amounts but reject excessive precision',()=>{
 for(const value of [0,20.25,650.5,'100.01']) assert.equal(pricing.isValidPriceInput(value),true);
 for(const value of [null,NaN,-1,0.001,'','not a price']) assert.equal(pricing.isValidPriceInput(value),false);
});
test('zero placeholder core prices cannot be hidden by a priced addon',()=>{
 assert.ok(Number.isNaN(calculateTripLineCost({startingPrice:0,selectedOptions:[{price:0,persons:1}],selectedAddOns:[{price:5,persons:1}]},1)));
 assert.ok(Number.isNaN(calculateHotelLineCost({pricePerNight:0,selectedAddOns:[{price:5}]},2)));
});
test('trip selection restoration keeps distinct IDs even when names and USD prices match',()=>{
 const { findTripSelection } = require('../lib/trip-selection.ts');
 const options=[{id:'a',nameAr:'Same option',price:20,priceEgp:500},{id:'b',nameAr:'Same option',price:20,priceEgp:800}];
 assert.equal(findTripSelection(options,{id:'b',nameAr:'Same option'}).id,'b');
 assert.equal(findTripSelection(options,{nameAr:'Same option'}).id,'a');
 assert.equal(findTripSelection(options,{id:'deleted',nameAr:'Same option'}),undefined);
});
test('admin acknowledgement must retain each submitted row independently',()=>{
 const expected=[{nameAr:'Same',price:20,priceEgp:500},{nameAr:'Same',price:30,priceEgp:500}];
 assert.equal(pricing.hasRetainedEgpPrices(expected,[{nameAr:'Same',price:20,priceEgp:500},{nameAr:'Same',price:30,priceEgp:null}]),false);
 assert.equal(pricing.hasRetainedEgpPrices(expected,[{nameAr:'Same',price:30,priceEgp:500},{nameAr:'Same',price:20,priceEgp:500}]),true);
 assert.equal(pricing.hasRetainedEgpPrices([expected[0],expected[0]],[expected[0]]),false);
});
test('discount labels follow the active independent tariff and require both same-currency amounts',()=>{
 assert.equal(pricing.getPriceDiscount(80,100),20);
 assert.equal(pricing.getPriceDiscount(1500,2000),25);
 assert.equal(pricing.getPriceDiscount(NaN,2000),null);
 assert.equal(pricing.getPriceDiscount(2000,1500),null);
});
