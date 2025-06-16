import { useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
}

export const TransactionHistory = () => {
  const { account } = useSDK();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!account) return;

    setLoading(true);
    setError(null);

    try {
      // В реальном приложении здесь будет API ключ Etherscan
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&sort=desc&apikey=RZPF2D2MQ2WXTC2QHNT1UVSA85JZ3G6Y36`
      );

      const data = await response.json();

      if (data.status === "1") {
        setTransactions(data.result);
      } else {
        setError("Ошибка при получении транзакций");
      }
    } catch (err) {
      setError("Ошибка при загрузке транзакций");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchTransactions();
    }
  }, [account]);

  if (!account) {
    return (
      <div className="text-center p-4">
        Подключите кошелек для просмотра истории транзакций
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-4">Загрузка транзакций...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">История транзакций</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Хеш</th>
              <th className="px-4 py-2">От</th>
              <th className="px-4 py-2">Кому</th>
              <th className="px-4 py-2">Сумма (ETH)</th>
              <th className="px-4 py-2">Дата</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash} className="border-t border-gray-300">
                <td className="px-4 py-2">
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {tx.hash.slice(0, 10)}...
                  </a>
                </td>
                <td className="px-4 py-2">{tx.from.slice(0, 10)}...</td>
                <td className="px-4 py-2">{tx.to.slice(0, 10)}...</td>
                <td className="px-4 py-2">
                  {(parseInt(tx.value) / 1e18).toFixed(4)}
                </td>
                <td className="px-4 py-2">
                  {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
