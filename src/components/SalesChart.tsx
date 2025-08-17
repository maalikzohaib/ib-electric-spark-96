import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const SalesChart = () => {
  const salesData = [
    { month: 'Jan', fans: 45, bulbs: 80, total: 125 },
    { month: 'Feb', fans: 52, bulbs: 95, total: 147 },
    { month: 'Mar', fans: 61, bulbs: 110, total: 171 },
    { month: 'Apr', fans: 70, bulbs: 125, total: 195 },
    { month: 'May', fans: 85, bulbs: 140, total: 225 },
    { month: 'Jun', fans: 95, bulbs: 155, total: 250 }
  ];

  const growthData = [
    { month: 'Jan', growth: 15 },
    { month: 'Feb', growth: 22 },
    { month: 'Mar', growth: 28 },
    { month: 'Apr', growth: 35 },
    { month: 'May', growth: 42 },
    { month: 'Jun', growth: 48 }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-slide-up border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-center text-primary">Monthly Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="fans" 
                    fill="hsl(var(--primary))" 
                    name="Ceiling Fans"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="bulbs" 
                    fill="hsl(var(--accent))" 
                    name="LED Bulbs"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up border-0 shadow-elegant" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="text-center text-primary">Growth Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">48%</div>
              <p className="text-muted-foreground">Growth This Year</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">250+</div>
              <p className="text-muted-foreground">Monthly Sales</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <p className="text-muted-foreground">Product Categories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesChart;