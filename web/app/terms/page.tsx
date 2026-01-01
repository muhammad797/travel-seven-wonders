import { CONTACT_INFO } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Travel Seven Wonders",
  description:
    "Read our Terms of Service to understand the terms and conditions for using Travel Seven Wonders. Learn about booking policies, cancellations, refunds, and user responsibilities.",
  keywords: ["terms of service", "legal", "booking terms", "travel terms", "user agreement"],
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Travel Wonders' website and services, you agree to be bound by these Terms of
              Service and all applicable laws and regulations. If you do not agree with any of these terms, you are
              prohibited from using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
            <p className="text-muted-foreground">
              Travel Wonders operates as an online travel booking platform, facilitating reservations for flights,
              accommodations, and related travel services to the Seven Wonders of the World. We act as an intermediary
              between you and service providers (airlines, hotels, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Booking and Payment</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>All bookings are subject to availability and confirmation by service providers</li>
              <li>Prices are displayed in USD and include applicable taxes unless otherwise stated</li>
              <li>Payment must be made in full at the time of booking using accepted payment methods</li>
              <li>Credit card charges will appear as "Travel Wonders" on your statement</li>
              <li>We reserve the right to cancel bookings if payment authorization fails or fraud is suspected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Cancellations and Refunds</h2>
            <p className="text-muted-foreground mb-4">
              Cancellation and refund policies vary by service provider and are clearly displayed during booking:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Flights:</strong> Subject to airline policies; many tickets are non-refundable or incur
                substantial cancellation fees
              </li>
              <li>
                <strong>Hotels:</strong> Typically allow free cancellation 24-48 hours before check-in; policies vary by
                property
              </li>
              <li>
                <strong>Service Fees:</strong> Travel Wonders' service fees are non-refundable unless we cancel your
                booking
              </li>
              <li>Refunds are processed within 7-14 business days to the original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Modifications</h2>
            <p className="text-muted-foreground">
              Changes to bookings are subject to availability and provider policies. Modification fees may apply.
              Contact our support team through the My Trips page to request changes. We cannot guarantee that changes
              will be accommodated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Travel Documents</h2>
            <p className="text-muted-foreground">
              You are responsible for ensuring you have valid passports, visas, health certificates, and other documents
              required for travel. We provide general information but do not handle visa applications or guarantee
              document adequacy. Entry may be refused if proper documentation is not presented.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">Travel Wonders is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Flight delays, cancellations, or schedule changes by airlines</li>
              <li>Hotel overbooking or failure to provide reserved accommodations</li>
              <li>Personal injury, illness, or loss during travel</li>
              <li>Loss or damage to baggage or personal belongings</li>
              <li>Acts of God, natural disasters, terrorism, or political instability</li>
              <li>Third-party service provider actions or omissions</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Our liability is limited to the amount paid for our services. We strongly recommend purchasing
              comprehensive travel insurance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. User Conduct</h2>
            <p className="text-muted-foreground mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide false or misleading information</li>
              <li>Use another person's account or payment information</li>
              <li>Attempt to circumvent security measures</li>
              <li>Engage in fraudulent booking activities</li>
              <li>Use our services for any illegal purpose</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on Travel Wonders' website, including text, graphics, logos, images, and software, is our
              property or licensed to us and protected by copyright and trademark laws. You may not reproduce,
              distribute, or create derivative works without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Privacy</h2>
            <p className="text-muted-foreground">
              Your use of our services is also governed by our Privacy Policy, which explains how we collect, use, and
              protect your personal information. By using our services, you consent to our privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Dispute Resolution</h2>
            <p className="text-muted-foreground">
              Any disputes arising from these terms or your use of our services will be resolved through binding
              arbitration in accordance with the American Arbitration Association's rules. You waive the right to
              participate in class action lawsuits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the State of New York, United States, without regard to conflict
              of law provisions. Any legal action must be brought in courts located in New York County, New York.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon
              posting. Continued use of our services after changes constitutes acceptance of modified terms. Check this
              page regularly for updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or
              eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and
              effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
            <p className="text-muted-foreground">For questions about these Terms of Service, contact us at:</p>
            <div className="mt-4 p-4 bg-accent/5 rounded-lg border">
              <p className="text-muted-foreground">
                <strong>Email:</strong> {CONTACT_INFO.legal.email}
              </p>
              <p className="text-muted-foreground">
                <strong>Phone:</strong> {CONTACT_INFO.legal.phone}
              </p>
              <p className="text-muted-foreground">
                <strong>Address:</strong> {CONTACT_INFO.address.full}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
