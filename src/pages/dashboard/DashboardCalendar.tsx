import { Calendar } from "lucide-react";
import { TradingCalendar } from "@/components/TradingCalendar";

export default function DashboardCalendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          Trading Calendar
        </h1>
        <p className="text-muted-foreground mt-2">
          Plan your trades and track important market events
        </p>
      </div>

      <div className="w-full">
        <TradingCalendar />
      </div>
    </div>
  );
}