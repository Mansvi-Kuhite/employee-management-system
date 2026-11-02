import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { employee } = useAuth();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-pink-100 to-sky-100 p-6">
        <h2 className="text-2xl font-bold text-ink">Welcome, {employee.name}</h2>
        <p className="mt-1 text-slate-600">
          You're signed in as <span className="font-semibold capitalize">{employee.role}</span>.
        </p>
      </div>
      <p className="text-sm text-slate-500">
        Dashboard widgets arrive with the next modules.
      </p>
    </div>
  );
}