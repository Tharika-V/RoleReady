import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';

function ProgressCharts({ tasks = [] }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.status === 'Completed'
  ).length;

  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const chartData = [
    {
      name: 'Learning',
      value: progress,
      fill: '#5145e5'
    }
  ];

  return (
    <div
      style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        textAlign: 'center',
        width: '100%',
        maxWidth: '320px'
      }}
    >
      <h3 style={{ margin: '0 0 8px', color: '#172554' }}>
        Learning Completion
      </h3>

      <p style={{ color: '#718096', fontSize: '13px' }}>
        Your completed learning tasks
      </p>

      <div style={{ position: 'relative', width: '100%', height: '210px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="92%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={20}
              background={{ fill: '#eeedff' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none'
          }}
        >
          <strong style={{ fontSize: '36px', color: '#172554' }}>
            {progress}%
          </strong>
          <span style={{ fontSize: '12px', color: '#718096' }}>
            Completed
          </span>
        </div>
      </div>

      <p style={{ color: '#26324b', fontSize: '14px' }}>
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </div>
  );
}

export default ProgressCharts;