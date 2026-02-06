import TotalDialsChart from "@/components/charts/TotalDialsChart";
import TotalMinutesChart from "@/components/charts/TotalMinutesChart";
import ChartCard from "@/components/common/ChartCard";
import StatCommonCard from "@/components/common/StatCard";

const Dashboard = () => {
  return (
    <div className="bg-[#F6F8FB]">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCommonCard title="Time Saved" value="0 hours" />

        <StatCommonCard title="Appointments booked" value="20" subText="70%" />

        <StatCommonCard title="Appointments booked" value="05" subText="30%" />

        <StatCommonCard title="Successful transfers" value="20" />
        <StatCommonCard title="Average Call Time" value="50m 15s" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <ChartCard
          title="Total Dials"
          value="20"
          percentageValue="04.6%"
          trend="up"
        >
          <TotalDialsChart />
        </ChartCard>

        <ChartCard
          title="Total Minutes"
          value="10m 20s"
          percentageValue="16.8%"
          trend="up"
        >
          <TotalMinutesChart />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
