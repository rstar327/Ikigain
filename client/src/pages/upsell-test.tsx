import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

export default function UpsellTest() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Premium Analysis Upsell</h1>
        <div className="text-center">
          <p className="text-lg mb-4">This is a test upsell page</p>
          <Button>Test Button</Button>
        </div>
      </div>
    </div>
  );
}