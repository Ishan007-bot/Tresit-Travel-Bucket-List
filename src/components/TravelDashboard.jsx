import React, { useMemo } from 'react';
import { useTravel } from '../contexts/TravelContext';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import '../styles/TravelDashboard.css';

const TravelDashboard = () => {
  const { savedDestinations } = useTravel();
  
  // Calculate stats for visualizations
  const stats = useMemo(() => {
    // Status distribution
    const statusCount = {
      wishlist: savedDestinations.filter(d => d.status === 'wishlist').length,
      planning: savedDestinations.filter(d => d.status === 'planning').length,
      booked: savedDestinations.filter(d => d.status === 'booked').length,
      visited: savedDestinations.filter(d => d.status === 'visited').length,
    };
    
    // Region distribution
    const regionCount = savedDestinations.reduce((acc, curr) => {
      const region = curr.region || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});
    
    // Convert region data to array for chart
    const regionData = Object.entries(regionCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Status data for pie chart
    const statusData = [
      { name: 'Wishlist', value: statusCount.wishlist, color: '#f39c12' },
      { name: 'Planning', value: statusCount.planning, color: '#9b59b6' },
      { name: 'Booked', value: statusCount.booked, color: '#3498db' },
      { name: 'Visited', value: statusCount.visited, color: '#27ae60' },
    ].filter(item => item.value > 0);
    
    return {
      statusData,
      regionData,
      totalDestinations: savedDestinations.length,
      visitedPercent: savedDestinations.length 
        ? Math.round((statusCount.visited / savedDestinations.length) * 100) 
        : 0
    };
  }, [savedDestinations]);

  if (savedDestinations.length === 0) {
    return (
      <div className="dashboard-empty">
        <h3>No travel destinations saved yet</h3>
        <p>Add destinations to see your travel statistics</p>
      </div>
    );
  }

  return (
    <div className="travel-dashboard">
      <div className="dashboard-header">
        <div className="stat-highlight">
          <h3>Total Destinations</h3>
          <div className="stat-value">{stats.totalDestinations}</div>
        </div>
        
        <div className="stat-highlight">
          <h3>Visited</h3>
          <div className="stat-value with-percent">
            {stats.statusData.find(s => s.name === 'Visited')?.value || 0}
            <span className="percent">{stats.visitedPercent}%</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Travel Status</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Destinations by Region</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={stats.regionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Countries" fill="#6c5ce7" animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDashboard; 