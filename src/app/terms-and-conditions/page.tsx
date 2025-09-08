
import PublicFooter from "@/components/public-footer";
import PublicHeader from "@/components/public-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Terms and Conditions</CardTitle>
              <CardDescription>Effective date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
                <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the HostelPro website (the "Service") operated by HostelPro ("us", "we", or "our"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
                
                <Separator />

                <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">1. Accounts</h2>
                    <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
                </div>
                
                <Separator />

                <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">2. Intellectual Property</h2>
                    <p>The Service and its original content, features, and functionality are and will remain the exclusive property of HostelPro and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of HostelPro.</p>
                </div>

                <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">3. Links To Other Web Sites</h2>
                    <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by HostelPro. HostelPro has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that HostelPro shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
                </div>
                
                 <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">4. Termination</h2>
                    <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>
                </div>

                 <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">5. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
                </div>

                 <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">6. Changes</h2>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
                </div>

                 <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">7. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at: <a href="mailto:support@hostelpro.com" className="text-primary hover:underline">support@hostelpro.com</a></p>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
