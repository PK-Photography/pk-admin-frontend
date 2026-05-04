import { useLocation, useNavigate } from 'react-router-dom';

export default function Favourites() {
  const location = useLocation();
  const navigate = useNavigate();
  const favourites = location.state?.favourites || [];

  // ✅ Split favourites
  const pkFavourites = favourites.filter((fav) => fav.favoMarkBy !== 'pikconnect');

  const pikFavourites = favourites.filter((fav) => fav.favoMarkBy === 'pikconnect');

  // ✅ Reusable grid renderer
  const renderGrid = (data) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px'
      }}
    >
      {data.map((fav) => (
        <div
          key={fav.id}
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
              height: '200px',
              objectFit: 'contain'
            }}
          />
          <p style={{ margin: '10px 0' }}>{fav.name}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      {/* 🔙 Back Button */}
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
          marginBottom: '20px'
        }}
      >
        ⬅ Back
      </button>

      <h2 style={{ marginBottom: '20px' }}>Favourite Images</h2>

      {/* ❌ No favourites at all */}
      {favourites.length === 0 ? (
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
      ) : (
        <>
          {/* ✅ PK Photography Section */}
          <h3 style={{ marginBottom: '10px' }}>PK Photography ({pkFavourites.length})</h3>

          {pkFavourites.length > 0 ? (
            renderGrid(pkFavourites)
          ) : (
            <p style={{ color: '#888', marginBottom: '20px' }}>No favourites in PK Photography</p>
          )}

          {/* ✅ PikConnect Section */}
          <h3 style={{ margin: '30px 0 10px' }}>PikConnect ({pikFavourites.length})</h3>

          {pikFavourites.length > 0 ? renderGrid(pikFavourites) : <p style={{ color: '#888' }}>No favourites in PikConnect</p>}
        </>
      )}
    </div>
  );
}
