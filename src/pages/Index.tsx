import { useState, useEffect, useCallback } from "react";
import ProgressSteps from "@/components/ProgressSteps";
import SkipCard from "@/components/SkipCard";
import { Button } from "@/components/ui/button";
import { Skip, SKIPS_API_URL } from "@/types/skips";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchSkips = async () => {
      setLoading(true);
      try {
        const response = await fetch(SKIPS_API_URL);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const skipData = await response.json();
        if (isMounted) {
          setSkips(skipData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching skips:", err);
        if (isMounted) {
          setError("Failed to load skip data. Please try again later.");
          setLoading(false);
          toast({
            title: "Error",
            description: "Failed to load skip data. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    fetchSkips();
    return () => {
      isMounted = false;
    };
  }, []); // Intentionally omitting 'toast' from deps as it's stable

  const handleSkipSelection = useCallback(
    (id: number) => {
      setSelectedSkipId(id);
      const selectedSkip = skips.find((skip) => skip.id === id);
      if (selectedSkip) {
        toast({
          title: "Skip Selected",
          description: `You selected ${selectedSkip.size} Yard Skip`,
        });
      }
    },
    [skips, toast]
  );

  const handleContinue = useCallback(() => {
    if (!selectedSkipId) {
      toast({
        title: "Please select a skip",
        description: "You need to select a skip before continuing.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, we'd navigate to the next step
    toast({
      title: "Proceeding to next step",
      description:
        "In a real app, this would navigate to the Permit Check page.",
    });
  }, [selectedSkipId, toast]);

  const handleBack = useCallback(() => {
    // In a real application, we'd navigate to the previous step
    toast({
      title: "Going back",
      description: "In a real app, this would navigate to the Waste Type page.",
    });
  }, [toast]);

  // Calculate total price (including VAT)
  const calculateTotalPrice = (skip: Skip): number => {
    // return skip.price_before_vat * (1 + skip.vat / 100); // Uncomment if you want to include VAT in the price
    // For now, we will just return the price before VAT
    return skip.price_before_vat;
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="hidden sm:block">
          <ProgressSteps currentStep={3} />
        </div>

        {/* Mobile Progress Indicator */}
        <div className="flex justify-between items-center mb-6 sm:hidden">
          <div className="text-sm text-muted-foreground">Step 3 of 6</div>
          <div className="font-bold">Select Skip</div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Choose Your Skip Size</h1>
          <p className="text-muted-foreground">
            Select the skip size that best suits your needs
          </p>
        </div>

        {loading ? (
          // Loading state
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center text-destructive p-8">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          // Skips grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skips.map((skip) => (
              <SkipCard
                key={skip.id}
                id={skip.id}
                size={skip.size}
                price={calculateTotalPrice(skip)}
                hirePeriod={skip.hire_period_days}
                allowedOnRoad={skip.allowed_on_road}
                allowsHeavyWaste={skip.allows_heavy_waste}
                isSelected={skip.id === selectedSkipId}
                onSelect={handleSkipSelection}
              />
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-12">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>

          <Button onClick={handleContinue} className="flex items-center">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selection summary - fixed at bottom for mobile */}
      {selectedSkipId && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:hidden">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Selected Skip</p>
              <p className="font-bold">
                {skips.find((skip) => skip.id === selectedSkipId)?.size} Yard
                Skip
              </p>
            </div>
            <Button
              onClick={handleContinue}
              size="sm"
              className="flex items-center"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
