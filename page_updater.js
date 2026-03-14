const fs = require('fs');

let content = fs.readFileSync('app/hotels/[slug]/page.tsx', 'utf8');

const addonDataStr = 
const hotelAddOnsData = [
    { id: "sea_view", name: "ÅØáÇáÉ ÈÍÑíÉ", price: 40, icon: "??" },
    { id: "pool_view", name: "ÅØáÇáÉ ãÓÈÍ", price: 20, icon: "??" },
    { id: "first_row", name: "ÕÝ Ãæá Úáì ÇáÈÍÑ", price: 60, icon: "??" }
];

export default function HotelDetailPage() {;
content = content.replace('export default function HotelDetailPage() {', addonDataStr);

const stateBlockOld =     const [selectedRoom, setSelectedRoom] = useState(0);
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })();
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);
    const [savedRoom, setSavedRoom] = useState<number | null>(null);
    const [savedCheckIn, setSavedCheckIn] = useState<string | null>(null);
    const [savedCheckOut, setSavedCheckOut] = useState<string | null>(null);;

const stateBlockNew =     const [selectedRoom, setSelectedRoom] = useState(0);
    const [roomsCount, setRoomsCount] = useState(1);
    const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })();
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);
    const [savedRoom, setSavedRoom] = useState<number | null>(null);
    const [savedRoomsCount, setSavedRoomsCount] = useState<number | null>(null);
    const [savedAddOns, setSavedAddOns] = useState<Set<string> | null>(null);
    const [savedCheckIn, setSavedCheckIn] = useState<string | null>(null);
    const [savedCheckOut, setSavedCheckOut] = useState<string | null>(null);

    // Initialize state from cart if it's already in the cart
    useEffect(() => {
        if (isInCart && cart.hotel) {
            if (cart.hotel.roomName) {
                const roomIndex = hotel?.rooms.findIndex(r => r.name === cart.hotel?.roomName);
                if (roomIndex !== undefined && roomIndex !== -1) setSelectedRoom(roomIndex);
                if (cart.hotel.roomsCount) setRoomsCount(cart.hotel.roomsCount);
            }
            if (cart.hotel.selectedAddOns) {
                const addOnsSet = new Set<string>();
                cart.hotel.selectedAddOns.forEach(cartAddon => {
                    const found = hotelAddOnsData.find(a => a.name === cartAddon.name);
                    if (found) addOnsSet.add(found.id);
                });
                setSelectedAddOns(addOnsSet);
            }
        }
    }, [isInCart, cart.hotel, hotel?.rooms]);;

content = content.replace(stateBlockOld, stateBlockNew);

const changesBlockOld =     const hasChanges = Boolean(
        isInCart && (
            (savedRoom !== null ? selectedRoom !== savedRoom : hotel?.rooms[selectedRoom].price !== cart.hotel?.pricePerNight) ||
            (savedCheckIn !== null && checkIn !== savedCheckIn) ||
            (savedCheckOut !== null ? checkOut !== savedCheckOut : nights !== cart.nights)
        )
    );;

const changesBlockNew =     const isAddOnsChanged = () => {
        if (!isInCart) return false;
        
        const currentAddOnIds = Array.from(selectedAddOns).sort().join(',');
        
        if (savedAddOns !== null) {
            return currentAddOnIds !== Array.from(savedAddOns).sort().join(',');
        }
        
        const cartAddOnIds = (cart.hotel?.selectedAddOns?.map(a => a.name) || []).sort().join(',');
        const currentAddOnNames = Array.from(selectedAddOns).map(id => hotelAddOnsData.find(a => a.id === id)?.name).sort().join(',');
        
        return currentAddOnNames !== cartAddOnIds;
    };

    const hasChanges = Boolean(
        isInCart && (
            (savedRoom !== null ? selectedRoom !== savedRoom : hotel?.rooms[selectedRoom].price !== cart.hotel?.pricePerNight) ||
            (savedRoomsCount !== null ? roomsCount !== savedRoomsCount : roomsCount !== (cart.hotel?.roomsCount || 1)) ||
            (savedCheckIn !== null && checkIn !== savedCheckIn) ||
            (savedCheckOut !== null ? checkOut !== savedCheckOut : nights !== cart.nights) ||
            isAddOnsChanged()
        )
    );;

content = content.replace(changesBlockOld, changesBlockNew);

const priceBlockOld =     const room = hotel.rooms[selectedRoom];
    const totalPrice = room.price * nights;;

const priceBlockNew =     const room = hotel.rooms[selectedRoom];
    const basePriceTotal = room.price * nights * roomsCount;
    const addonsPriceTotal = Array.from(selectedAddOns).reduce((sum, id) => {
        const addon = hotelAddOnsData.find(a => a.id === id);
        return sum + (addon ? addon.price * nights * roomsCount : 0);
    }, 0);
    const totalPrice = basePriceTotal + addonsPriceTotal;;

content = content.replace(priceBlockOld, priceBlockNew);

const dispatchOld =                                         setHotel({
                                            id: hotel.id,
                                            slug: hotel.slug,
                                            name: hotel.name,
                                            city: hotel.city,
                                            image: hotel.image,
                                            pricePerNight: room.price,
                                            stars: hotel.stars,
                                        });
                                        setNights(nights);
                                        setSavedRoom(selectedRoom);
                                        setSavedCheckIn(checkIn);
                                        setSavedCheckOut(checkOut);;

const dispatchNew  =                                         setHotel({
                                            id: hotel.id,
                                            slug: hotel.slug,
                                            name: hotel.name,
                                            city: hotel.city,
                                            image: hotel.image,
                                            pricePerNight: room.price,
                                            stars: hotel.stars,
                                            roomsCount: roomsCount,
                                            roomName: room.name,
                                            selectedAddOns: Array.from(selectedAddOns).map(id => {
                                                const addon = hotelAddOnsData.find(a => a.id === id);
                                                return addon ? { name: addon.name, price: addon.price } : null;
                                            }).filter(Boolean) as { name: string, price: number }[],
                                        });
                                        setNights(nights);
                                        setSavedRoom(selectedRoom);
                                        setSavedRoomsCount(roomsCount);
                                        setSavedAddOns(new Set(selectedAddOns));
                                        setSavedCheckIn(checkIn);
                                        setSavedCheckOut(checkOut);;

content = content.replace(dispatchOld, dispatchNew);


fs.writeFileSync('app/hotels/[slug]/page.tsx.tmp1', content);
