import { AppBar } from "./components/AppBar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Radio, Headphones } from "lucide-react"
import Link from "next/link"
import { Redirect } from "./components/Redirect";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <AppBar />
      <Redirect />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Fans Control the Beat
                </h1>
                <p className="mx-auto max-w-[600px] text-xl md:text-2xl text-gray-400">
                  Let your audience choose the music. Stream, interact, revolutionize.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 text-white hover:bg-purple-700">Get Started</Button>
                <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400/20">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-purple-400">
              Why FanTune?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-pink-400" />
                <h3 className="text-xl font-bold mb-2 text-gray-100">Fan-Driven</h3>
                <p className="text-gray-400">Audience shapes the playlist in real-time.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Radio className="h-12 w-12 mb-4 text-pink-400" />
                <h3 className="text-xl font-bold mb-2 text-gray-100">Live Interaction</h3>
                <p className="text-gray-400">Chat and request during streams.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Headphones className="h-12 w-12 mb-4 text-pink-400" />
                <h3 className="text-xl font-bold mb-2 text-gray-100">Premium Audio</h3>
                <p className="text-gray-400">Crystal-clear sound quality.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-400">
                  Ready to Redefine Music Streaming?
                </h2>
                <p className="mx-auto max-w-[600px] text-xl text-gray-400">
                  Join FanTune today. For creators and fans alike.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-800 text-gray-100 placeholder-gray-500 border-gray-700 focus:border-purple-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" className="bg-pink-600 text-white hover:bg-pink-700">
                    Sign Up
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full shrink-0 px-4 md:px-6 border-t border-gray-800">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2023 FanTune. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
              Terms
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
