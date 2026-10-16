import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "gray";
}

const colorClasses = {
  blue: "bg-blue-50 text-[#1C5BB8]",
  green: "bg-green-50 text-[#34A853]",
  yellow: "bg-yellow-50 text-[#FBBC05]",
  gray: "bg-gray-50 text-gray-600",
};

export function StatCard({ title, value, icon: Icon, color = "blue" }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
