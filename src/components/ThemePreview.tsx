import { useTheme, Theme } from "@/hooks/useTheme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const themePreviews: Record<Theme, { name: string; description: string; emoji: string }> = {
  light: { name: "Light", description: "Clean and bright theme", emoji: "☀️" },
  dark: { name: "Dark", description: "Easy on the eyes", emoji: "🌙" },
};

export function ThemePreview() {
  const { theme: currentTheme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div
        className="text-center p-6"
        style={{
          borderRadius: "50px",
          background: "#e0e0e0",
          boxShadow: "inset 30px 30px 59px #bebebe, inset -30px -30px 59px #ffffff",
        }}
      >
        <h2 className="text-2xl font-bold mb-2">Theme Gallery</h2>
        <p className="text-muted-foreground">
          Preview and switch between light and dark themes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(themePreviews).map(([themeKey, preview]) => {
          const theme = themeKey as Theme;
          const isActive = currentTheme === theme;

          return (
            <Card
              key={theme}
              className={`cursor-pointer transition-all duration-200 border-0 ${
                isActive ? "ring-2 ring-primary" : ""
              }`}
              style={{
                borderRadius: "50px",
                background: "#e0e0e0",
                boxShadow: "inset 30px 30px 59px #bebebe, inset -30px -30px 59px #ffffff",
              }}
              onClick={() => setTheme(theme)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{preview.emoji}</span>
                    {preview.name}
                  </CardTitle>
                  {isActive && <Badge variant="default">Active</Badge>}
                </div>
                <CardDescription>{preview.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Color swatches */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary border"></div>
                    <div className="w-6 h-6 rounded-full bg-secondary border"></div>
                    <div className="w-6 h-6 rounded-full bg-accent border"></div>
                    <div className="w-6 h-6 rounded-full bg-muted border"></div>
                  </div>

                  {/* Sample text */}
                  <div className="space-y-1">
                    <div className="h-2 bg-primary rounded"></div>
                    <div className="h-2 bg-secondary rounded w-3/4"></div>
                    <div className="h-2 bg-accent rounded w-1/2"></div>
                  </div>

                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme(theme);
                    }}
                  >
                    {isActive ? "Current Theme" : "Apply Theme"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div
        className="text-center text-sm text-muted-foreground p-6"
        style={{
          borderRadius: "50px",
          background: "#e0e0e0",
          boxShadow: "inset 30px 30px 59px #bebebe, inset -30px -30px 59px #ffffff",
        }}
      >
        <p>💡 Tip: Use the palette icon in the navbar to switch themes quickly.</p>
      </div>
    </div>
  );
}