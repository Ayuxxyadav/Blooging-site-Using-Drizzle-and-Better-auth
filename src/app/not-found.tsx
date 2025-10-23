import Link from "next/link";
export default function NotFound(){
  // app/not-found.js (for App Router)
// Use in pages/404.js if using pages router
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #c3ec52 0%, #0ba29d 100%)',
        flexDirection: 'column',
        fontFamily: 'Nunito, Arial, sans-serif',
        color: '#222',
      }}
    >
      <div style={{ fontSize: '6rem' }}>🚧</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>
        404 – Page Not Found
      </h1>
      <p style={{ fontSize: '1.3rem', maxWidth: '400px', textAlign: 'center' }}>
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: '2rem',
          background: '#222',
          color: '#fff',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          borderRadius: '999px',
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          letterSpacing: '1px',
          transition: 'background 0.2s',
        }}
      >
        Take me home
      </Link>
    </div>
  );
}

