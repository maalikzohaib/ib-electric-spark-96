import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesChart = () => {
  const electricalData = [
    { month: 'Jan', reliability: 92, efficiency: 88, powerSaving: 15, sales: 125 },
    { month: 'Feb', reliability: 94, efficiency: 90, powerSaving: 18, sales: 147 },
    { month: 'Mar', reliability: 95, efficiency: 92, powerSaving: 22, sales: 171 },
    { month: 'Apr', reliability: 96, efficiency: 94, powerSaving: 25, sales: 195 },
    { month: 'May', reliability: 97, efficiency: 95, powerSaving: 28, sales: 225 },
    { month: 'Jun', reliability: 98, efficiency: 96, powerSaving: 32, sales: 250 }
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Our Growth Story
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track our journey of success and consistent growth in the electrical market
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="animate-slide-up border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-center text-primary text-2xl">Electrical Performance & Reliability Metrics</CardTitle>
              <p className="text-center text-muted-foreground mt-2">
                Demonstrating the superior reliability, efficiency, and power consumption of our electrical products
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={electricalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[80, 100]}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={[0, 40]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => {
                      if (name === 'Reliability' || name === 'Efficiency') {
                        return [`${value}%`, name];
                      }
                      if (name === 'Power Saving') {
                        return [`${value}%`, name];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="reliability" 
                    fill="hsl(var(--primary))" 
                    name="Reliability"
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="efficiency" 
                    fill="hsl(var(--accent))" 
                    name="Efficiency"
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="powerSaving" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    name="Power Saving"
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-card rounded-lg shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-muted-foreground">Product Reliability</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-card">
              <div className="text-3xl font-bold text-accent mb-2">96%</div>
              <p className="text-muted-foreground">Energy Efficiency</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-card">
              <div className="text-3xl font-bold text-success mb-2">32%</div>
              <p className="text-muted-foreground">Power Consumption Reduction</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">250+</div>
              <p className="text-muted-foreground">Monthly Sales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesChart;