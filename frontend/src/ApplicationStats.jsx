import {
  Code2,
  Bookmark,
  Send,
  CheckCircle
} from 'lucide-react';

function ApplicationStats({
  skills = [],
  internships = [],
  learningTasks = []
}) {
  const applicationsSubmitted = internships.filter(
    item => item.application_status &&
      item.application_status !== 'Saved'
  ).length;

  const completedTasks = learningTasks.filter(
    task => task.status === 'Completed'
  ).length;

  const stats = [
    {
      title: 'Total Skills',
      value: skills.length,
      icon: Code2,
      color: '#5145e5',
      background: '#eeedff'
    },
    {
      title: 'Saved Internships',
      value: internships.length,
      icon: Bookmark,
      color: '#0284c7',
      background: '#e0f2fe'
    },
    {
      title: 'Applications Submitted',
      value: applicationsSubmitted,
      icon: Send,
      color: '#d97706',
      background: '#fef3c7'
    },
    {
      title: 'Tasks Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: '#16a34a',
      background: '#dcfce7'
    }
  ];

  return (
    <div className="application-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div className="application-stat-card" key={stat.title}>
            <div
              className="application-stat-icon"
              style={{
                color: stat.color,
                background: stat.background
              }}
            >
              <Icon size={23} />
            </div>

            <div>
              <p>{stat.title}</p>
              <h2>{stat.value}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ApplicationStats;