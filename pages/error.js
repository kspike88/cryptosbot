export default function ErrorPage({ message }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Ошибка</h1>
        <p className="text-lg">{message || "Что-то пошло не так."}</p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { message } = context.query;
  return {
    props: { message },
  };
}
