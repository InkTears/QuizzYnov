import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <section
        style={{
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        <h1 style={{ fontSize: '56px', margin: '0 0 8px' }}>404</h1>
        <h2 style={{ margin: '0 0 12px' }}>Page not found</h2>
        <p style={{ margin: '0 0 24px', color: '#555' }}>
          The page you are looking for does not exist.
        </p>

        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            background: '#111827',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          Back to login
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;

