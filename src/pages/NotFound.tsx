import { Button } from "@/components/ui/button";
import { MessageSquare, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>

        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col space-y-4">
          <a href="/">
            <Button className="w-full gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </a>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <a href="/" className="flex items-center justify-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">FireChat</span>
        </a>
      </div>
    </div>
  );
}
