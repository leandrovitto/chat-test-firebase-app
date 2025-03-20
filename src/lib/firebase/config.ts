"use client";

const config = {
  apiKey: process.env.VITE_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.VITE_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env
    .VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.VITE_PUBLIC_FIREBASE_APP_ID as string,
};

// When deployed, there are quotes that need to be stripped
Object.keys(config).forEach((key) => {
  const typedKey = key as keyof typeof config;
  const configValue = config[typedKey] + "";
  if (configValue.charAt(0) === '"') {
    config[typedKey] = configValue.substring(1, configValue.length - 1);
  }
});

export const firebaseConfig = config;
