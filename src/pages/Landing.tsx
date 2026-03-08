import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.png';
import { Sparkles, Wand2, Image, Layers, ArrowRight, Zap, Shield, Download } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="PIXARIS" className="w-10 h-10" />
            <div>
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">PIXARIS</h2>
              <p className="text-xs text-muted-foreground -mt-1">Craft Your Vision</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate('/auth')} className="text-sm">
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-gradient-primary text-primary-foreground hover:opacity-90 text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            AI-Powered Photo Editing
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Transform Photos</span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">With AI Magic</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Edit, enhance, and generate stunning images using natural language. 
            Just describe what you want — our AI does the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 text-base px-8 py-6 shadow-[var(--shadow-glow)]"
            >
              Start Creating Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-base px-8 py-6"
            >
              See How It Works
            </Button>
          </div>

          {/* Hero visual mockup */}
          <div className="mt-16 sm:mt-20 relative mx-auto max-w-4xl">
            <div className="rounded-xl border border-border bg-card/60 backdrop-blur-md p-2 shadow-[var(--shadow-card)]">
              <div className="rounded-lg bg-muted/50 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="text-center space-y-4 relative z-10">
                  <div className="flex justify-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Image className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-accent/15 flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Upload → Describe → Transform</p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card border border-border shadow-[var(--shadow-card)] text-xs text-muted-foreground">
              ✨ No design skills required
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Professional-grade photo editing tools powered by cutting-edge AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Wand2,
                title: 'AI Photo Editing',
                description: 'Describe your edits in plain English. Remove backgrounds, change styles, adjust colors — all with words.',
                gradient: 'from-primary/20 to-primary/5',
              },
              {
                icon: Sparkles,
                title: 'Image Generation',
                description: 'Generate stunning images from text prompts. Create unique visuals for any project or inspiration.',
                gradient: 'from-accent/20 to-accent/5',
              },
              {
                icon: Layers,
                title: 'Smart Prompts Library',
                description: 'Browse curated prompts by category. Find the perfect starting point and customize to your needs.',
                gradient: 'from-primary/20 to-accent/5',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get results in seconds, not minutes. Our optimized pipeline delivers quality at incredible speed.',
                gradient: 'from-accent/20 to-primary/5',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your images stay yours. Secure authentication and encrypted storage protect your creative work.',
                gradient: 'from-primary/20 to-primary/5',
              },
              {
                icon: Download,
                title: 'Easy Export',
                description: 'Download your creations instantly. Full resolution exports ready for print or web use.',
                gradient: 'from-accent/20 to-accent/5',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-card)]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-10 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
                Ready to Create?
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
                Join thousands of creators using AI to transform their photos. Start for free today.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 text-base px-10 py-6 shadow-[var(--shadow-glow)]"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="PIXARIS" className="w-6 h-6" />
            <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">PIXARIS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Developed by Harshavardhan • Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
