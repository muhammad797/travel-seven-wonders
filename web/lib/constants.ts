/**
 * Centralized contact information and company details
 * Update these values in one place to reflect changes across the entire application
 */

export const COMPANY_INFO = {
  name: "Travel Seven Wonders",
  legalName: "Travel Seven Wonders Inc.",
  website: "https://travelsevenwonders.com",
} as const

export const CONTACT_INFO = {
  // Main support contact
  support: {
    email: "support@travelsevenwonders.com",
    phone: "+1 (800) 555-0123",
    phoneDisplay: "+1 (800) 555-0123",
    availability: "Available 24/7",
    responseTime: "Response within 24 hours",
  },
  // Legal/Privacy contact
  legal: {
    email: "legal@travelsevenwonders.com",
    phone: "+1 (555) 123-4567",
  },
  // Privacy contact
  privacy: {
    email: "privacy@travelsevenwonders.com",
    phone: "+1 (555) 123-4567",
  },
  // General contact (for footer, etc.)
  general: {
    email: "support@travelsevenwonders.com",
    phone: "+1 (555) 123-4567",
    phoneDisplay: "+1 (555) 123-4567",
  },
  // Physical address
  address: {
    street: "123 Travel Lane",
    city: "New York",
    state: "NY",
    zip: "10001",
    full: "123 Travel Lane, New York, NY 10001",
  },
} as const

export const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
} as const

export interface FAQ {
  id: string
  question: string
  answer: string | ((contactInfo: typeof CONTACT_INFO) => string)
}

export const FAQS: FAQ[] = [
  {
    id: "item-1",
    question: "How do I book a trip to one of the Seven Wonders?",
    answer:
      "Simply select your desired wonder from our homepage, fill in your travel details (origin, dates, number of travelers), choose your flights and hotels, and complete the checkout process. You'll receive instant confirmation with your complete itinerary.",
  },
  {
    id: "item-2",
    question: "Can I book flights and hotels separately?",
    answer:
      "Yes! While we recommend booking both for a seamless experience, you can choose to book only flights or only hotels. During the hotel selection phase, you have the option to skip hotel bookings entirely.",
  },
  {
    id: "item-3",
    question: "What's included in the package price?",
    answer:
      "Your package includes round-trip flights, hotel accommodations (if selected), and all applicable taxes and fees. Airport transfers, meals (unless specified by the hotel), and attraction entrance fees are not included but can be added during booking.",
  },
  {
    id: "item-4",
    question: "Can I modify or cancel my booking?",
    answer:
      "Modification and cancellation policies vary by airline and hotel. Most bookings allow changes up to 24-48 hours before departure, subject to fees. Review the specific terms in your booking confirmation or visit the My Trips page to request changes.",
  },
  {
    id: "item-5",
    question: "Do I need a visa to visit these destinations?",
    answer:
      "Visa requirements vary by destination and your nationality. We recommend checking with the embassy or consulate of your destination country at least 6-8 weeks before travel. Our support team can provide general guidance but cannot handle visa applications.",
  },
  {
    id: "item-6",
    question: "Are the hotels close to the monuments?",
    answer:
      "Yes! We carefully select hotels based on proximity to each wonder. Each hotel listing shows the distance to the attraction. Most properties are within walking distance or a short taxi ride from the monument.",
  },
  {
    id: "item-7",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and PayPal. All transactions are secured with industry-standard encryption.",
  },
  {
    id: "item-8",
    question: "Is travel insurance included?",
    answer:
      "Travel insurance is not automatically included but is highly recommended. We partner with leading insurance providers and can offer coverage options during checkout that protect against trip cancellations, medical emergencies, and lost luggage.",
  },
  {
    id: "item-9",
    question: "What if I need help during my trip?",
    answer: (contactInfo) =>
      `Our ${contactInfo.support.availability.toLowerCase()} customer support team is available via phone (${contactInfo.support.phoneDisplay}), email (${contactInfo.support.email}), and chat. You'll receive emergency contact numbers with your booking confirmation. We also provide local contact information for each destination.`,
  },
  {
    id: "item-10",
    question: "Can I add guided tours or activities?",
    answer:
      "While our platform currently focuses on flights and hotels, we partner with local tour operators at each destination. After booking, you'll receive recommendations for guided tours, skip-the-line tickets, and unique experiences that can be booked separately.",
  },
] as const

