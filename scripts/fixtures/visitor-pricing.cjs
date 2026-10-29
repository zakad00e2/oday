// Independent prices: deliberately not an exchange-rate conversion.
const translations = (ar, en, extra = {}) => ['ar', 'en'].map(language => ({ language, name: language === 'ar' ? ar : en, ...extra }));
const hotel = {
  id: 'verification-hotel', destination: 'SHARM_EL_SHEIKH', initial_price: '100.25', initial_price_egp: '1500.75', original_price: '120.50', original_price_egp: '2000.50', is_discounted: true, discount_percentage: '10', stars: 'FIVE', rating: 'TOP_RATED', meal_plan: 'BREAKFAST_ONLY',
  translations: ['ar', 'en'].map(language => ({ language, name: language === 'ar' ? 'فندق التحقق' : 'Verification Hotel', slug: 'verification-hotel', description: 'Local browser verification hotel', Facilities: ['Wi-Fi'] })),
  assets: [{ id: 'hotel-main', kind: 'HOTEL_MAIN_IMAGE', url: 'https://ik.imagekit.io/verification/hotel.jpg' }],
  rooms: [{ id: 'room-a', capacity: '2', price: '100.25', price_egp: '1500.75', translations: translations('غرفة التحقق', 'Verification Room', { description: 'Two guests' }) }],
  addons: [{ id: 'hotel-addon', price: '10.50', price_egp: '125.25', translations: translations('إفطار التحقق', 'Verification Breakfast', { description: 'Breakfast' }) }],
};
const trip = {
  id: 'verification-trip', slug: 'verification-trip', city: 'SHARM_EL_SHEIKH', price: '80.25', price_egp: '999.50', start_time: '09:00', end_time: '12:00',
  translations: ['ar', 'en'].map(language => ({ language, title: language === 'ar' ? 'رحلة التحقق' : 'Verification Trip', subtitle: 'Local fixture trip', description: 'Local browser verification trip', duration: '3 hours', facilities: ['Guide'] })),
  assets: [{ id: 'trip-main', kind: 'TRIP_MAIN_IMAGE', url: 'https://ik.imagekit.io/verification/trip.jpg' }],
  options: [{ id: 'option-a', price: '80.25', price_egp: '999.50', translations: translations('خيار التحقق', 'Verification Option', { description: 'Option description' }) }],
  addons: [{ id: 'trip-addon', price: '5.75', price_egp: '77.25', translations: translations('إضافة التحقق', 'Verification Addon', { description: 'Addon description' }) }],
};
const legacyCart = {
  hotel: null, trips: [{ slug: 'legacy-trip', titleAr: 'رحلة قديمة', titleEn: 'Legacy Trip', heroImage: '/images/hurghada.jpg', startingPrice: 50, persons: 2, travelDate: '2027-01-10', selectedOptions: [{ nameAr: 'خيار قديم', nameEn: 'Legacy option', price: 50, persons: 2 }], selectedAddOns: [{ nameAr: 'إضافة قديمة', nameEn: 'Legacy addon', price: 5, persons: 1 }] }], guests: { adults: 2, children: 0 }, nights: 3, travelDate: '2027-01-10',
};
module.exports = { hotel, trip, legacyCart };
