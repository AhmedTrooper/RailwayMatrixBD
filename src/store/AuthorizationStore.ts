import {
  AuthorizationStoreInterface,
  inValidAuthData,
  ParsedJsonResponse,
  ResponseData,
} from "@/interface/store/AuthorizationStore";
import { addToast } from "@heroui/react";
import { fetch } from "@tauri-apps/plugin-http";
import { create } from "zustand";

export const useAuthorizationStore = create<AuthorizationStoreInterface>(
  (set, get) => {
    return {
      mobileNumber: localStorage.getItem("mobileNumber") || null,
      loginPassword: localStorage.getItem("loginPassword") || null,
      bearerToken: localStorage.getItem("bearerToken") || null,
      isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
      loginFailed: false,
      setMobileNumber: (value) => set({ mobileNumber: value }),
      setLoginPassword: (value) => set({ loginPassword: value }),
      setBearerToken: (value) => set({ bearerToken: value }),
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      setLoginFailed: (value) => set({ loginFailed: value }),
      loginUrl: "https://railspaapi.shohoz.com/v1.0/web/auth/sign-in",
      editPasswordEnable: false,
      setEditPasswordEnable: (value: boolean) =>
        set({ editPasswordEnable: value }),
      fetchToken: async () => {
        const authorizationStore = get();
        const mobileNumber = authorizationStore.mobileNumber;
        const loginPassword = authorizationStore.loginPassword;
        const loginUrl = authorizationStore.loginUrl;
        const tryCount = 0;
        const maxTry = 3;
        const responseToken = authorizationStore.bearerToken;
        const setBearerToken = authorizationStore.setBearerToken;
        const setIsLoggedIn = authorizationStore.setIsLoggedIn;
        const payLoad = {
          mobile_number: mobileNumber,
          password: loginPassword,
        };
        // const payLoad = {
        //   mobile_number: "01865043081",
        //   password: "Sohoz@Passcode!",
        // };

        const fetchFailed = false;
        if (
          inValidAuthData.includes(mobileNumber) ||
          inValidAuthData.includes(loginPassword)
        ) {
          addToast({
            title: "Invalid Input",
            description: "Check your mobile number or login password!",
            color: "warning",
            timeout: 2000,
          });
          return;
        }

        localStorage.setItem("mobileNumber", mobileNumber?.trim() as string);
        localStorage.setItem("loginPassword", loginPassword?.trim() as string);

        //If form data is valid....
        try {
          const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payLoad),
            connectTimeout: 20000,
          });
          const parsedJson = (await response.json()) as ParsedJsonResponse;
          console.log(parsedJson);
          const data = parsedJson["data"] as ResponseData;
          console.log(data);
          if (response.status === 200) {
            setBearerToken(data["token"]);
            setIsLoggedIn(true);
            localStorage.setItem("bearerToken", data["token"]);
            localStorage.setItem("isLoggedIn", "true");

            addToast({
              title: "Login successfull",
              description: "You have loged in successfully...",
              timeout: 2000,
              color: "success",
            });
          } else {
            addToast({
              title: "Login failed",
              description: "You have loged in successfully...",
              timeout: 2000,
              color: "danger",
            });
          }
        } catch {
        } finally {
        }
      },
    };
  }
);
