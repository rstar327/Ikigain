import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

interface IkigaiChartProps {
  scores: {
    passion: number;
    mission: number;
    vocation: number;
    profession: number;
    overall: number;
  };
  subcategoryScores?: Record<string, Record<string, number>>;
  primaryType?: string;
  secondaryType?: string;
  strengths?: string[];
  recommendations?: {
    description: string;
    careers: string[];
    actions: string[];
  };
}

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  const fontSize = payload.name.length > 15 ? 13 : 14;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={fontSize}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`${Math.round(percent * 100)}%`}
      </text>
    </g>
  );
};

const PieChartComponent = ({ data }: { data: { name: string; value: number }[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            animationBegin={0}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
            <div 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm font-medium text-gray-700">{entry.name}</span>
            <span className="text-sm text-gray-500 ml-auto">({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatSubcategoryLabel = (subcategory: string): string => {
  return subcategory.replace(/([A-Z])/g, ' $1').trim();
};

export default function IkigaiChart({ 
  scores, 
  subcategoryScores, 
}: IkigaiChartProps) {
  const { t } = useTranslation(['results']);
  const mainCategoryData = [
    { name: t('results:pillars.passion.title'), value: scores.passion },
    { name: t('results:pillars.vocation.title'), value: scores.vocation },
    { name: t('results:pillars.mission.title'), value: scores.mission },
    { name: t('results:pillars.profession.title'), value: scores.profession },
  ];

  // Create subcategory data from the primary category
  const primaryCategory = mainCategoryData.reduce((prev, current) => 
    prev.value > current.value ? prev : current
  ).name.toLowerCase();

  const subcategoryData = subcategoryScores && subcategoryScores[primaryCategory] 
    ? Object.entries(subcategoryScores[primaryCategory])
        .filter(([_, score]) => score > 0)
        .map(([subcategory, score]) => ({
          name: formatSubcategoryLabel(subcategory),
          value: score,
        }))
    : [];

  return (
    <div className="space-y-6">
      <PieChartComponent data={mainCategoryData} />
      
      {subcategoryData.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            {t('results:vocations.title')}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {subcategoryData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{t(`results:vocations.${item.name}`, { defaultValue: item.name })}</span>
                <span className="text-sm font-bold text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}