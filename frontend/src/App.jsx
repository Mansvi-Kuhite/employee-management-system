import AppRoutes from "./routes/AppRoutes";
import IdleLogout from "./common/IdleLogout";

export default function App() {
  return (
    <>
      <AppRoutes />
      <IdleLogout />
    </>
  );
}