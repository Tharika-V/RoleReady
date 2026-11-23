
import { useState } from 'react';
import './InternshipDiscovery.css';

function InternshipDiscovery() {
const [role, setRole] = useState('');
const [country, setCountry] = useState('India');
const [city, setCity] = useState('');
const [remote, setRemote] = useState(false);
const [stipendType, setStipendType] = useState('paid');
const [duration, setDuration] = useState('Any');
const [workSchedule, setWorkSchedule] = useState('Any');
  function searchInternships(platform) {
  if (!role.trim()) {
    alert('Please enter a role or skill to search.');
    return;
  }

  const searchLocation = remote
    ? `${city.trim()} ${country} remote`
    : `${city.trim()} ${country}`;

  const stipendKeyword =
  stipendType === 'Paid'
    ? 'paid stipend'
    : stipendType === 'Unpaid'
      ? 'unpaid no stipend'
      : '';

const durationKeyword =
  duration === 'Any' ? '' : duration;

const scheduleKeyword =
  workSchedule === 'Any' ? '' : workSchedule;

const searchText =
  `${role.trim()} internship ${searchLocation} ${stipendKeyword} ${durationKeyword} ${scheduleKeyword}`;

  const query = encodeURIComponent(searchText);

  const urls = {
    Internshala:
      `https://www.google.com/search?q=${encodeURIComponent(
        'site:internshala.com/internship/ ' + searchText
      )}`,

    LinkedIn:
      `https://www.linkedin.com/jobs/search/?keywords=${query}`,

    Wellfound:
      `https://www.google.com/search?q=${encodeURIComponent(
        'site:wellfound.com/jobs ' + searchText
      )}`
  };

  window.open(urls[platform], '_blank', 'noopener,noreferrer');
}

  return (
    <section className="internship-discovery">
      <div className="discovery-heading">
        <span>OPPORTUNITY FINDER</span>
        <h2>Discover Internships</h2>
        <p>Find internship opportunities that match your career interests.</p>
      </div>

      <div className="discovery-card dashboard-card">
        <label>What role or skill are you looking for?</label>
        <input
          type="text"
          placeholder="Example: Python Developer, AI/ML Intern"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <label>Preferred Country</label>
<select
  value={country}
  onChange={(e) => setCountry(e.target.value)}
>
  <option value="India">India</option>
  <option value="USA">United States</option>
  <option value="UK">United Kingdom</option>
  <option value="Canada">Canada</option>
  <option value="Germany">Germany</option>
  <option value="Australia">Australia</option>
  <option value="Singapore">Singapore</option>
  <option value="UAE">United Arab Emirates</option>
</select>

<label>Preferred City</label>
<input
  type="text"
  placeholder="Example: Bengaluru, Chennai, Mumbai"
  value={city}
  onChange={(e) => setCity(e.target.value)}
/>

<label className="remote-option">
  <input
    type="checkbox"
    checked={remote}
    onChange={(e) => setRemote(e.target.checked)}
  />
  Include remote internships
</label>
<label>Internship Stipend Preference</label>
<select
  value={stipendType}
  onChange={(e) => setStipendType(e.target.value)}
>
  <option value="Any">Any stipend</option>
  <option value="Paid">Paid internships only</option>
  <option value="Unpaid">Unpaid internships</option>
</select>
<label>Preferred Internship Duration</label>
<select
  value={duration}
  onChange={(e) => setDuration(e.target.value)}
>
  <option value="Any">Any duration</option>
  <option value="1 month">1 month</option>
  <option value="2 months">2 months</option>
  <option value="3 months">3 months</option>
  <option value="6 months">6 months</option>
  <option value="6+ months">More than 6 months</option>
</select>
<label>Preferred Work Schedule</label>
<select
  value={workSchedule}
  onChange={(e) => setWorkSchedule(e.target.value)}
>
  <option value="Any">Any schedule</option>
  <option value="Full-time">Full-time</option>
  <option value="Part-time">Part-time</option>
  <option value="Flexible">Flexible hours</option>
</select>
<button
  type="button"
  onClick={() => {
    setRole('');
    setCountry('India');
    setCity('');
    setRemote(false);
    setStipendType('Any');
    setDuration('Any');
    setWorkSchedule('Any');
  }}
>
  Clear All Filters
</button>
        <h3>Search on internship platforms</h3>

        <div className="discovery-buttons">
          <button onClick={() => searchInternships('Internshala')}>
            Search Internshala
          </button>

          <button onClick={() => searchInternships('LinkedIn')}>
            Search LinkedIn
          </button>

          <button onClick={() => searchInternships('Wellfound')}>
            Search Wellfound
          </button>
        </div>

        <p className="discovery-note">
          You'll be redirected to the selected platform to explore current
          listings and apply directly.
        </p>
      </div>
    </section>
  );
}

export default InternshipDiscovery;