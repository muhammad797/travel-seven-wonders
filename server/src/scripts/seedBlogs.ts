// Import env config first to validate environment variables
import '../config/env';

import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { BlogPost } from '../modules/blogs';
import logger from '../utils/logger';

const mockBlogPosts = [
  {
    slug: 'ultimate-guide-visiting-colosseum',
    title: 'The Ultimate Guide to Visiting the Colosseum',
    excerpt:
      "Everything you need to know before visiting Rome's most iconic monument, from best times to visit to insider tips for avoiding crowds.",
    content: `# The Ultimate Guide to Visiting the Colosseum

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

Make your visit unforgettable by combining history, planning, and a sense of wonder. The Colosseum has stood for nearly 2,000 years—take your time to absorb its majesty.`,
    author: {
      name: 'Sofia Romano',
      avatar: '/woman-traveler.png',
    },
    publishedAt: new Date('2024-12-15'),
    readTime: 8,
    category: 'Travel Guide',
    image: '/colosseum-rome-sunset.jpg',
    tags: ['Colosseum', 'Rome', 'Italy', 'Travel Tips'],
  },
  {
    slug: 'machu-picchu-hiking-guide',
    title: 'Hiking to Machu Picchu: A Complete Guide',
    excerpt:
      'From the classic Inca Trail to alternative routes, discover the best ways to reach the Lost City of the Incas and what to expect along the way.',
    content: `# Hiking to Machu Picchu: A Complete Guide

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

Remember: Machu Picchu isn't just a destination; it's a pilgrimage that rewards those who make the journey with memories that last a lifetime.`,
    author: {
      name: 'Carlos Mendoza',
      avatar: '/man-hiker.jpg',
    },
    publishedAt: new Date('2024-12-10'),
    readTime: 10,
    category: 'Adventure',
    image: '/machu-picchu-peru.jpg',
    tags: ['Machu Picchu', 'Peru', 'Hiking', 'Inca Trail'],
  },
  {
    slug: 'petra-by-night-experience',
    title: 'Petra by Night: An Unforgettable Experience',
    excerpt:
      'Discover the magic of Petra illuminated by thousands of candles. Learn about this special evening experience and how to make the most of it.',
    content: `# Petra by Night: An Unforgettable Experience

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

Petra by Night isn't just a tourist attraction; it's a portal to another time, when caravans crossed these deserts and Petra was a thriving center of trade and culture. Let yourself be transported.`,
    author: {
      name: 'Layla Hassan',
      avatar: '/woman-photographer.png',
    },
    publishedAt: new Date('2024-12-05'),
    readTime: 7,
    category: 'Experience',
    image: '/petra-jordan.jpg',
    tags: ['Petra', 'Jordan', 'Night Tours', 'Photography'],
  },
  {
    slug: 'great-wall-china-sections-guide',
    title: 'Which Section of the Great Wall Should You Visit?',
    excerpt:
      'Not all sections of the Great Wall are created equal. Compare the most popular sections and find the perfect one for your visit.',
    content: `# Which Section of the Great Wall Should You Visit?

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

Remember: The Great Wall isn't just a photo opportunity; it's a testament to human determination and engineering. Whichever section you choose, take time to absorb the magnitude of what you're walking on—a structure built over centuries, by millions of workers, that has stood for thousands of years.`,
    author: {
      name: 'Wei Chen',
      avatar: '/man-guide.jpg',
    },
    publishedAt: new Date('2024-11-28'),
    readTime: 9,
    category: 'Travel Guide',
    image: '/great-wall-china.jpg',
    tags: ['Great Wall', 'China', 'Beijing', 'Hiking'],
  },
  {
    slug: 'taj-mahal-photography-tips',
    title: 'Capturing the Perfect Taj Mahal Photo',
    excerpt:
      'Professional photography tips for getting stunning shots of the Taj Mahal, including best angles, lighting, and times of day.',
    content: `# Capturing the Perfect Taj Mahal Photo

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

Take the famous shot for your album, then put the camera down for a few minutes. Experience the Taj Mahal with your eyes, not just through a viewfinder. Some moments are meant to be felt, not just photographed.`,
    author: {
      name: 'Priya Sharma',
      avatar: '/woman-photographer.png',
    },
    publishedAt: new Date('2024-11-20'),
    readTime: 8,
    category: 'Photography',
    image: '/taj-mahal-india.jpg',
    tags: ['Taj Mahal', 'India', 'Photography', 'Travel Tips'],
  },
  {
    slug: 'chichen-itza-equinox-phenomenon',
    title: 'Witnessing the Equinox at Chichen Itza',
    excerpt:
      'Learn about the spectacular light and shadow phenomenon at Chichen Itza during the spring and fall equinoxes, and how to plan your visit.',
    content: `# Witnessing the Equinox at Chichen Itza

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

Plan ahead, arrive early, stay hydrated, and prepare to be amazed by what the Maya accomplished—and by humanity's enduring ability to marvel at the sky.`,
    author: {
      name: 'Miguel Hernández',
      avatar: '/man-archaeologist.jpg',
    },
    publishedAt: new Date('2024-11-15'),
    readTime: 10,
    category: 'Cultural',
    image: '/chichen-itza-mexico.jpg',
    tags: ['Chichen Itza', 'Mexico', 'Maya', 'Equinox', 'Archaeology'],
  },
];

const seedBlogs = async () => {
  try {
    await connectDatabase();

    // Clear existing blog posts
    await BlogPost.deleteMany({});
    logger.info('Cleared existing blog posts');

    // Insert mock blog posts
    const insertedPosts = await BlogPost.insertMany(mockBlogPosts);
    logger.info(`Successfully seeded ${insertedPosts.length} blog posts`);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding blog posts:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seedBlogs();

