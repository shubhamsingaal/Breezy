
import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/hooks/use-theme';
import { Alert } from '../types/weather';

interface WeatherAlertsProps {
  alerts: Alert;
}

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  const { theme } = useTheme();
  const [openAlertId, setOpenAlertId] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
      case 'extreme':
        return "bg-red-500";
      case 'moderate':
        return "bg-orange-500";
      case 'minor':
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  if (!alerts?.alert?.length) {
    return null;
  }
  
  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700 border-l-red-500' : 'bg-white border-l-red-500'} shadow-md transition-all duration-300 hover:shadow-lg border-l-4`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
          Weather Alerts ({alerts.alert.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-80">
          <div className="space-y-4">
            {alerts.alert.map((alert, index) => (
              <Collapsible 
                key={`${alert.event}-${index}`}
                open={openAlertId === `${alert.event}-${index}`}
                onOpenChange={() => {
                  setOpenAlertId(openAlertId === `${alert.event}-${index}` ? null : `${alert.event}-${index}`);
                }}
                className={`p-2 rounded-md ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{alert.event}</h3>
                  </div>
                  
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {openAlertId === `${alert.event}-${index}` ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 mt-1">
                  <span>Effective: {new Date(alert.effective).toLocaleString()}</span>
                  <span>Expires: {new Date(alert.expires).toLocaleString()}</span>
                </div>
                
                <CollapsibleContent className="mt-3">
                  <div className={`text-sm p-3 rounded-md ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {alert.desc}
                    </p>
                    
                    {alert.instruction && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="font-medium mb-1">Instructions:</p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {alert.instruction}
                        </p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts;
