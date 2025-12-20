import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PromptCard {
  category: string;
  prompts: { title: string; prompt: string }[];
  icon: string;
}

const predefinedPrompts: PromptCard[] = [
  {
    category: "Men's Portraits",
    icon: "👔",
    prompts: [
      {
        title: "Clean LinkedIn Headshot",
        prompt: "Turn this selfie into a professional LinkedIn headshot of a man. Background: softly blurred office with big windows. Style: clean, realistic, subtle retouching, no heavy filters. Lighting: soft daylight from the front. Constraints: keep facial features and hairstyle accurate, no text."
      },
      {
        title: "Casual Street Portrait",
        prompt: "Create a cinematic street-style portrait of a man walking down a city street at night. Outfit: plain T-shirt, jeans, sneakers. Background: neon signs and reflections on wet pavement. Style: realistic, slight film grain, shallow depth of field. Frame: mid-shot from the waist up. Instagram-ready"
      },
      {
        title: "Akshaye Khanna Dhurandhar Style",
        prompt: "Transform my uploaded photo into an ultra-realistic cinematic film still while preserving my exact identity (same facial structure, age, skin texture, hairstyle; no beautification; no face change). Scene: dusty desert roadside with soft beige haze; a white SUV on the left with the door open behind me. Wardrobe: all-black layered outfit — black kurta with buttons, black blazer/coat, and a black scarf/stole draped around the neck. Accessories: dark aviator sunglasses, symmetric fit, realistic lens reflections. Pose/expression: confident smirk, head slightly down and turned; both arms open outward with palms up; hands anatomically correct. Lighting: warm daylight, gentle contrast, soft shadows, subtle film grain; cinematic color grading. Camera: medium shot, slightly low angle, shallow depth of field; face tack-sharp, background softly blurred. Output: Instagram feed portrait, 4:5 aspect ratio, 1080×1350, high detail. Constraints: no text, no logos/brands, no watermark, no extra fingers, no warped hands, no duplicate limbs, no plastic skin."
      },
      {
        title: "Fitness Progress Photo",
        prompt: "Transform this gym selfie into a fitness magazine-style photo of a man mid-workout. Lighting: dramatic side lighting emphasizing muscles, dark background. Style: realistic, high contrast, crisp details, no overdone smoothing. Constraints: keep body shape natural and realistic."
      },
      {
        title: "Formal Portrait With Blazer",
        prompt: "Create a studio portrait of a man wearing a dark blazer over a plain T-shirt. Background: neutral grey gradient. Lighting: softbox-style portrait lighting, gentle shadows. Style: realistic, sharp details, suitable for website 'About' page."
      },
      {
        title: "Travel Explorer Shot",
        prompt: "Turn this photo into an image of a man standing on a mountain viewpoint at sunrise. Add: clouds below, golden light on the face. Outfit: hiking jacket and backpack. Style: cinematic landscape, rich colors, wide-angle perspective. Instagram-ready"
      }
    ]
  },
  {
    category: "Women's Portraits",
    icon: "👗",
    prompts: [
      {
        title: "Soft Pastel Aesthetic Portrait",
        prompt: "Turn this portrait into a soft pastel aesthetic photo of a woman. Background: blurred flowers in pastel colors. Lighting: warm golden hour sunlight. Style: dreamy, gentle skin glow, light film grain, Instagram-ready."
      },
      {
        title: "Boss Mode Founder Shot",
        prompt: "Create a confident business portrait of a woman tech founder. Setting: modern office with glass walls and city view. Pose: standing with arms relaxed, looking into the camera. Style: realistic, neutral color grading, subtle depth of field. Constraints: keep outfit smart casual, no exaggerated fashion styling."
      },
      {
        title: "Festival / Party Look",
        prompt: "Transform this selfie into a festival photo of a woman with glitter makeup. Add: colorful lights and blurred crowd in the background. Style: energetic, high-saturation, lens flare and bokeh. Frame: close-up from shoulders up."
      },
      {
        title: "Editorial Beauty Shot",
        prompt: "Create an editorial-style beauty portrait of a woman. Background: solid color backdrop matching skin tone. Lighting: soft but directional, highlighting cheekbones. Style: magazine beauty shot, clean, sharp details, visible catchlights in the eyes."
      },
      {
        title: "Cozy Indoor Portrait",
        prompt: "Turn this photo into a cozy indoor portrait of a woman sitting by a window. Add: a mug of coffee, soft blanket, bookshelf in the back. Style: warm, slightly desaturated, natural light, shallow depth of field."
      }
    ]
  },
  {
    category: "Kids (Safe & Creative)",
    icon: "🧒",
    prompts: [
      {
        title: "Cartoon Princess (Girls)",
        prompt: "Turn this child's photo into a cute cartoon princess character. Outfit: sparkling dress and tiny crown. Background: magical forest with soft glowing lights. Style: colorful, big expressive eyes, simple shapes, kid-friendly. Constraints: no makeup or adult styling."
      },
      {
        title: "Fairy Tale Storybook (Girls)",
        prompt: "Create a storybook-style illustration of this girl reading a book under a tree. Add: small friendly animals and floating stars above the book. Style: watercolor children's book art, soft edges, warm colors."
      },
      {
        title: "Superhero Poster (Boys)",
        prompt: "Turn this boy into a comic-book superhero. Outfit: colorful suit with cape, simple emblem on chest. Background: stylized city skyline at sunset. Style: bold comic shading, halftone texture, dynamic pose. Constraints: no weapons, kid-safe action."
      },
      {
        title: "Football / Cricket Star (Boys)",
        prompt: "Transform this child's photo into a sports poster. Sport: cricket (or football). Setting: stadium at night with bright floodlights and cheering crowd. Style: realistic with slightly dramatic lighting, motion blur on background only."
      },
      {
        title: "Back-to-School Illustration",
        prompt: "Create a fun back-to-school image from this child's photo. Add: backpack, chalkboard with doodles of books and stars, stack of colorful notebooks. Style: bright, cheerful, cartoonish, simple shapes and clean lines."
      },
      {
        title: "Fantasy Animal Friend",
        prompt: "Turn this child into a character riding their favorite animal through the clouds. Animal: keep realistic but friendly. Background: big fluffy clouds, rainbow, sun rays. Style: whimsical, painterly, child-safe fantasy."
      }
    ]
  },
  {
    category: "Couples",
    icon: "💑",
    prompts: [
      {
        title: "Sunset Beach Portrait",
        prompt: "Turn this couples photo into a romantic sunset beach scene. Pose: couple holding hands, walking near the water. Lighting: warm golden sun low on the horizon. Style: cinematic, soft focus on background, realistic skin tones. Constraints: no added text or props."
      },
      {
        title: "Pre-Wedding Garden Shoot",
        prompt: "Transform this couple's photo into an elegant pre-wedding portrait. Setting: garden with fairy lights and flowers. Outfits: semi-formal, flowing dress and blazer. Style: soft, dreamy, slightly desaturated, shallow depth of field."
      },
      {
        title: "Minimalist Studio Portrait",
        prompt: "Create a minimalist studio portrait of a couple seated on a simple chair. Background: solid beige or light grey. Lighting: soft studio light, no harsh shadows. Style: modern, clean, suitable for framed wall print."
      },
      {
        title: "Polaroid Collage",
        prompt: "Turn these couple selfies into a collage of 4 Polaroid-style photos. Each frame: slightly different pose or expression. Background: neutral table with a few dried flowers. Style: realistic photos inside white Polaroid borders, soft warm tones."
      },
      {
        title: "Travel Postcard",
        prompt: "Create an image of this couple standing in front of a famous landmark. Choose: Eiffel Tower (or another location). Style: vibrant travel postcard, wide-angle composition. Constraints: keep facial features accurate, no added text."
      }
    ]
  },
  {
    category: "Traditional Saree",
    icon: "🪷",
    prompts: [
      {
        title: "Classic Saree Portrait",
        prompt: "Turn this portrait into a traditional saree photoshoot. Outfit: silk saree with elegant border, matching blouse. Jewelry: subtle gold jewelry and bangles. Background: softly blurred indoor setting with warm ambient light. Style: realistic, rich colors, soft vignette."
      },
      {
        title: "Bridal Saree Look",
        prompt: "Transform this image into a bridal saree portrait. Outfit: red or maroon bridal saree with intricate embroidery. Jewelry: detailed bridal jewellery set and visible mehendi on hands. Background: palace-style interior with soft warm light. Style: cinematic, high detail, suitable for large print."
      },
      {
        title: "Contemporary Saree Editorial",
        prompt: "Create a high-fashion editorial image of a model in a minimalist saree. Setting: modern studio with clean geometric shapes. Lighting: strong directional light creating interesting shadows. Style: fashion magazine cover, bold and dramatic."
      },
      {
        title: "Street Style Saree",
        prompt: "Turn this photo into an image of a woman wearing a saree in an urban street. Add: colorful wall art or graffiti in the background. Style: modern street-style photography, natural light, candid pose."
      },
      {
        title: "Festive Saree Celebration",
        prompt: "Create an image of this person wearing a saree during a festival celebration. Setting: decorated home with diyas or fairy lights. Style: warm, bright, celebratory, lots of color and sparkle."
      }
    ]
  },
  {
    category: "Trendy & Experimental",
    icon: "🎮",
    prompts: [
      {
        title: "3D Action Figure Version",
        prompt: "Turn this portrait into a stylized 3D action figure of this person. Style: plastic toy with glossy finish, big eyes, simplified features. Background: toy store-style shelf with blurred boxes. Constraints: keep main facial characteristics recognizable."
      },
      {
        title: "Retro Mall Studio Photo (90s)",
        prompt: "Transform this selfie into a retro 1990s mall photo studio portrait. Background: neon gradient backdrop with stars and shapes. Outfit: vintage 90s fashion, slightly oversized jacket. Style: slightly soft focus, cheesy but charming studio lighting."
      },
      {
        title: "Anime Poster",
        prompt: "Turn this person into an anime character on a poster. Background: dramatic city skyline at night with glowing lights. Style: Japanese anime key visual, bold colors, cel shading, dynamic pose. Constraints: no text; just the character and environment."
      },
      {
        title: "VHS Horror Cover",
        prompt: "Create an image in the style of a 1980s VHS horror movie cover. Subject: this person as the main character, looking over their shoulder. Background: dark forest with faint silhouettes. Style: grainy, slightly faded, with simple graphic shapes. Constraints: no gore, just spooky atmosphere."
      },
      {
        title: "Chibi Sticker Sheet",
        prompt: "Turn this portrait into a sheet of 6 chibi-style stickers of the same person. Each sticker: different outfit or expression (happy, angry, tired, excited, thinking, laughing). Style: kawaii, bold outlines, flat colors, white sticker border. Background: plain."
      }
    ]
  },
  {
    category: "Pro: E-commerce & Product",
    icon: "🛍️",
    prompts: [
      {
        title: "Product Consistency Carousel",
        prompt: "Show this exact product in 4 lifestyle scenes: 1) On a minimalist home office desk with a MacBook and coffee. 2) Inside a gym bag with a towel and water bottle. 3) On a restaurant table with wine glasses and candlelight. 4) In an open backpack on a forest hiking trail. Keep the product IDENTICAL in every image: same angle, same materials, same reflections, same color, same logo placement. Adjust only the environment, props, and lighting style. Use natural depth of field. Output 4 separate images at 2000×2000, ready for an e-commerce carousel."
      },
      {
        title: "Product Photography Consistency",
        prompt: "Create 6 professional product photos of this exact product, keeping its design, color, and any details completely consistent. Scenes: 1) Clean white background, front-facing e-commerce shot with soft front lighting. 2) Wooden desk with a journal and pen, daylight from a window on the left. 3) Gym bench with towel and water bottle, dramatic side lighting. 4) Car dashboard next to car keys, dashboard lights glowing softly. 5) Outdoor granite rock with hiking boots in the background, overcast daylight. 6) Dinner table with wine glass and menu, warm candlelight ambiance. In every scene, adjust only the environment and lighting style. 4K resolution, square 1:1 aspect ratio suitable for Instagram carousels."
      }
    ]
  },
  {
    category: "Pro: Branding & Logo",
    icon: "🏷️",
    prompts: [
      {
        title: "Logo Sketch → 8 Variations",
        prompt: "Turn this rough logo sketch into 8 professional logo variations: 1) Minimalist black line art on white. 2) Gradient blue-to-purple modern tech style. 3) Vintage badge with subtle distressed texture. 4) Neon glow logo on a dark background. 5) Watercolor artistic interpretation with soft edges. 6) Bold geometric version with simplified shapes. 7) Gold foil embossed look on dark card stock. 8) Hand-lettered organic style with natural curves. Keep the core logo concept and symbol recognizable in every variation, but explore clearly different visual directions. Present all 8 versions in a 4×2 grid, each variation clearly separated with a small label beneath it. High resolution, 4K, suitable for client presentations."
      },
      {
        title: "Localize Packaging for 6 Countries",
        prompt: "Localize this exact packaging design into 6 language versions: 1) Japanese 2) Arabic 3) Spanish 4) German 5) Simplified Chinese (Mandarin) 6) Hindi (Devanagari script). Translate ALL visible text into the correct language for each version. Preserve the layout exactly: same logo position, colors, shapes, and imagery. For Japanese, keep vertical text where appropriate. For Arabic, use proper right-to-left layout. Make all text sharp, aligned, and professional, as if originally designed in that language. Deliver 6 separate images, each clearly showing the localized packaging, at 4K resolution suitable for print mockups."
      }
    ]
  },
  {
    category: "Pro: Team & Corporate",
    icon: "🏢",
    prompts: [
      {
        title: "Remote Team → Group Photo",
        prompt: "Create a single professional group photo that looks like everyone was physically together. Scene: Modern office conference room with large windows and a city view. Natural afternoon light entering from the left. Arrange all people around a conference table in a natural meeting pose: some sitting, one standing and presenting, casual but professional. Match lighting direction and intensity across all faces. Keep each person's outfit, hairstyle, and appearance exactly as in their reference photo. Ensure shadows, reflections on the table, and perspective are consistent. The final image should look like a real corporate photo, not a collage. 4K resolution, landscape orientation."
      }
    ]
  },
  {
    category: "Pro: Fashion & Style",
    icon: "👠",
    prompts: [
      {
        title: "One Face, Five Time Periods",
        prompt: "Keep this person's face and features EXACTLY the same, but place them in 5 different time periods: 1) 1920s Great Gatsby era: flapper dress or tailored suit, finger waves or slicked hair, art deco interior. 2) 1950s American diner: poodle skirt or greaser style, chrome diner seats, classic car outside. 3) 1980s mall: bold neon colors, big hair, vintage arcade or mall background. 4) 1990s grunge: flannel shirt, Doc Martens, slightly gritty urban street. 5) 2020s minimalist style: clean, neutral outfit, modern interior with soft natural lighting. Make each scene historically accurate in clothing, hair, props, and color grading. Maintain the same facial structure and key features across all eras. Output 5 separate portrait images at high resolution."
      },
      {
        title: "Mood Board → Complete Outfit",
        prompt: "Combine elements from all reference images into one cohesive outfit. Create a full-body fashion photograph of a model wearing: The exact sneakers from the shoe reference, the fit and wash of the jeans from the pants reference, the color and cut of the jacket from the jacket reference, the accessories and overall vibe from the mood images. Scene: Urban rooftop at golden hour with a soft city skyline in the background, slightly out of focus. Natural warm sunset light as a rim light. Show the outfit from 2 angles: front view and 3/4 view. Output 2 separate 2K images, editorial quality."
      }
    ]
  },
  {
    category: "Pro: Technical & Diagrams",
    icon: "📊",
    prompts: [
      {
        title: "Code → OAuth 2.0 Diagram",
        prompt: "Turn this into a clean OAuth 2.0 flow diagram for technical documentation. Include these exact components: User, Client App, Authorization Server, Resource Server. Use color coding: User actions: blue (#2196F3), Successful responses: green (#4CAF50), Authorization steps: orange (#FF9800). Add labeled arrows: 1) Authorization Request 2) Authorization Grant 3) Access Token Request 4) Access Token 5) Protected Resource Request 6) Protected Resource. Use a modern, minimalist design with plenty of white space. Include small code snippet callouts in monospace font near key arrows. Export at 2000×2000, optimized for embedding in documentation."
      },
      {
        title: "Planet Sizes → Classroom Infographic",
        prompt: "Create an educational infographic comparing the diameters of the 8 planets in our solar system using these values (in km): Mercury 4,879, Venus 12,104, Earth 12,756, Mars 6,792, Jupiter 142,984, Saturn 120,536, Uranus 51,118, Neptune 49,528. Show all 8 planets to scale relative to each other, arranged horizontally in order from the Sun. Use scientifically accurate colors and textures for each planet. Label each planet with its name and exact diameter in a clean sans-serif font. Add a scale bar labeled '10,000 km' for reference and a title at the top: 'Solar System Planet Size Comparison'. Background: deep space black with subtle stars. Poster size: 24×36 inches, 300 DPI, suitable for classroom printing."
      }
    ]
  },
  {
    category: "Pro: Cinematic & Film",
    icon: "🎬",
    prompts: [
      {
        title: "Cinematic Sci-Fi Still",
        prompt: "Create a cinematic still from a sci-fi thriller. Subject: Indian female astronaut, early 30s, determined expression, hair in a tight bun. She is floating in zero gravity inside a damaged spacecraft corridor. Camera: 35mm lens equivalent, f/2.8 aperture for shallow depth of field, Eye-level medium shot (waist up). Lighting: Single harsh key light from a sparking control panel on the right (orange-red glow), Soft blue rim light from Earth visible through a cracked viewport behind her, Dim red practical lights from emergency strips along the corridor. Details: Floating debris catching light, Visible breath condensation in the cold air, Torn mission patch on her suit shoulder, Reflection of corridor damage in her helmet visor. Color grade: Teal and orange, slightly desaturated for tension. 4K resolution, 2.39:1 cinematic aspect ratio."
      },
      {
        title: "Historical Recreation",
        prompt: "Generate a historically accurate scene at coordinates 40.6892° N, 74.0445° W (Statue of Liberty, New York Harbor) on October 28, 1886, at 14:30 (2:30 PM), during the dedication ceremony. Show: Crowds on boats in the harbor, American flags and banners, Statue of Liberty newly unveiled, bright copper surface (not yet green), Spectators in authentic 1880s clothing, A mix of sailing ships and early steamboats, Period-accurate New York shoreline architecture. Atmosphere: Formal but celebratory public event. Autumn afternoon lighting from the southwest. Style: restored historical photograph with slight sepia tone and fine grain. 2000×2000 resolution suitable for print."
      }
    ]
  },
  {
    category: "Pro: Interior & Architecture",
    icon: "🏠",
    prompts: [
      {
        title: "Mood Board → Coffee Shop Interior",
        prompt: "Synthesize all references into a single cohesive interior design for a coffee shop. Combine: The color palette (warm terracottas and deep greens), wood texture and grain, soft intimate lighting mood, furniture style (mid-century modern), plant placement approach, wall art aesthetic, overall cozy sophisticated vibe. Scene: Main seating area with 4 small tables, one long community table, an espresso bar in the background, and large windows with natural light. Add plants throughout. View from a corner with a wide angle, showing most of the space. Photorealistic architectural visualization, 4K resolution, presentation-ready."
      }
    ]
  },
  {
    category: "Pro: Restaurant & Menu",
    icon: "🍽️",
    prompts: [
      {
        title: "Full Restaurant Menu Design",
        prompt: "Design a modern steakhouse menu for 'Ember & Oak Steakhouse'. Pages: 1) Appetizers – 6 items 2) Mains – 8 steak cuts with a temperature guide from rare to well done 3) Desserts – 4 items with wine pairing suggestions. Design: Black background with gold accents, Dish names in elegant serif font, Descriptions in clean sans-serif font, Prices right-aligned, Small icons for dietary restrictions (GF, V, VG). Layout each page to 8.5×11 inches at 300 DPI (print-ready). Make every letter sharp and readable: dish names, descriptions, prices, footnotes, and section titles."
      }
    ]
  },
  {
    category: "Pro: Pet & Character",
    icon: "🐾",
    prompts: [
      {
        title: "Pet → 3D Character Sheet",
        prompt: "Create a professional character design sheet of this pet as a 3D animated character. Include: Front view, Side profile, 3/4 view, Back view, Close-up of the face showing expression, A small walking animation pose lineup. Keep the pet's exact coloring, markings, and unique features consistent across all angles. Use a Pixar/Disney-style 3D look with clean cel-shading. Include a small color palette with hex codes for the main fur and eye colors. Use a clean white background with a subtle grid. Add the character's name at the top. 4K resolution, suitable for a pitch deck."
      }
    ]
  },
  {
    category: "Quick Edits",
    icon: "⚡",
    prompts: [
      {
        title: "Remove Background",
        prompt: "Remove the background from this image completely, making it transparent."
      },
      {
        title: "Replace Background with White",
        prompt: "Replace the background with a clean white background."
      },
      {
        title: "Add Blur to Background",
        prompt: "Add a soft blur to the background while keeping the subject sharp."
      },
      {
        title: "Make Black and White",
        prompt: "Convert this image to black and white with good contrast."
      },
      {
        title: "Apply Vintage Style",
        prompt: "Apply a vintage film style with warm tones and subtle grain."
      },
      {
        title: "Enhance Resolution",
        prompt: "Enhance the resolution and sharpness of this image."
      },
      {
        title: "Brighten the Image",
        prompt: "Brighten the image and improve the lighting."
      },
      {
        title: "Apply HDR Effect",
        prompt: "Apply an HDR effect to bring out details in highlights and shadows."
      }
    ]
  }
];

const Prompts = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handlePromptClick = (prompt: string) => {
    localStorage.setItem('selectedPrompt', prompt);
    navigate('/');
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground text-sm sm:text-base">
              Click any prompt to select it and return to the editor
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pr-4">
              {predefinedPrompts.map((category, idx) => (
                <Card
                  key={idx}
                  className="bg-card/80 backdrop-blur-sm border-border hover:shadow-card transition-shadow"
                >
                  <Collapsible
                    open={openCategories[category.category] ?? true}
                    onOpenChange={() => toggleCategory(category.category)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-secondary/30 transition-colors rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{category.icon}</span>
                            <CardTitle className="text-lg">{category.category}</CardTitle>
                          </div>
                          {openCategories[category.category] ?? true ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <CardDescription className="text-xs">
                          {category.prompts.length} prompts available
                        </CardDescription>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <div className="space-y-2">
                          {category.prompts.map((prompt, pIdx) => (
                            <Button
                              key={pIdx}
                              variant="outline"
                              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50 transition-colors text-sm group"
                              onClick={() => handlePromptClick(prompt.prompt)}
                            >
                              <div className="flex flex-col gap-1 w-full">
                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                  {prompt.title}
                                </span>
                                <span className="text-xs text-muted-foreground line-clamp-2">
                                  {prompt.prompt.slice(0, 100)}...
                                </span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>Developed by Harshavardhan • Powered by AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Prompts;
