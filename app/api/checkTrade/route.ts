// pages/index.js
export async function getServerSideProps(context) {
  const { user_id } = context.query;

  // Проверяем user_id
  if (!user_id) {
    return {
      redirect: {
        destination: '/error?message=No User ID',
        permanent: false,
      },
    };
  }

  // Запрос к бэкенду для проверки trade_allowed
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkTrade?user_id=${user_id}`);
  const data = await res.json();

  // Если trade_allowed === false, делаем редирект
  if (data.trade_allowed === false) {
    return {
      redirect: {
        destination: '/error?message=Trade Not Allowed',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId: user_id,
    },
  };
}
