import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-5 text-xl text-red-500">
        <h1>🚫 Доступ запрещен!</h1>
        <p>{message || 'Ваши права на торговлю были ограничены.'}</p>
      </div>
    </div>
  );
}
