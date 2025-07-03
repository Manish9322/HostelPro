import PublicHeader from "@/components/public-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { mockNotices } from "@/lib/data";
import { format } from 'date-fns';

export default function NoticesPage() {
  const sortedNotices = [...mockNotices].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <PublicHeader />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Notice Board</h1>
            <p className="mt-2 text-muted-foreground">Latest news and announcements from the hostel administration.</p>
          </div>
          <div className="space-y-8">
            {sortedNotices.map((notice) => (
              <Card key={notice.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{notice.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{notice.content}</p>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground flex justify-between">
                  <span>By: <strong>{notice.author}</strong></span>
                  <span>{format(new Date(notice.publishedAt), 'PPP')}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
