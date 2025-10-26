"use client";

import Image from "next/image";
import Link from "next/link";

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Go to home">
              <Image src="/logo.svg" alt="logo" width={96} height={96} />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/app"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              App
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground">
              How It Works: Buy and Burn Token
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Follow these steps to acquire the token and optionally burn it to reduce total supply.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1) Buy the Token</h2>
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Connect your wallet using the Connect Wallet button (top-right) or from the App page.</li>
                <li>Ensure you are on the correct network. If prompted, approve the network switch in your wallet.</li>
                <li>
                  Acquire the token:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>In-App: open the App and use the project flow to purchase project tokens.</li>
                    <li>
                      Or via DEX: use a reputable DEX, paste the official token address, and swap from USDC/ETH as
                      needed.
                    </li>
                  </ul>
                </li>
                <li>
                  Confirm the transaction in your wallet and wait for confirmation. You will see the tokens in your
                  wallet and in the App.
                </li>
              </ol>
              <div className="text-xs text-muted-foreground">
                Tip: Keep a small amount of native gas token for network fees.
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2) Burn the Token</h2>
            <p className="text-muted-foreground">
              Burning destroys tokens by sending them to an irrecoverable address via the token contract. Choose one of
              the options below.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border bg-background p-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Burn a Specific Amount</h3>
                <p className="text-sm text-muted-foreground">
                  Enter an exact token amount to burn instantly from your balance.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                  <span className="text-secondary">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Burn by Percentage</h3>
                <p className="text-sm text-muted-foreground">
                  Select common presets (1%, 25%, 50%, 75%) to burn a portion of your holdings.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background p-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                  <span className="text-accent">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Burn All (Max)</h3>
                <p className="text-sm text-muted-foreground">
                  Burn your full available balance in a single transaction.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Open the App and navigate to the Burn section.</li>
                <li>Choose an option above and input the amount or percentage.</li>
                <li>Review the estimate and network fee, then click Burn.</li>
                <li>Approve the transaction in your wallet and wait for confirmation.</li>
                <li>Verify the burn on the block explorer (transaction goes to the burn address).</li>
              </ol>
              <div className="text-xs text-muted-foreground">
                Note: Burning is irreversible. Double-check the amount before confirming.
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">FAQs & Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold text-foreground mb-2">What do I need to buy?</h3>
                <p className="text-sm text-muted-foreground">
                  A supported wallet, the correct network selected, and sufficient balance of the swap token and gas
                  token.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="font-semibold text-foreground mb-2">Where do burns show up?</h3>
                <p className="text-sm text-muted-foreground">
                  On-chain as a transaction interacting with the token contract, sending tokens to an irrecoverable
                  address.
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/app"
              className="px-8 py-3 bg-gradient-to-br from-primary to-primary/90 text-white text-lg font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-200"
            >
              Open App
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-border bg-background text-foreground text-lg font-semibold rounded-lg hover:bg-card transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Disclaimer: Token purchases and burns are on-chain actions and may be subject to regulation in your
              jurisdiction. Always do your own research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
