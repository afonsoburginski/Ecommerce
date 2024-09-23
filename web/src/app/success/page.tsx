// app/success/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const session_id = query.get('session_id');
    if (session_id) {
      setSessionId(session_id);
    }
  }, []);

  if (!sessionId) {
    return <p>Carregando informações de pagamento...</p>;
  }

  return (
    <div>
      <h1>Compra realizada com sucesso!</h1>
      <p>Obrigado pela sua compra. Seu ID de sessão é: {sessionId}</p>
    </div>
  );
}
