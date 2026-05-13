import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <html lang="kk" className="dark">
      <body className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Compass
            className="size-20 mx-auto mb-6 text-primary opacity-50"
            strokeWidth={1}
          />
          <h1 className="font-display text-6xl font-bold mb-2 gradient-text">
            404
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Бұл бет табылмады
          </p>
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="size-4" />
              Басты бетке оралу
            </Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
