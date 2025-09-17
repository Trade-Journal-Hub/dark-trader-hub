import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, CalendarDays, TrendingUp, TrendingDown, CalendarIcon, Filter } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addYears, subYears, startOfWeek, endOfWeek, addWeeks, subWeeks, eachWeekOfInterval, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

interface TradingEvent {
  date: Date;
  type: "profit" | "loss" | "neutral";
  amount: number;
  description: string;
}

const mockTradingEvents: TradingEvent[] = [
  { date: new Date(2024, 8, 5), type: "profit", amount: 1250, description: "AAPL Call Options" },
  { date: new Date(2024, 8, 12), type: "loss", amount: -340, description: "TSLA Put Options" },
  { date: new Date(2024, 8, 18), type: "profit", amount: 890, description: "SPY Day Trade" },
  { date: new Date(2024, 8, 25), type: "profit", amount: 2100, description: "NVDA Swing Trade" },
  { date: new Date(2024, 8, 28), type: "neutral", amount: 0, description: "No Trading" },
];

type ViewMode = "month" | "week" | "year";

export function TradingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Generate year options (current year ± 10 years)
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigatePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subYears(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addYears(currentDate, 1));
    }
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonth, 1);
    setCurrentDate(newDate);
  };

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    setCurrentDate(newDate);
    setViewMode("month");
  };

  const getEventsForDate = (date: Date) => {
    return mockTradingEvents.filter(event => isSameDay(event.date, date));
  };

  const getDayEvents = (date: Date) => {
    const events = getEventsForDate(date);
    if (events.length === 0) return null;
    
    const totalPnL = events.reduce((sum, event) => sum + event.amount, 0);
    return {
      count: events.length,
      totalPnL,
      type: totalPnL > 0 ? "profit" : totalPnL < 0 ? "loss" : "neutral"
    };
  };

  const getDateRangePnL = () => {
    if (!dateRange.from || !dateRange.to) return null;
    
    const rangeEvents = mockTradingEvents.filter(event => 
      isWithinInterval(event.date, { start: dateRange.from!, end: dateRange.to! })
    );
    
    const totalPnL = rangeEvents.reduce((sum, event) => sum + event.amount, 0);
    const profitDays = rangeEvents.filter(event => event.amount > 0).length;
    const lossDays = rangeEvents.filter(event => event.amount < 0).length;
    
    return {
      totalPnL,
      totalTrades: rangeEvents.length,
      profitDays,
      lossDays,
      events: rangeEvents
    };
  };

  // Function to get color based on P&L amount
  const getPnLColor = (amount: number) => {
    if (amount === 0) return { bg: "bg-muted/20", text: "text-muted-foreground" };
    
    const absAmount = Math.abs(amount);
    
    if (amount > 0) {
      // Green shades for profit - darker green for higher profits
      if (absAmount >= 2000) return { bg: "bg-green-600/80", text: "text-white" };
      if (absAmount >= 1000) return { bg: "bg-green-500/60", text: "text-white" };
      if (absAmount >= 500) return { bg: "bg-green-400/50", text: "text-green-900" };
      return { bg: "bg-green-200/60", text: "text-green-800" };
    } else {
      // Red shades for loss - darker red for higher losses
      if (absAmount >= 2000) return { bg: "bg-red-600/80", text: "text-white" };
      if (absAmount >= 1000) return { bg: "bg-red-500/60", text: "text-white" };
      if (absAmount >= 500) return { bg: "bg-red-400/50", text: "text-red-900" };
      return { bg: "bg-red-200/60", text: "text-red-800" };
    }
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <TooltipProvider>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center font-semibold text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map(day => {
              const dayEvents = getDayEvents(day);
              const totalPnL = dayEvents?.totalPnL || 0;
              const colorScheme = getPnLColor(totalPnL);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <Tooltip key={day.toISOString()}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "h-24 flex flex-col items-center justify-center p-2 transition-all hover:scale-105",
                        isToday && "ring-2 ring-primary",
                        dayEvents && colorScheme.bg,
                        dayEvents && colorScheme.text
                      )}
                      onClick={() => setSelectedDate(day)}
                    >
                      <span className="text-lg font-semibold">{day.getDate()}</span>
                      <span className="text-xs opacity-70">{format(day, 'MMM')}</span>
                    </Button>
                  </TooltipTrigger>
                  {dayEvents && (
                    <TooltipContent side="top" className="bg-background border shadow-lg">
                      <div className="text-center">
                        <p className="font-medium">{format(day, "MMM dd, yyyy")}</p>
                        <p className={cn(
                          "text-sm font-semibold",
                          totalPnL >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          P&L: {totalPnL >= 0 ? '+' : ''}₹{totalPnL}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dayEvents.count} trade{dayEvents.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
    );
  };

  const renderYearView = () => {
    return (
      <div className="grid grid-cols-3 gap-4 p-6">
        {monthNames.map((month, index) => (
          <Button
            key={month}
            variant={index === currentMonth ? "default" : "outline"}
            className="h-20 flex flex-col gap-1 hover:scale-105 transition-all duration-200"
            onClick={() => handleMonthClick(index)}
          >
            <span className="font-semibold">{month}</span>
            <span className="text-xs opacity-70">{currentYear}</span>
          </Button>
        ))}
      </div>
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Calendar Card */}
        <Card className="flex-1 overflow-hidden border-primary/10 hover:border-primary/20 transition-colors">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <CalendarDays className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Trading Calendar</CardTitle>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month View</SelectItem>
                    <SelectItem value="week">Week View</SelectItem>
                    <SelectItem value="year">Year View</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={navigatePrevious}
                className="hover:scale-110 transition-transform"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-semibold">
                {viewMode === "month" 
                  ? format(currentDate, "MMMM yyyy")
                  : viewMode === "week" 
                  ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM dd")} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM dd, yyyy")}`
                  : currentYear
                }
              </h2>
              
              <Button
                variant="outline"
                size="sm"
                onClick={navigateNext}
                className="hover:scale-110 transition-transform"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <TooltipProvider>
              {viewMode === "year" ? renderYearView() : 
               viewMode === "week" ? renderWeekView() : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="w-full pointer-events-auto"
                  classNames={{
                    months: "flex w-full",
                    month: "w-full",
                    table: "w-full border-collapse",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full font-medium text-sm text-center p-2",
                    row: "flex w-full mt-2",
                    cell: "h-14 w-full text-center text-sm p-0 relative hover:bg-accent/50 transition-colors",
                    day: "h-full w-full p-0 font-normal flex flex-col items-center justify-center relative",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_outside: "text-muted-foreground/50",
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      const dayEvents = getDayEvents(date);
                      const totalPnL = dayEvents?.totalPnL || 0;
                      const colorScheme = getPnLColor(totalPnL);
                      
                      if (!dayEvents) {
                        return (
                          <div className="flex flex-col items-center justify-center h-full w-full">
                            <span className="text-sm">{date.getDate()}</span>
                          </div>
                        );
                      }

                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "flex flex-col items-center justify-center h-full w-full rounded-md transition-all duration-200 hover:scale-105",
                              colorScheme.bg,
                              colorScheme.text
                            )}>
                              <span className="text-sm font-medium">{date.getDate()}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-background border shadow-lg">
                            <div className="text-center">
                              <p className="font-medium">{format(date, "MMM dd, yyyy")}</p>
                              <p className={cn(
                                "text-sm font-semibold",
                                totalPnL >= 0 ? "text-green-600" : "text-red-600"
                              )}>
                                P&L: {totalPnL >= 0 ? '+' : ''}₹{totalPnL}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {dayEvents.count} trade{dayEvents.count !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                  }}
                />
              )}
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* Event Details Card */}
        {(viewMode === "month" || viewMode === "week") && (
          <Card className="lg:w-80 border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Events
                {selectedDate && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {format(selectedDate, "MMM dd, yyyy")}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{event.description}</span>
                        <div className="flex items-center gap-1">
                          {event.type === "profit" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : event.type === "loss" ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : null}
                          <Badge variant={event.type === "profit" ? "default" : event.type === "loss" ? "destructive" : "secondary"}>
                            {event.amount > 0 ? "+" : ""}₹{event.amount}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total P&L:</span>
                      <span className={selectedDateEvents.reduce((sum, event) => sum + event.amount, 0) >= 0 ? "text-green-600" : "text-red-600"}>
                        ₹{selectedDateEvents.reduce((sum, event) => sum + event.amount, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No trading events on this date</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Date Range Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Range Picker */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Date Range Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                      disabled={(date) => dateRange.from ? date < dateRange.from : false}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Range Results */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Range P&L Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const rangePnL = getDateRangePnL();
              if (!rangePnL) {
                return (
                  <div className="text-center py-6">
                    <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Select date range to view P&L analysis</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className={`text-2xl font-bold ${rangePnL.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{rangePnL.totalPnL.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total P&L</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-primary">
                        {rangePnL.totalTrades}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-lg font-semibold text-green-600">
                        {rangePnL.profitDays}
                      </div>
                      <div className="text-sm text-green-700">Profit Days</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                      <div className="text-lg font-semibold text-red-600">
                        {rangePnL.lossDays}
                      </div>
                      <div className="text-sm text-red-700">Loss Days</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">
                      Win Rate: {rangePnL.totalTrades > 0 ? ((rangePnL.profitDays / rangePnL.totalTrades) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${rangePnL.totalTrades > 0 ? (rangePnL.profitDays / rangePnL.totalTrades) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      {(viewMode === "month" || viewMode === "week") && (
        <Card className="border-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Profitable Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Loss Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span>Break Even</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}