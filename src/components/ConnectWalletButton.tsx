"use client";

import { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";
import { formatAddress } from "../lib/utils";

// import WalletIcon from "../public/icons/WalletIcon"; // Закомментировано, так как WalletIcon не определен в проекте

// Предполагается, что у вас есть Button и Popover компоненты, например из ShadcnUI
// Если нет, вам нужно будет их добавить или использовать стандартные HTML элементы

// Для демонстрации, я буду использовать простые div и button вместо ShadcnUI
const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const Popover = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">{children}</div>
);
const PopoverTrigger = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
const PopoverContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute mt-2 w-44 bg-gray-700 text-white border rounded-md shadow-lg right-0 z-10 top-10 p-2">
    {children}
  </div>
);

export const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account, provider } = useSDK();
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async (currentAccount: string) => {
    if (provider && currentAccount) {
      try {
        const ethersProvider = new ethers.providers.Web3Provider(
          provider as unknown as ethers.providers.ExternalProvider
        );
        const rawBalance = await ethersProvider.getBalance(currentAccount);
        setBalance(ethers.utils.formatEther(rawBalance));
        setError(null);
      } catch (err: unknown) {
        console.error("Ошибка получения баланса:", err);
        if (err instanceof Error) {
          setError(`Не удалось получить баланс: ${err.message}`);
        } else {
          setError("Не удалось получить баланс (неизвестная ошибка).");
        }
        setBalance(null);
      }
    }
  };

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      if (accounts && accounts.length > 0) {
        await fetchBalance(accounts[0]);
      }
    } catch (err) {
      console.warn(`Ошибка подключения:`, err);
      setError(`Ошибка подключения: ${err}`);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
      setBalance(null);
      setError(null);
    }
  };

  useEffect(() => {
    if (connected && account) {
      fetchBalance(account);
    } else {
      setBalance(null);
      setError(null);
    }
  }, [connected, account, provider]); // Добавил provider в зависимости, чтобы он был доступен

  return (
    <div className="relative">
      {error && <p className="text-red-500 mb-2">Ошибка: {error}</p>}
      {connected ? (
        <Popover>
          <PopoverTrigger>
            <Button>
              {formatAddress(account)}
              {balance !== null && ` (${balance} ETH)`}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Button onClick={disconnect}>Отключиться</Button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          {/* <WalletIcon className="mr-2 h-4 w-4" /> */}
          Подключить Кошелек
        </Button>
      )}
    </div>
  );
};
