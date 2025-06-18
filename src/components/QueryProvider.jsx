"use client";

import { ImageKitProvider } from "@imagekit/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ImageKitProvider>
    </SessionProvider>
  );
}
