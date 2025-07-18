'use client'

import { useState } from 'react';

export default function Home() {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');

  // Функция для регистрации пинкода с биометрией
  async function registerBiometric() {
    try {
      // Проверяем поддержку WebAuthn
      if (!window.PublicKeyCredential) {
        setMessage('Ваш браузер не поддерживает биометрическую аутентификацию.');
        return;
      }

      // Создаем учетные данные
      const publicKey = {
        challenge: new Uint8Array(32), // Простой заглушка, так как нет сервера
        rp: { name: 'PinCodeApp' },
        user: {
          id: new Uint8Array(16), // Уникальный ID пользователя (заглушка)
          name: 'user@example.com',
          displayName: 'User',
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Используем встроенные устройства (Face ID, Touch ID)
          userVerification: 'required', // Требуем биометрию
        },
      };
//@ts-ignore
      const credential = await navigator.credentials.create({ publicKey });
      setMessage('Биометрия зарегистрирована! Пинкод сохранен.');

      // Сохраняем пинкод в localStorage (для примера, в реальном приложении используйте шифрование)
      localStorage.setItem('pincode', '1234'); // Пример пинкода
    } catch (error) {
      //@ts-ignore
      setMessage(`Ошибка регистрации: ${error.message}`);
    }
  }

  // Функция для аутентификации и подстановки пинкода
  async function authenticateBiometric() {
    try {
      const publicKey = {
        challenge: new Uint8Array(32), // Простой заглушка
        allowCredentials: [], // Пустой список, так как проверяем локально
        userVerification: 'required',
      };
//@ts-ignore
      await navigator.credentials.get({ publicKey });
      const storedPin = localStorage.getItem('pincode');

      if (storedPin) {
        setPin(storedPin); // Подставляем пинкод в поле ввода
        setMessage('Биометрия пройдена! Пинкод подставлен.');
      } else {
        setMessage('Пинкод не найден. Сначала зарегистрируйтесь.');
      }
    } catch (error) {
      //@ts-ignore
      setMessage(`Ошибка аутентификации: ${error.message}`);
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl mb-4">Ввод пинкода через биометрию</h1>
          <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Пинкод"
              className="border p-2 mb-4 w-full"
              readOnly // Поле только для чтения, так как пинкод подставляется автоматически
          />
          <div className="flex space-x-4">
            <button
                onClick={registerBiometric}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Зарегистрировать биометрию
            </button>
            <button
                onClick={authenticateBiometric}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Ввести пинкод через биометрию
            </button>
          </div>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
  );
}
