import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ShareView() {
  const { token } = useParams();
  const [packet, setPacket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    try {
      const raw = localStorage.getItem(token);
      if (!raw) {
        setPacket(null);
        return;
      }
      const parsed = JSON.parse(raw);
      setPacket(parsed);
    } catch (err) {
      console.error('Failed to load packet', err);
      setPacket(null);
    }
  }, [token]);

  if (!token) return <div style={{ padding: 20 }}>No token provided.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>Back</button>
      <h1>Shared Packet: {token}</h1>
      {!packet && (
        <div style={{ marginTop: 12 }}>
          <p>Packet not found locally. This demo stores packets in your browser's localStorage only.</p>
          <p>If you generated this QR on another device, it won't be available here.</p>
        </div>
      )}
      {packet && (
        <div style={{ marginTop: 12 }}>
          <h2>Profile</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(packet.profile || {}).map(([k,v]) => (
                <tr key={k}>
                  <td style={{ padding: 6, border: '1px solid #eee', width: 180, fontWeight: 700 }}>{k}</td>
                  <td style={{ padding: 6, border: '1px solid #eee' }}>{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: 18 }}>Eligible Schemes ({(packet.eligible||[]).length})</h2>
          <div>
            {(packet.eligible||[]).map(s => (
              <div key={s.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8, marginBottom: 10 }}>
                <h3 style={{ margin: '0 0 6px 0' }}>{s.title}</h3>
                <div style={{ color: '#666' }}>{s.desc}</div>
                <div style={{ marginTop: 8 }}><a href={s.link} target="_blank" rel="noreferrer">Visit official</a></div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, color: '#666' }}>
            <small>Generated: {packet.generatedAt}</small>
          </div>
        </div>
      )}
    </div>
  );
}
