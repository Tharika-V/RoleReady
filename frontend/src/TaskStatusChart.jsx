import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function TaskStatusChart({ tasks = [] }) {
  const data = [
    {
      name: 'Completed',
      value: tasks.filter(task => task.status === 'Completed').length,
      color: '#16a34a'
    },
    {
      name: 'In Progress',
      value: tasks.filter(task => task.status === 'In Progress').length,
      color: '#5145e5'
    },
    {
      name: 'Not Started',
      value: tasks.filter(task => task.status === 'Not Started').length,
      color: '#f59e0b'
    }
  ];

  const total = tasks.length;

  return (
    <div className="task-status-chart">
      <h3>Learning Task Status</h3>
      <p>Breakdown of your learning tasks</p>

      {total === 0 ? (
        <div className="chart-empty">
          No learning tasks added yet.
        </div>
      ) : (
        <>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="task-chart-legend">
            {data.map(item => (
              <div key={item.name} className="task-legend-item">
                <span
                  className="task-legend-dot"
                  style={{ background: item.color }}
                />
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TaskStatusChart;