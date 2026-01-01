import { CONTACT_INFO } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Travel Seven Wonders",
  description:
    "Learn how Travel Seven Wonders collects, uses, and protects your personal information. Read our comprehensive privacy policy to understand your data rights and our commitment to privacy.",
  keywords: ["privacy policy", "data protection", "privacy", "personal information", "data security"],
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to Travel Wonders. We respect your privacy and are committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We collect several types of information:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, passport information, and
                payment details when you make a booking
              </li>
              <li>
                <strong>Travel Information:</strong> Travel dates, destinations, preferences, and booking history
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type, device information, and cookies for website
                functionality
              </li>
              <li>
                <strong>Communication Data:</strong> Records of correspondence with our support team
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Process and manage your bookings</li>
              <li>Communicate booking confirmations, updates, and travel information</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our services and user experience</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing</h2>
            <p className="text-muted-foreground mb-4">We share your information only with:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Service Providers:</strong> Airlines, hotels, and payment processors necessary to fulfill your
                booking
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business Partners:</strong> With your consent, for special offers and promotions
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">We never sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures including SSL encryption, secure servers, and access
              controls to protect your data. However, no method of transmission over the internet is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can
              control cookie preferences through your browser settings. Disabling cookies may affect website
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy,
              comply with legal obligations, resolve disputes, and enforce agreements. Booking records are typically
              kept for 7 years for accounting and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. International Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries outside your residence. We ensure
              appropriate safeguards are in place to protect your data in accordance with this privacy policy and
              applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not directed to individuals under 18. We do not knowingly collect personal information
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy periodically. Changes will be posted on this page with an updated
              revision date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy or wish to exercise your rights, contact us at:
            </p>
            <div className="mt-4 p-4 bg-accent/5 rounded-lg border">
              <p className="text-muted-foreground">
                <strong>Email:</strong> {CONTACT_INFO.privacy.email}
              </p>
              <p className="text-muted-foreground">
                <strong>Phone:</strong> {CONTACT_INFO.privacy.phone}
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
