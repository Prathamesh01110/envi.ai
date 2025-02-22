// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { useState } from "react";

// const data = [
//   { name: "Jan", value: 400 },
//   { name: "Feb", value: 300 },
//   { name: "Mar", value: 500 },
//   { name: "Apr", value: 700 },
//   { name: "May", value: 600 },
// ];

// export default function Dashboard() {
//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 min-h-screen">
//       {/* Stats Cards */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Total Users</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold">1,250</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Revenue</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold">$25,000</p>
//         </CardContent>
//       </Card>

//       <Card className="col-span-2">
//         <CardHeader>
//           <CardTitle>Sales Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <Card className="col-span-2">
//         <CardHeader>
//           <CardTitle>Monthly Revenue</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#82ca9d" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
