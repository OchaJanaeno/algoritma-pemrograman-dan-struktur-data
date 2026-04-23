import { Link } from 'react-router-dom'

function GithubProfileCard({ user }) {
  return (
    <div>
      <img src={user.avatar_url} alt={user.login} width={80} />
      <h2>{user.name || user.login}</h2>
      <p>@{user.login}</p>
      {user.bio && <p>{user.bio}</p>}
      <p>Repos: {user.public_repos} | Followers: {user.followers} | Following: {user.following}</p>
      {user.blog && (
        <p>
          🔗{' '}
          <a
            href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
            target="_blank"
            rel="noreferrer"
          >
            {user.blog}
          </a>
        </p>
      )}
      <a href={user.html_url} target="_blank" rel="noreferrer">
        Lihat di GitHub →
      </a>
    </div>
  )
}

export default GithubProfileCard
