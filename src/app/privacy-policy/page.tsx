
import PublicFooter from "@/components/public-footer";
import PublicHeader from "@/components/public-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
              <CardDescription>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
                <p>Welcome to HostelPro. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
                
                <Separator />

                <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">1. Information We Collect</h2>
                    <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>
                </div>
                
                <Separator />

                <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">2. Use of Your Information</h2>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                     <ul className="list-disc list-inside space-y-2 mt-2">
                        <li>Create and manage your account.</li>
                        <li>Process your applications and transactions.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Improve our website and services.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                    </ul>
                </div>

                <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">3. Disclosure of Your Information</h2>
                    <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                     <ul className="list-disc list-inside space-y-2 mt-2">
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                        <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                    </ul>
                </div>

                 <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">4. Security of Your Information</h2>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                </div>
                
                 <Separator />

                 <div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">5. Contact Us</h2>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@hostelpro.com" className="text-primary hover:underline">privacy@hostelpro.com</a></p>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
