import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container max-w-3xl mx-auto">
          <div className="animate-fade-up space-y-8">
            <div>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium mb-4">
                About
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-medium leading-tight">
                Building trust in the AI era
              </h1>
            </div>

            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-secondary">
              <img 
                src="https://sofiayan0523.github.io/sofia/assets/sofia.png" 
                alt="Sofia Yan"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-neutral max-w-none space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg">
                Hi, I'm Sofia — cofounder and Chief Growth Officer at <strong className="text-foreground">Numbers Protocol</strong>, 
                where we build blockchain-powered truth tools to protect creativity and build digital trust.
              </p>

              <p>
                I'm a strategist with a creative soul, raised on code and campaigns. 
                I've spent the past decade scaling startups, leading global marketing, 
                and advocating for ethical tech. I believe good technology should be 
                understandable, human-centered, and a little bit rebellious.
              </p>

              <p>
                Beyond work, I climb walls (literally — I boulder in Taipei), 
                and tinker with every AI tool I can get my hands on. I love solo travel 
                and have explored over 50 cities. Zaza and Piepie, my cats, ensure my 
                decks are typo-free and my tweets are tasteful.
              </p>

              <h2 className="font-display text-2xl font-medium text-foreground pt-8">
                I speak about
              </h2>
              
              <ul className="space-y-2">
                <li>Building trust in the AI era</li>
                <li>Blockchain for digital provenance</li>
                <li>Ethical tech and media transparency</li>
                <li>Growth strategies for Web3 and creative ecosystems</li>
              </ul>

              <h2 className="font-display text-2xl font-medium text-foreground pt-8">
                Currently
              </h2>
              
              <ul className="space-y-2">
                <li>🏠 Based in Taipei, Taiwan</li>
                <li>🎤 Available for speaking engagements</li>
                <li>✍️ Writing about travel & AI tools</li>
                <li>🧗‍♀️ Bouldering on weekends</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
