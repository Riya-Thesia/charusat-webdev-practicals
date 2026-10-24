import React, { useState, useEffect, lazy, Suspense } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import LoadingFallback from '../components/LoadingFallback';
import { Star, ExternalLink, RefreshCw, Search, BarChart2 } from 'lucide-react';

// Practical 8 Supplementary Requirement: Lazy load a heavy third-party / chart component
const AnalyticsChart = lazy(() => import('../components/AnalyticsChart'));

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('Riya-Thesia');

  const fetchRepositories = () => {
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API returned status ${res.status} (${res.statusText})`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          throw new Error('Received unexpected data format from GitHub API');
        }
      })
      .catch((err) => {
        console.error('API Error:', err);
        setError(err.message || 'Failed to fetch repositories.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRepositories();
  }, [username]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page-container projects-page">
      <div className="page-header">
        <h1 className="page-title">🌐 Projects & GitHub Repositories</h1>
        <p className="page-subtitle">
          Explore my public GitHub repositories and open-source projects dynamically fetched via the GitHub REST API.
        </p>
      </div>

      <div className="toolbar-card">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Filter repositories by name or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="user-selector">
          <label className="form-label" style={{ marginBottom: 0 }}>GitHub Profile:</label>
          <select
            className="form-select"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          >
            <option value="Riya-Thesia">Riya-Thesia (My Profile)</option>
            <option value="facebook">React / Facebook</option>
            <option value="vercel">Vercel</option>
            <option value="torvalds">Linus Torvalds</option>
          </select>
          
          <button className="btn btn-secondary btn-sm" onClick={fetchRepositories} title="Refresh API">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Practical 8 Supplementary Requirement: Toggle Lazy-Loaded Analytics Chart */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
        <button
          className="btn btn-primary"
          onClick={() => setShowAnalytics(!showAnalytics)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <BarChart2 size={18} />
          {showAnalytics ? 'Hide Analytics Chart' : 'Load Analytics Chart (Lazy Loaded)'}
        </button>
      </div>

      {showAnalytics && (
        <Suspense fallback={<LoadingFallback text="Lazy loading AnalyticsChart.chunk.js..." />}>
          <AnalyticsChart />
        </Suspense>
      )}

      {loading && <Spinner message={`Fetching GitHub repositories for "${username}"...`} />}

      {error && !loading && (
        <ErrorMessage
          message={`Failed to fetch repositories: ${error}`}
          onRetry={fetchRepositories}
        />
      )}

      {!loading && !error && (
        <div className="repos-container">
          <div className="results-header">
            <span>Found <strong>{filteredRepos.length}</strong> repositories for {username}</span>
            {searchQuery && (
              <button className="btn-link" onClick={() => setSearchQuery('')}>Clear filter</button>
            )}
          </div>

          {filteredRepos.length === 0 ? (
            <div className="empty-box">
              <p>No public repositories match your search filter "{searchQuery}".</p>
            </div>
          ) : (
            <div className="repos-grid">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="repo-card">
                  <div className="repo-header">
                    <h3 className="repo-name">{repo.name}</h3>
                    <span className="star-badge" title="GitHub Stars">
                      <Star size={14} className="star-icon" /> {repo.stargazers_count}
                    </span>
                  </div>

                  <p className="repo-desc">
                    {repo.description || 'No description provided for this repository.'}
                  </p>

                  <div className="repo-footer">
                    {repo.language && <span className="lang-pill">{repo.language}</span>}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-link"
                    >
                      View on GitHub <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Projects;
