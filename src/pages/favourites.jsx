import { useLocation, useNavigate } from 'react-router-dom';

export default function Favourites() {
  const location = useLocation();
  const navigate = useNavigate();
  const favourites = location.state?.favourites || [];

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '8px',
          background: '#1a75ba',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '20px'
        }}
      >
        ⬅ Back
      </button>

      <h2 style={{ marginBottom: '20px' }}>Favourite Images</h2>

      {favourites.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px'
          }}
        >
          {favourites.map((fav) => (
            <div
              key={fav._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                textAlign: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={fav.mediumRes}
                alt={fav.name}
                style={{
                  width: '100%',
                  height: '90%',
                  objectFit: 'cover', // fills container
                  display: 'block'
                }}
              />
              <p style={{ margin: '10px 0' }}>{fav.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh'
          }}
        >
          <p style={{ fontSize: '18px', color: '#666' }}>No favourites found</p>
        </div>
      )}
    </div>
  );
}
