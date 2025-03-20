import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Users, Zap } from "lucide-react";

type Props = {};

const HomePage = (_props: Props) => {
  return (
    <div className="w-full mx-auto">
      <section className="py-24 bg-gray-100 ">
        <div className="px-4 md:px-6 ">
          <div className="flex flex-col items-center justify-center space-y-4 text-center ">
            <div className="space-y-2 text-center">
              <img
                src="https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_28dp.png"
                alt="Logo"
                className="h-12 text-center mx-auto"
              />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Real-time Chat Testing Made Simple
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Experiment with Firebase-powered chat functionality in a clean,
                modern interface.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/login">
                <Button size="lg" className="gap-1">
                  <Zap className="h-4 w-4" />
                  Try Demo
                </Button>
              </a>
              <a href="/login">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="">
        <img
          src="/screen.png"
          alt="Chat"
          className="mx-auto max-w-7xl border-2 rounded-2xl my-8"
          width={"50%"}
        />
      </div>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className=" px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Real-time Messaging</CardTitle>
                <CardDescription>
                  Send and receive messages instantly with Firebase Realtime
                  Database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Experience seamless communication with no page refreshes.
                  Messages appear as they're sent, creating a fluid chat
                  experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>User Authentication</CardTitle>
                <CardDescription>
                  Secure login and registration powered by Firebase
                  Authentication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Implement email/password authentication, social logins, or
                  anonymous access with just a few lines of code.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Experimental Features</CardTitle>
                <CardDescription>
                  A sandbox for testing new chat functionality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Try out different chat features, UI layouts, and interaction
                  patterns in a controlled environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className=" px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Start Testing?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create an account or try the demo to experience the power of
                Firebase chat.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/login">
                <Button size="lg">Get Started</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t py-6">
        <div className=" flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FireChat. Experimental project.
          </p>
          <div className="flex gap-4">
            <a
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
