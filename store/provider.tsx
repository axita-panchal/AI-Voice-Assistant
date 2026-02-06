"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import { useEffect } from "react";
import { hydrateAuth } from "./slices/authSlice";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (auth) {
      store.dispatch(hydrateAuth(JSON.parse(auth)));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
