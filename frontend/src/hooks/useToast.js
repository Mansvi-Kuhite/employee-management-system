import { useContext } from "react";
import { ToastContext } from "../store/toastContext";

export const useToast = () => useContext(ToastContext);