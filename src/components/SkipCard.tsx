import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSkipImageUrl } from "@/types/skips";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkipCardProps {
  id: number;
  size: number;
  price: number;
  hirePeriod: number;
  allowedOnRoad: boolean;
  allowsHeavyWaste: boolean;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const SkipCard: React.FC<SkipCardProps> = ({
  id,
  size,
  price,
  hirePeriod,
  allowedOnRoad,
  allowsHeavyWaste,
  isSelected,
  onSelect,
}) => {
  const imagePath = getSkipImageUrl(size);

  const formattedPrice = price.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2",
        isSelected
          ? "border-primary ring-2 ring-primary ring-opacity-50"
          : "border-border"
      )}
      onClick={() => onSelect(id)}
    >
      <div className="relative">
        <img
          src={imagePath}
          alt={`${size} Yard Skip`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/uploads/fallback.png";
          }}
        />
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          {size} Yards
        </div>
        {isSelected && (
          <div className="absolute top-0 left-0 w-full h-full bg-primary/20 flex items-center justify-center">
            <div className="bg-primary text-white p-2 rounded-full">
              <Check className="h-8 w-8" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{size} Yard Skip</h3>
          <p className="text-primary text-2xl font-bold">{formattedPrice}</p>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          {hirePeriod} day hire period
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "text-xs font-medium rounded-full px-3 py-1.5 flex items-center gap-1",
                    allowedOnRoad
                      ? "bg-green-600/20 text-green-600"
                      : "bg-warning/20 text-warning-dark"
                  )}
                >
                  {allowedOnRoad ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Road Permit Ready</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      <span>Not For Road Use</span>
                    </>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {allowedOnRoad
                  ? "This skip can be placed on a public road with appropriate permit"
                  : "This skip cannot be placed on a public road"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "text-xs font-medium rounded-full px-3 py-1.5 flex items-center gap-1",
                    allowsHeavyWaste
                      ? "bg-blue-600/20 text-blue-600"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Info className="h-3 w-3" />
                  <span>
                    {allowsHeavyWaste ? "Heavy Waste" : "Light Waste Only"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {allowsHeavyWaste
                  ? "This skip can accommodate heavy waste materials like soil, rubble and concrete"
                  : "This skip is only suitable for light waste materials"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full justify-between"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
        >
          {isSelected ? "Selected" : "Select This Skip"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default SkipCard;
