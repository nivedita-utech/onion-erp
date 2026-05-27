import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import {
  HiOutlineCurrencyDollar, HiOutlineUserGroup, HiOutlineClipboardList,
  HiOutlineExclamation, HiOutlineTruck, HiOutlineCash,
} from 'react-icons/hi';
import CustomLineChart from '../../components/charts/LineChart';
import CustomBarChart from '../../components/charts/BarChart';
import CustomPieChart from '../../components/charts/PieChart';

import { useGetAccountsSummaryQuery } from '../../api/accountsApi';
import { useGetSalesReportQuery, useGetProfitLossQuery } from '../../api/reportsApi';
import { useGetLeadsQuery } from '../../api/leadsApi';
import { useGetProductionSummaryQuery } from '../../api/productionApi';

const Overview = () => {
  const { data: summary } = useGetAccountsSummaryQuery();
  const { data: leads } = useGetLeadsQuery({ limit: 0 });
  const { data: salesReport } = useGetSalesReportQuery();
  const { data: pnl } = useGetProfitLossQuery();
  const { data: productionSummary } = useGetProductionSummaryQuery();

  const finance = summary?.data || {};

  const stats = [
    { title: 'Total Revenue', value: `₹${(finance.revenue || 0).toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: 'primary', trend: 'up', trendValue: '12%' },
    { title: 'Active Leads', value: leads?.total || '0', icon: HiOutlineUserGroup, color: 'blue', trend: 'up', trendValue: '8%' },
    { title: 'Net Profit', value: `₹${(finance.netProfit || 0).toLocaleString()}`, icon: HiOutlineCash, color: 'purple', trend: 'up', trendValue: '5%' },
    { title: 'In Transit', value: '3', icon: HiOutlineTruck, color: 'green' },
  ];

  // Helper to map report data to chart format
  const monthlySalesData = salesReport?.data?.monthlySales || [
    { name: 'Loading...', sales: 0 }
  ];

  const topProductsData = salesReport?.data?.topProducts || [];

  const revenueSplitData = [
    { name: 'Export', value: 65 }, { name: 'Domestic', value: 35 },
  ];

  const purchaseVsSalesData = pnl?.data?.comparison || [];
  const productionOutputData = productionSummary?.data?.monthlyOutput || [];

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your business overview."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Dashboard' }]}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CustomLineChart
          title="Monthly Sales Revenue (₹)"
          data={monthlySalesData}
          xKey="name"
          lines={[{ dataKey: 'sales', color: '#ee7a0e', name: 'Revenue' }]}
        />
        <CustomBarChart
          title="Top 5 Products by Quantity (kg)"
          data={topProductsData}
          xKey="name"
          bars={[{ dataKey: 'qty', color: '#369367', name: 'Quantity Sold' }]}
        />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CustomPieChart
          title="Revenue Split (%)"
          data={revenueSplitData}
        />
        <CustomBarChart
          title="Monthly Purchase vs Sales (₹)"
          data={purchaseVsSalesData}
          xKey="name"
          bars={[
            { dataKey: 'purchase', color: '#ef4444', name: 'Purchase Cost' },
            { dataKey: 'sales', color: '#3b82f6', name: 'Sales Revenue' },
          ]}
        />
        <CustomLineChart
          title="Production Output (kg)"
          data={productionOutputData}
          xKey="name"
          lines={[{ dataKey: 'output', color: '#8b5cf6', name: 'Output Qty' }]}
        />
      </div>
    </div>
  );
};

export default Overview;
