import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <Loader2 className='h-8 w-8 animate-spin text-primary' />
    </div>
  );
  if (isError) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <p className='text-destructive font-medium text-sm'>Failed to load dashboard data</p>
    </div>
  );

  const purchasedCourse = data?.purchasedCourse || [];

  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId?.courseTitle || "Unknown",
    price: course.courseId?.coursePrice || 0
  }))

  const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
  const totalSales = purchasedCourse.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Overview of your course performance</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl sm:rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingCart size={16} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <p className="text-2xl sm:text-3xl font-extrabold gradient-text">{totalSales}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Courses sold</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl sm:rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign size={16} className="text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <p className="text-2xl sm:text-3xl font-extrabold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl sm:rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Avg. Price</CardTitle>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">₹{totalSales > 0 ? Math.round(totalRevenue / totalSales).toLocaleString() : 0}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Per course</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="rounded-xl sm:rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-bold">Course Revenue Overview</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">Revenue breakdown by course</p>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                angle={-20}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis stroke="#64748b" fontSize={10} tick={{ fontSize: 10 }} width={40} />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Price"]}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ stroke: "#6366f1", strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;