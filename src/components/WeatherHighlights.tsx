
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { CurrentWeather, Forecast } from '../types/weather';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Droplets, Thermometer } from 'lucide-react';

interface WeatherHighlightsProps {
  current: CurrentWeather;
  forecast: Forecast;
  unitSystem: 'metric' | 'imperial';
}

const WeatherHighlights = ({ current, forecast, unitSystem }: WeatherHighlightsProps) => {
  const { theme } = useTheme();
  
  const hourlyData = forecast.forecastday[0]?.hour.map((hour) => {
    const date = new Date(hour.time);
    return {
      time: date.getHours() + ':00',
      temp: unitSystem === 'metric' ? hour.temp_c : hour.temp_f,
      feelsLike: unitSystem === 'metric' ? hour.feelslike_c : hour.feelslike_f,
      humidity: hour.humidity,
      precip: unitSystem === 'metric' ? hour.precip_mm : hour.precip_in,
      wind: unitSystem === 'metric' ? hour.wind_kph : hour.wind_mph,
    };
  });

  const dailyTempData = forecast.forecastday.map((day) => {
    const date = new Date(day.date);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      min: unitSystem === 'metric' ? day.day.mintemp_c : day.day.mintemp_f,
      max: unitSystem === 'metric' ? day.day.maxtemp_c : day.day.maxtemp_f,
      precip: unitSystem === 'metric' ? day.day.totalprecip_mm : day.day.totalprecip_in,
    };
  });

  // Calculate temperature gradient for charts
  const tempColor = theme === 'dark' ? '#3b82f6' : '#0284c7';
  const precipColor = theme === 'dark' ? '#22d3ee' : '#06b6d4';
  const humidityColor = theme === 'dark' ? '#a855f7' : '#9333ea';
  
  return (
    <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'} shadow-md transition-all duration-300 hover:shadow-lg animate-pop`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          Weather Trends
        </CardTitle>
        <CardDescription className="text-sm">
          Visualized weather patterns for {forecast.forecastday[0]?.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="temperature" className="mb-4">
          <TabsList className={`grid w-full grid-cols-3 ${theme === 'dark' ? 'bg-slate-700' : ''}`}>
            <TabsTrigger value="temperature">
              <Thermometer className="h-4 w-4 mr-1" /> Temperature
            </TabsTrigger>
            <TabsTrigger value="precipitation">
              <Droplets className="h-4 w-4 mr-1" /> Precipitation
            </TabsTrigger>
            <TabsTrigger value="humidity">
              <Droplets className="h-4 w-4 mr-1" /> Humidity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="temperature" className="pt-4">
            <div className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hourlyData}
                  margin={{ top: 5, right: 30, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                    tickMargin={10} 
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                    tickMargin={10}
                    label={{ 
                      value: unitSystem === 'metric' ? '°C' : '°F', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }
                    }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      borderColor: theme === 'dark' ? '#374151' : '#e2e8f0',
                      color: theme === 'dark' ? '#f9fafb' : '#111827'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    name={`Temperature (${unitSystem === 'metric' ? '°C' : '°F'})`}
                    stroke={tempColor} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="feelsLike" 
                    name={`Feels Like (${unitSystem === 'metric' ? '°C' : '°F'})`}
                    stroke="#64748b" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="precipitation" className="pt-4">
            <div className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hourlyData}
                  margin={{ top: 5, right: 30, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                    tickMargin={10} 
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                    tickMargin={10} 
                    label={{ 
                      value: unitSystem === 'metric' ? 'mm' : 'in', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      borderColor: theme === 'dark' ? '#374151' : '#e2e8f0',
                      color: theme === 'dark' ? '#f9fafb' : '#111827'
                    }} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="precip" 
                    name={`Precipitation (${unitSystem === 'metric' ? 'mm' : 'in'})`}
                    fill={precipColor} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="humidity" className="pt-4">
            <div className="h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hourlyData}
                  margin={{ top: 5, right: 30, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e2e8f0'} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                    tickMargin={10} 
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                    tickMargin={10} 
                    domain={[0, 100]}
                    label={{ 
                      value: '%', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      borderColor: theme === 'dark' ? '#374151' : '#e2e8f0',
                      color: theme === 'dark' ? '#f9fafb' : '#111827'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    name="Humidity (%)"
                    stroke={humidityColor} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherHighlights;
