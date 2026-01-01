import type { Airport, Flight, Hotel, Room, Wonder, BlogPost } from "./types"

export const AIRPORTS: Airport[] = [
  // North America
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA" },
  { code: "ORD", name: "O'Hare International", city: "Chicago", country: "USA" },
  { code: "MIA", name: "Miami International", city: "Miami", country: "USA" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "USA" },
  { code: "SEA", name: "Seattle-Tacoma International", city: "Seattle", country: "USA" },
  { code: "YYZ", name: "Toronto Pearson International", city: "Toronto", country: "Canada" },
  { code: "YVR", name: "Vancouver International", city: "Vancouver", country: "Canada" },
  { code: "MEX", name: "Mexico City International", city: "Mexico City", country: "Mexico" },
  { code: "CUN", name: "Cancún International", city: "Cancún", country: "Mexico" },

  // Europe
  { code: "LHR", name: "Heathrow", city: "London", country: "UK" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France" },
  { code: "FCO", name: "Leonardo da Vinci–Fiumicino", city: "Rome", country: "Italy" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas", city: "Madrid", country: "Spain" },
  { code: "BCN", name: "Barcelona-El Prat", city: "Barcelona", country: "Spain" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
  { code: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland" },
  { code: "VIE", name: "Vienna International", city: "Vienna", country: "Austria" },

  // Asia
  { code: "PEK", name: "Beijing Capital International", city: "Beijing", country: "China" },
  { code: "PVG", name: "Shanghai Pudong International", city: "Shanghai", country: "China" },
  { code: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "China" },
  { code: "NRT", name: "Narita International", city: "Tokyo", country: "Japan" },
  { code: "HND", name: "Tokyo Haneda", city: "Tokyo", country: "Japan" },
  { code: "ICN", name: "Incheon International", city: "Seoul", country: "South Korea" },
  { code: "SIN", name: "Singapore Changi", city: "Singapore", country: "Singapore" },
  { code: "BKK", name: "Suvarnabhumi", city: "Bangkok", country: "Thailand" },
  { code: "DEL", name: "Indira Gandhi International", city: "Delhi", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai", country: "India" },

  // Middle East
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  { code: "DOH", name: "Hamad International", city: "Doha", country: "Qatar" },
  { code: "AMM", name: "Queen Alia International", city: "Amman", country: "Jordan" },
  { code: "TLV", name: "Ben Gurion", city: "Tel Aviv", country: "Israel" },
  { code: "CAI", name: "Cairo International", city: "Cairo", country: "Egypt" },

  // South America
  { code: "GIG", name: "Rio de Janeiro/Galeão International", city: "Rio de Janeiro", country: "Brazil" },
  { code: "GRU", name: "São Paulo/Guarulhos International", city: "São Paulo", country: "Brazil" },
  { code: "LIM", name: "Jorge Chávez International", city: "Lima", country: "Peru" },
  { code: "BOG", name: "El Dorado International", city: "Bogotá", country: "Colombia" },
  { code: "EZE", name: "Ministro Pistarini International", city: "Buenos Aires", country: "Argentina" },

  // Oceania
  { code: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia" },
  { code: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia" },
  { code: "AKL", name: "Auckland Airport", city: "Auckland", country: "New Zealand" },

  // Africa
  { code: "JNB", name: "O.R. Tambo International", city: "Johannesburg", country: "South Africa" },
  { code: "CPT", name: "Cape Town International", city: "Cape Town", country: "South Africa" },
  { code: "NBO", name: "Jomo Kenyatta International", city: "Nairobi", country: "Kenya" },
]

export const SEVEN_WONDERS: Wonder[] = [
  {
    id: "colosseum",
    name: "Colosseum",
    location: "Rome",
    country: "Italy",
    airport: AIRPORTS.find((a) => a.code === "FCO")!,
    description: "The largest ancient amphitheatre ever built, and the iconic symbol of Imperial Rome",
    image: "/colosseum-rome-sunset.jpg",
    timezone: "Europe/Rome",
  },
  {
    id: "great-wall",
    name: "Great Wall of China",
    location: "Beijing",
    country: "China",
    airport: AIRPORTS.find((a) => a.code === "PEK")!,
    description: "The world's longest wall and architectural marvel stretching over 13,000 miles",
    image: "/great-wall-china.jpg",
    timezone: "Asia/Shanghai",
  },
  {
    id: "petra",
    name: "Petra",
    location: "Ma'an",
    country: "Jordan",
    airport: AIRPORTS.find((a) => a.code === "AMM")!,
    description: "An archaeological city carved into rose-red cliffs, known as the 'Rose City'",
    image: "/petra-jordan.jpg",
    timezone: "Asia/Amman",
  },
  {
    id: "christ-redeemer",
    name: "Christ the Redeemer",
    location: "Rio de Janeiro",
    country: "Brazil",
    airport: AIRPORTS.find((a) => a.code === "GIG")!,
    description: "Iconic Art Deco statue overlooking Rio from atop Corcovado mountain",
    image: "/christ-redeemer-brazil.jpg",
    timezone: "America/Sao_Paulo",
  },
  {
    id: "machu-picchu",
    name: "Machu Picchu",
    location: "Cusco",
    country: "Peru",
    airport: AIRPORTS.find((a) => a.code === "LIM")!,
    description: "Incan citadel set high in the Andes Mountains, the 'Lost City of the Incas'",
    image: "/machu-picchu-peru.jpg",
    timezone: "America/Lima",
  },
  {
    id: "chichen-itza",
    name: "Chichen Itza",
    location: "Yucatán",
    country: "Mexico",
    airport: AIRPORTS.find((a) => a.code === "CUN")!,
    description: "Mayan archaeological site featuring the iconic pyramid of Kukulcán",
    image: "/chichen-itza-mexico.jpg",
    timezone: "America/Cancun",
  },
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    location: "Agra",
    country: "India",
    airport: AIRPORTS.find((a) => a.code === "DEL")!,
    description: "Ivory-white marble mausoleum, the ultimate symbol of eternal love",
    image: "/taj-mahal-india.jpg",
    timezone: "Asia/Kolkata",
  },
]

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: "FL001",
    airline: "Premium Airways",
    flightNumber: "PA610",
    departure: { airport: AIRPORTS[0], time: "2025-06-15T08:00:00" },
    arrival: { airport: AIRPORTS[5], time: "2025-06-15T22:00:00" },
    duration: 480,
    stops: 0,
    price: 650,
    class: "economy",
    available: true,
  },
  {
    id: "FL002",
    airline: "Global Connect",
    flightNumber: "GC234",
    departure: { airport: AIRPORTS[0], time: "2025-06-15T10:30:00" },
    arrival: { airport: AIRPORTS[5], time: "2025-06-16T01:15:00" },
    duration: 525,
    stops: 1,
    price: 520,
    class: "economy",
    available: true,
  },
  {
    id: "FL003",
    airline: "Sky Alliance",
    flightNumber: "SA456",
    departure: { airport: AIRPORTS[0], time: "2025-06-15T14:00:00" },
    arrival: { airport: AIRPORTS[5], time: "2025-06-16T05:30:00" },
    duration: 570,
    stops: 1,
    price: 480,
    class: "economy",
    available: true,
  },
  {
    id: "FL004",
    airline: "Elite Air",
    flightNumber: "EA611",
    departure: { airport: AIRPORTS[0], time: "2025-06-15T18:45:00" },
    arrival: { airport: AIRPORTS[5], time: "2025-06-16T08:45:00" },
    duration: 480,
    stops: 0,
    price: 720,
    class: "economy",
    available: true,
  },
  {
    id: "FL005",
    airline: "Continental Express",
    flightNumber: "CE987",
    departure: { airport: AIRPORTS[0], time: "2025-06-15T06:00:00" },
    arrival: { airport: AIRPORTS[5], time: "2025-06-15T21:30:00" },
    duration: 570,
    stops: 1,
    price: 550,
    class: "economy",
    available: true,
  },
]

export const MOCK_HOTELS: Hotel[] = [
  {
    id: "HTL001",
    name: "Hotel Colosseo",
    address: "Via Capo d'Africa 54",
    city: "Rome",
    rating: 4.5,
    images: ["/luxury-hotel-rome.png"],
    amenities: ["WiFi", "Breakfast", "Pool", "Gym", "Parking"],
    description: "Luxury hotel with stunning views of the Colosseum",
    distanceToAttraction: 0.2,
    wonderId: "colosseum",
  },
  {
    id: "HTL002",
    name: "Roma Boutique Hotel",
    address: "Via Giovanni Lanza 12",
    city: "Rome",
    rating: 4.2,
    images: ["/boutique-hotel-rome.jpg"],
    amenities: ["WiFi", "Breakfast", "Bar", "Concierge"],
    description: "Charming boutique hotel in the heart of ancient Rome",
    distanceToAttraction: 0.4,
    wonderId: "colosseum",
  },
  {
    id: "HTL003",
    name: "Grand Imperial Suite",
    address: "Via Labicana 125",
    city: "Rome",
    rating: 4.8,
    images: ["/grand-luxury-hotel-rome.jpg"],
    amenities: ["WiFi", "Breakfast", "Pool", "Spa", "Restaurant", "Gym", "Parking"],
    description: "Five-star luxury hotel with world-class amenities",
    distanceToAttraction: 0.3,
    wonderId: "colosseum",
  },
  {
    id: "HTL004",
    name: "Historic Center Inn",
    address: "Via dei Fori Imperiali 76",
    city: "Rome",
    rating: 4.0,
    images: ["/historic-hotel-rome.jpg"],
    amenities: ["WiFi", "Breakfast", "Terrace"],
    description: "Budget-friendly hotel with excellent location",
    distanceToAttraction: 0.5,
    wonderId: "colosseum",
  },
  {
    id: "HTL005",
    name: "Great Wall View Hotel",
    address: "Badaling Ancient Great Wall",
    city: "Beijing",
    rating: 4.6,
    images: ["/great-wall-china.jpg"],
    amenities: ["WiFi", "Breakfast", "Restaurant", "Gym"],
    description: "Spectacular views of the Great Wall from every room",
    distanceToAttraction: 0.5,
    wonderId: "great-wall",
  },
  {
    id: "HTL006",
    name: "Petra Moon Hotel",
    address: "Tourism Street",
    city: "Wadi Musa",
    rating: 4.4,
    images: ["/petra-jordan.jpg"],
    amenities: ["WiFi", "Breakfast", "Pool", "Restaurant"],
    description: "Traditional Jordanian hospitality near the ancient city",
    distanceToAttraction: 1.0,
    wonderId: "petra",
  },
  {
    id: "HTL007",
    name: "Copacabana Palace",
    address: "Avenida Atlântica 1702",
    city: "Rio de Janeiro",
    rating: 4.9,
    images: ["/christ-redeemer-brazil.jpg"],
    amenities: ["WiFi", "Breakfast", "Pool", "Spa", "Beach Access", "Restaurant"],
    description: "Iconic luxury hotel with views of Christ the Redeemer",
    distanceToAttraction: 3.5,
    wonderId: "christ-redeemer",
  },
]

export const MOCK_ROOMS: Room[] = [
  {
    id: "RM001",
    hotelId: "HTL001",
    type: "Deluxe Double Room",
    maxGuests: 2,
    pricePerNight: 180,
    available: true,
    amenities: ["King Bed", "City View", "Mini Bar", "Safe"],
  },
  {
    id: "RM002",
    hotelId: "HTL001",
    type: "Family Suite",
    maxGuests: 4,
    pricePerNight: 280,
    available: true,
    amenities: ["2 Double Beds", "Colosseum View", "Mini Bar", "Safe", "Living Area"],
  },
  {
    id: "RM003",
    hotelId: "HTL002",
    type: "Classic Double Room",
    maxGuests: 2,
    pricePerNight: 140,
    available: true,
    amenities: ["Queen Bed", "City View", "Safe"],
  },
  {
    id: "RM004",
    hotelId: "HTL003",
    type: "Presidential Suite",
    maxGuests: 4,
    pricePerNight: 450,
    available: true,
    amenities: ["King Bed", "Panoramic View", "Jacuzzi", "Butler Service", "Living Room"],
  },
  {
    id: "RM005",
    hotelId: "HTL004",
    type: "Standard Twin Room",
    maxGuests: 2,
    pricePerNight: 95,
    available: true,
    amenities: ["2 Single Beds", "City View"],
  },
  {
    id: "RM006",
    hotelId: "HTL005",
    type: "Deluxe Suite",
    maxGuests: 4,
    pricePerNight: 320,
    available: true,
    amenities: ["King Bed", "Great Wall View", "Mini Bar", "Safe", "Living Area"],
  },
  {
    id: "RM007",
    hotelId: "HTL006",
    type: "Luxury Room",
    maxGuests: 2,
    pricePerNight: 200,
    available: true,
    amenities: ["Queen Bed", "Petra View", "Safe"],
  },
  {
    id: "RM008",
    hotelId: "HTL007",
    type: "Oceanfront Room",
    maxGuests: 2,
    pricePerNight: 250,
    available: true,
    amenities: ["King Bed", "Beach View", "Mini Bar", "Safe"],
  },
]

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "ultimate-guide-visiting-colosseum",
    title: "The Ultimate Guide to Visiting the Colosseum",
    excerpt:
      "Everything you need to know before visiting Rome's most iconic monument, from best times to visit to insider tips for avoiding crowds.",
    content: `
# The Ultimate Guide to Visiting the Colosseum

The Colosseum is not just a monument; it's a journey back in time to ancient Rome. Standing before this architectural marvel, you can almost hear the roar of 50,000 spectators who once filled its seats.

## Best Time to Visit

The Colosseum is open year-round, but timing is everything. Early morning visits (8:30 AM) offer cooler temperatures and fewer crowds. Winter months (November to February) provide the most comfortable experience, though some areas may be closed due to weather.

## Insider Tips

1. **Skip the Line**: Book tickets online in advance to avoid 2-3 hour wait times
2. **Underground Tours**: The hypogeum (underground chambers) offer a unique perspective
3. **Combined Tickets**: Your ticket includes access to the Roman Forum and Palatine Hill
4. **Guided Tours**: Worth the investment for historical context and hidden stories

## What to Expect

The Colosseum tour typically takes 1-2 hours. You'll explore the arena floor, seating areas, and learn about gladiatorial combat. The upper levels offer spectacular views of Rome.

## Practical Information

- **Opening Hours**: 8:30 AM to one hour before sunset
- **Admission**: €16 (combined ticket with Roman Forum and Palatine Hill)
- **Getting There**: Metro Line B, Colosseo station
- **Accessibility**: Wheelchairs available upon request

## Photography Tips

The best photos are taken from the second tier during golden hour. Don't forget to capture the exterior from Via dei Fori Imperiali for that perfect postcard shot.

Make your visit unforgettable by combining history, planning, and a sense of wonder. The Colosseum has stood for nearly 2,000 years—take your time to absorb its majesty.
    `,
    author: {
      name: "Sofia Romano",
      avatar: "/woman-traveler.png",
    },
    publishedAt: "2024-12-15",
    readTime: 8,
    category: "Travel Guide",
    image: "/colosseum-rome-sunset.jpg",
    tags: ["Colosseum", "Rome", "Italy", "Travel Tips"],
  },
  {
    id: "2",
    slug: "machu-picchu-hiking-guide",
    title: "Hiking to Machu Picchu: A Complete Guide",
    excerpt:
      "From the classic Inca Trail to alternative routes, discover the best ways to reach the Lost City of the Incas and what to expect along the way.",
    content: `
# Hiking to Machu Picchu: A Complete Guide

Machu Picchu, the ancient Incan citadel perched high in the Andes Mountains, is one of the world's most iconic archaeological sites. Getting there is half the adventure.

## The Classic Inca Trail

The 4-day Inca Trail is the most famous route, following ancient stone pathways through cloud forests and past archaeological sites. Limited permits (500 per day) sell out months in advance.

### What You'll Need
- Permits booked 6 months in advance
- Good physical fitness (altitude up to 13,828 feet)
- Proper hiking gear and layers for changing weather
- Acclimatization days in Cusco

## Alternative Routes

### Salkantay Trek
A challenging 5-day trek through diverse landscapes, from snow-capped mountains to tropical jungle. No permits required, making it more accessible.

### Lares Trek
A cultural immersion through traditional Andean villages. Less crowded and offers authentic encounters with local communities.

### Train + Bus
For those short on time or unable to trek, taking the train from Cusco to Aguas Calientes, then a bus up to the ruins, is a comfortable alternative.

## Altitude Considerations

Machu Picchu sits at 7,970 feet, but you'll reach higher elevations on the trek. Spend 2-3 days in Cusco (11,150 feet) to acclimatize. Coca tea helps with altitude sickness.

## Best Time to Go

The dry season (May to September) offers the best hiking conditions. June to August is peak season with crowds. Consider April or October for fewer visitors and decent weather.

## What to Pack

Essential items include:
- Layers for temperature variations
- Rain gear (even in dry season)
- Sun protection (hat, sunscreen, sunglasses)
- Water purification tablets
- Snacks and energy bars
- First aid kit with altitude medication

## The Grand Reveal

No matter which route you choose, your first glimpse of Machu Picchu through the Sun Gate or from the entrance is unforgettable. Arrive early to watch sunrise over the ruins—it's pure magic.

Remember: Machu Picchu isn't just a destination; it's a pilgrimage that rewards those who make the journey with memories that last a lifetime.
    `,
    author: {
      name: "Carlos Mendoza",
      avatar: "/man-hiker.jpg",
    },
    publishedAt: "2024-12-10",
    readTime: 10,
    category: "Adventure",
    image: "/machu-picchu-peru.jpg",
    tags: ["Machu Picchu", "Peru", "Hiking", "Inca Trail"],
  },
  {
    id: "3",
    slug: "petra-by-night-experience",
    title: "Petra by Night: An Unforgettable Experience",
    excerpt:
      "Discover the magic of Petra illuminated by thousands of candles. Learn about this special evening experience and how to make the most of it.",
    content: `
# Petra by Night: An Unforgettable Experience

There's something deeply mystical about walking through the Siq—Petra's narrow canyon entrance—lit only by the flickering light of thousands of candles, with stars overhead and ancient rock walls towering on either side.

## What is Petra by Night?

Petra by Night is a special evening tour offered three times per week (Monday, Wednesday, and Thursday). The 2-kilometer walk through the Siq to the Treasury is illuminated by over 1,800 candles, creating an atmosphere that words struggle to capture.

## The Experience

### The Journey Begins
At 8:30 PM, visitors gather at the entrance. As you walk through the Siq, the only sounds are footsteps echoing off canyon walls and occasional whispers of awe from fellow travelers.

### The Treasury Reveal
Emerging from the Siq to see the Treasury (Al-Khazneh) bathed in candlelight is breathtaking. The play of light and shadow brings the 2,000-year-old facade to life in ways daylight can't match.

### Bedouin Performance
Seated on cushions in front of the Treasury, you'll enjoy traditional Bedouin music and tea. A local guide shares stories of Petra's history and the Nabataean people who carved this city from rock.

## Practical Tips

**Booking**
- Purchase tickets in advance online or at the visitor center
- Cost: 17 JOD (separate from day tickets)
- Arrive 15-20 minutes early for the best seating

**What to Bring**
- Comfortable walking shoes (the Siq can be uneven)
- Warm clothing (desert nights can be cold)
- Camera with good low-light capabilities
- Flashlight for the return journey

**Photography Considerations**
- Flash photography is prohibited
- Use a tripod for long exposures
- The experience is best absorbed, not just photographed

## Should You Do Both Day and Night Visits?

Absolutely. While Petra by Night is magical, it doesn't replace a daytime visit. The daytime tour allows you to explore beyond the Treasury to the Monastery, Royal Tombs, and other sites. Consider visiting during the day first, then return for the evening experience.

## The Magic of Silence

What makes Petra by Night special isn't just the candles or music—it's the collective silence of hundreds of people, all transfixed by beauty. It's a reminder that some moments transcend photography and social media; they exist purely in memory and feeling.

## Cultural Respect

Remember that Petra is a UNESCO World Heritage Site and holds deep significance for local Bedouin communities. Respect the space, follow guide instructions, and leave no trace behind.

Petra by Night isn't just a tourist attraction; it's a portal to another time, when caravans crossed these deserts and Petra was a thriving center of trade and culture. Let yourself be transported.
    `,
    author: {
      name: "Layla Hassan",
      avatar: "/woman-photographer.png",
    },
    publishedAt: "2024-12-05",
    readTime: 7,
    category: "Experience",
    image: "/petra-jordan.jpg",
    tags: ["Petra", "Jordan", "Night Tours", "Photography"],
  },
  {
    id: "4",
    slug: "great-wall-china-sections-guide",
    title: "Which Section of the Great Wall Should You Visit?",
    excerpt:
      "Not all sections of the Great Wall are created equal. Compare the most popular sections and find the perfect one for your visit.",
    content: `
# Which Section of the Great Wall Should You Visit?

The Great Wall of China stretches over 13,000 miles, but most visitors only see one section. Choosing the right one can make or break your experience.

## Badaling: The Classic Choice

**Pros:**
- Fully restored and accessible
- Best facilities and infrastructure
- Easy to reach from Beijing (1.5 hours)
- Wheelchair accessible sections

**Cons:**
- Extremely crowded (especially weekends)
- Less authentic due to heavy restoration
- Can feel commercialized

**Best For:** First-time visitors, families with young children, those with limited time

## Mutianyu: The Balanced Option

**Pros:**
- Less crowded than Badaling
- Well-preserved with stunning views
- Cable car and toboggan options
- Great photo opportunities

**Cons:**
- Still touristy during peak season
- 2.5 hours from Beijing

**Best For:** Travelers seeking a balance of accessibility and authenticity

## Jinshanling: The Hiker's Paradise

**Pros:**
- Partially restored with wild sections
- Fewer tourists
- Dramatic scenery
- Excellent for photography

**Cons:**
- Requires good physical fitness
- Further from Beijing (3 hours)
- Basic facilities

**Best For:** Experienced hikers, photographers, adventure seekers

## Jiankou: The Wild Wall

**Pros:**
- Unrestored and authentic
- Stunning but dangerous
- Almost no tourists
- Ultimate bragging rights

**Cons:**
- Not officially open to tourists
- Steep and crumbling sections
- No facilities or safety measures
- Risk of injury

**Best For:** Serious adventurers only (not recommended for most visitors)

## Simatai: The Night Option

**Pros:**
- Only section open at night
- Illuminated sections create magical atmosphere
- Less crowded
- Connected to Gubei Water Town

**Cons:**
- Requires advance reservation
- Limited section accessible
- More expensive

**Best For:** Couples seeking romantic experience, photography enthusiasts

## Planning Your Visit

### Best Time of Year
- Spring (April-May) and Fall (September-October) offer comfortable weather
- Avoid Chinese holidays (Golden Week in October, Chinese New Year)
- Summer is hot and crowded; winter can be icy

### What to Bring
- Comfortable hiking shoes with good grip
- Water and snacks (facilities are limited)
- Sun protection (shade is scarce)
- Camera with extra batteries
- Light jacket (it's cooler at elevation)

### Time Allocation
- Allow 3-4 hours for your Wall visit
- Factor in 2-3 hours of travel each way
- Start early to avoid crowds and heat

## Making the Right Choice

Consider these questions:
1. How much time do you have?
2. What's your fitness level?
3. Do you prioritize authenticity or comfort?
4. How do you feel about crowds?

For most visitors, Mutianyu offers the best overall experience: it's accessible enough to be comfortable, authentic enough to feel real, and scenic enough to create lasting memories.

Remember: The Great Wall isn't just a photo opportunity; it's a testament to human determination and engineering. Whichever section you choose, take time to absorb the magnitude of what you're walking on—a structure built over centuries, by millions of workers, that has stood for thousands of years.
    `,
    author: {
      name: "Wei Chen",
      avatar: "/man-guide.jpg",
    },
    publishedAt: "2024-11-28",
    readTime: 9,
    category: "Travel Guide",
    image: "/great-wall-china.jpg",
    tags: ["Great Wall", "China", "Beijing", "Hiking"],
  },
  {
    id: "5",
    slug: "taj-mahal-photography-tips",
    title: "Capturing the Perfect Taj Mahal Photo",
    excerpt:
      "Professional photography tips for getting stunning shots of the Taj Mahal, including best angles, lighting, and times of day.",
    content: `
# Capturing the Perfect Taj Mahal Photo

The Taj Mahal is one of the most photographed buildings in the world, yet capturing its true beauty remains a challenge. Here's how professionals get those stunning shots.

## Golden Hour Magic

The best light occurs during two windows:

### Sunrise (6:30-8:00 AM)
- Soft, warm light illuminates the white marble
- Fewer crowds in your shots
- Cooler temperatures for comfortable shooting
- The monument glows with pink and orange hues

### Sunset (5:30-7:00 PM)
- Golden light from the west creates dramatic shadows
- The marble takes on amber tones
- Reflections in the water are stronger
- More crowded but worth it

## Best Viewpoints

### Classic Front View
The reflection pool shot is iconic for a reason. Arrive early to capture it without crowds. Use a wide-angle lens (16-35mm) to get the entire structure and reflection.

### Side Angles
The Taj Mahal's symmetry makes it photogenic from any angle. Walk around to find unique perspectives. The side views show the minarets against the sky.

### Mehtab Bagh (Moonlight Garden)
Across the Yamuna River, this garden offers stunning sunset views. Less crowded and provides unique angles without the crowds.

### Inside the Mosque
The western mosque's doorway frames the Taj perfectly. Arrive early as this spot fills quickly.

## Technical Settings

### For Bright Days
- ISO: 100-200
- Aperture: f/8-f/11 for sharpness throughout
- Shutter speed: 1/250 or faster
- Use polarizing filter to enhance sky and reduce glare on marble

### For Low Light
- ISO: 400-800
- Aperture: f/2.8-f/5.6
- Shutter speed: depends on available light
- Tripod essential for sharp images

## Composition Tips

**Rule of Thirds**
Don't always center the Taj Mahal. Place it off-center with interesting foreground elements.

**Leading Lines**
Use the pathways, water channels, and trees to draw the eye toward the monument.

**Include People**
Silhouettes of visitors provide scale and story. Wait for interesting moments.

**Details Matter**
Don't just photograph the building. Capture the intricate marble inlay work, calligraphy, and decorative elements.

## Avoiding Common Mistakes

1. **Don't Forget the Ticket**
   Cameras are allowed, but professional equipment may require special permits.

2. **Protect Your Gear**
   Agra is dusty. Keep lens cloths handy and use protective filters.

3. **Mind the Restrictions**
   Tripods are sometimes restricted. Monopods are usually acceptable.

4. **Respect the Space**
   This is a mausoleum. Be respectful when shooting and of other visitors.

## The Full Moon Experience

Once a month (except Friday and during Ramadan), the Taj Mahal opens for night viewing under the full moon. Limited tickets (400 per night) must be booked well in advance. The experience is surreal—the white marble glows silvery in moonlight.

## Post-Processing Tips

**White Balance**
The marble's color shifts throughout the day. Shoot in RAW for flexibility in post-processing.

**Exposure**
The bright white marble often tricks camera meters. Slightly underexpose (1/3 to 2/3 stop) to preserve detail.

**Perspective Correction**
Use lens correction tools to fix converging lines, especially with wide-angle shots.

## Beyond the Famous Shot

Everyone has seen photos of the Taj Mahal. Make yours unique:
- Photograph reflections in puddles after rain
- Capture the changing colors from sunrise to sunset in a time-lapse series
- Focus on architectural details tourists ignore
- Include the surrounding structures and gardens
- Shoot through archways and frames

## The Ultimate Goal

Remember: the best photo isn't necessarily the most technically perfect. It's the one that captures how the Taj Mahal made you feel—the awe, the romance, the wonder of standing before one of humanity's greatest architectural achievements.

Take the famous shot for your album, then put the camera down for a few minutes. Experience the Taj Mahal with your eyes, not just through a viewfinder. Some moments are meant to be felt, not just photographed.
    `,
    author: {
      name: "Priya Sharma",
      avatar: "/woman-photographer.png",
    },
    publishedAt: "2024-11-20",
    readTime: 8,
    category: "Photography",
    image: "/taj-mahal-india.jpg",
    tags: ["Taj Mahal", "India", "Photography", "Travel Tips"],
  },
  {
    id: "6",
    slug: "chichen-itza-equinox-phenomenon",
    title: "Witnessing the Equinox at Chichen Itza",
    excerpt:
      "Learn about the spectacular light and shadow phenomenon at Chichen Itza during the spring and fall equinoxes, and how to plan your visit.",
    content: `
# Witnessing the Equinox at Chichen Itza

Twice a year, during the spring and fall equinoxes, thousands gather at Chichen Itza to witness an astronomical phenomenon the Maya engineered nearly 1,000 years ago: the descent of Kukulcán.

## The Serpent Descends

As the sun sets on the equinox (March 20-21 and September 22-23), sunlight creates a series of triangular shadows on the northern staircase of El Castillo pyramid. These shadows, combined with the carved serpent head at the base, create the illusion of a serpent descending from the temple.

### The Maya's Precision

The Maya were master astronomers. El Castillo incorporates complex astronomical calculations:
- 365 steps total (one for each day of the year)
- 91 steps on each of four sides, plus the top platform
- 52 panels on each side (representing the 52-year Maya calendar cycle)

The equinox serpent is just one of many astronomical alignments built into the structure.

## Planning Your Visit

### Timing is Everything

**Days to Visit:**
- Equinox (March 20-21 or September 22-23): Most crowded but most dramatic
- Week before/after: Phenomenon visible but less pronounced, fewer crowds
- Avoid: Several days off equinox when effect is minimal

**Arrival Time:**
The serpent effect occurs from approximately 3 PM to 5:30 PM. Arrive by 2 PM to secure a good viewing spot.

### What to Expect

**Crowds:**
Expect 20,000-40,000 people during the equinox. The site reaches capacity, and parking becomes challenging.

**Vendors and Performers:**
Local artisans and performers create a festival atmosphere. Traditional Maya ceremonies, dancers, and musicians add to the experience.

**Weather:**
March: Hot and dry (bring sun protection)
September: Possibility of rain (bring poncho)

## Getting the Best View

**Prime Locations:**
1. Base of the staircase (arrive very early)
2. Grassy area 50-100 feet from pyramid
3. Elevated viewing platforms (limited capacity)

**Photography Tips:**
- Wide-angle lens to capture pyramid and crowd
- Telephoto for detail shots of serpent effect
- Go early for equipment setup
- Video might be more effective than stills

## Beyond the Equinox

Chichen Itza offers much more than the serpent:

**The Ball Court**
The largest ancient ball court in Mesoamerica, with acoustics that carry a whisper from one end to the other.

**The Sacred Cenote**
A natural sinkhole where the Maya made sacrifices to the rain god Chaac.

**Temple of Warriors**
Rows of columns carved as warriors guard this impressive structure.

**El Caracol (Observatory)**
The "snail" was used to track celestial movements with remarkable accuracy.

## Making the Most of Your Trip

**Stay Local:**
Book hotels in nearby Valladolid (charming colonial town) or Pisté (closest to ruins). Both offer better value than Cancún.

**Multi-Day Itinerary:**
- Day 1: Arrive, explore Valladolid, swim in cenotes
- Day 2: Early morning at Chichen Itza (before crowds)
- Day 3: Return for equinox event
- Day 4: Visit other nearby ruins (Ek Balam, Coba)

**Respect the Site:**
- Don't climb the pyramids (no longer allowed)
- Stay on designated paths
- Don't touch carved stones
- No large bags allowed

## The Spiritual Experience

For many, witnessing the equinox at Chichen Itza is more than tourism—it's a spiritual connection to ancient wisdom. The Maya's ability to encode astronomical knowledge in architecture, creating a phenomenon that still amazes us 1,000 years later, is humbling.

As the serpent appears to slither down the pyramid, take a moment to reflect: you're witnessing the same event the Maya planned for, using the same sun, on the same stones. It's a tangible connection across centuries.

## Alternatives

If equinox crowds are too daunting:

**Dzibilchaltún:**
Near Mérida, the "Temple of the Seven Dolls" aligns perfectly with sunrise during equinoxes. Far fewer visitors.

**Mayapan:**
The "Last Maya Capital" has similar astronomical alignments and almost no tourists.

## Final Thoughts

Whether you visit during the equinox or any other time, Chichen Itza is a testament to human ingenuity and our eternal fascination with the cosmos. The serpent's descent is dramatic, but the real magic is understanding that ancient people, with no modern technology, created something that still captivates us today.

Plan ahead, arrive early, stay hydrated, and prepare to be amazed by what the Maya accomplished—and by humanity's enduring ability to marvel at the sky.
    `,
    author: {
      name: "Miguel Hernández",
      avatar: "/man-archaeologist.jpg",
    },
    publishedAt: "2024-11-15",
    readTime: 10,
    category: "Cultural",
    image: "/chichen-itza-mexico.jpg",
    tags: ["Chichen Itza", "Mexico", "Maya", "Equinox", "Archaeology"],
  },
]
