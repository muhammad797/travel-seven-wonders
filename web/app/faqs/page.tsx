import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CONTACT_INFO, COMPANY_INFO, FAQS } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQs - Travel Seven Wonders",
  description:
    "Find answers to common questions about booking trips to the Seven Wonders of the World. Learn about flights, hotels, cancellations, visas, and more.",
  keywords: ["FAQs", "travel questions", "booking help", "Seven Wonders travel", "travel support"],
}

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about booking and traveling with {COMPANY_INFO.name}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 mb-8">
          {FAQS.map((faq) => {
            const answer = typeof faq.answer === "function" ? faq.answer(CONTACT_INFO) : faq.answer
            return (
              <AccordionItem key={faq.id} value={faq.id} className={`border rounded-lg px-6`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className={`text-muted-foreground`}>{answer}</AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        <div className="mt-12 p-6 bg-accent/5 rounded-lg border">
          <h2 className="font-semibold text-lg mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> <a href={`mailto:${CONTACT_INFO.support.email}`} className="text-accent hover:underline">{CONTACT_INFO.support.email}</a>
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Phone:</strong> <a href={`tel:${CONTACT_INFO.support.phone}`} className="text-accent hover:underline">{CONTACT_INFO.support.phoneDisplay}</a> ({CONTACT_INFO.support.availability})
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
