import FlowBuilder from "./flow-builder"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">WhatsApp Flow Editor</h1>
      <FlowBuilder />
    </main>
  )
}

