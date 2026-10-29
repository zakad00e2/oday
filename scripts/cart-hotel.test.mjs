import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as hotelPricing from '../lib/cart-hotel.ts';

test('each upgrade is charged only for its assigned rooms and nights', () => {
  const hotel = {
    pricePerNight: 100, roomsCount: 3,
    selectedAddOns: [
      { name: 'Sea view', price: 20, count: 1 },
      { name: 'Pool view', price: 10, count: 2 },
    ],
  };
  assert.equal(hotelPricing.getCartHotelAddOnsCost(hotel, 4), 160);
});

test('legacy upgrades without counts still apply to all booked rooms', () => {
  assert.equal(hotelPricing.getCartHotelAddOnsCost({
    pricePerNight: 100, roomsCount: 3,
    selectedAddOns: [{ name: 'Sea view', price: 20 }],
  }, 2), 120);
});

test('reducing booked rooms trims upgrade allocations to the available rooms', () => {
  assert.deepEqual(hotelPricing.limitHotelAddOnCounts({ sea: 1, pool: 2 }, 2), { sea: 1, pool: 1 });
  assert.deepEqual(hotelPricing.limitHotelAddOnCounts({ sea: 1, pool: 2 }, 0), {});
  assert.deepEqual(hotelPricing.limitHotelAddOnCounts({ sea: 1, pool: 1 }, 3), { sea: 1, pool: 1 });
});

test('upgrade quantities are whole nonnegative room counts', () => {
  assert.deepEqual(hotelPricing.limitHotelAddOnCounts({ sea: -1, pool: 1.9, suite: Infinity }, 3), { pool: 1 });
  assert.equal(hotelPricing.getCartHotelAddOnCount({ name: 'Sea', price: 20, count: 8 }, 2), 2);
  assert.equal(hotelPricing.getCartHotelAddOnCount({ name: 'Sea', price: 20, count: 0 }, 2), 0);
});

test('upgrade pricing follows selected room types and permits rooms without upgrades', () => {
  const hotel = {
    selectedRooms: [
      { id: 'standard', name: 'Standard', pricePerNight: 100, count: 2 },
      { id: 'family', name: 'Family', pricePerNight: 150, count: 1 },
    ],
    selectedAddOns: [{ name: 'Sea view', price: 20, count: 1 }],
  };
  assert.equal(hotelPricing.getCartHotelBaseCost(hotel, 2), 700);
  assert.equal(hotelPricing.getCartHotelAddOnsCost(hotel, 2), 40);
  assert.equal(hotelPricing.getCartHotelAddOnsCost({
    selectedRooms: [], selectedAddOns: hotel.selectedAddOns,
  }, 2), 0);
});
