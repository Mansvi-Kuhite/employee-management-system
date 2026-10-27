import { LinearProgress } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";

const rules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const passed = rules.filter((rule) => rule.test(password)).length;
  const percent = (passed / rules.length) * 100;
  const color = passed === rules.length ? "success" : passed === 2 ? "warning" : "error";

  return (
    <div className="space-y-2">
      <LinearProgress variant="determinate" value={percent} color={color} />
      <ul className="space-y-1 text-sm">
        {rules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.label}
              className={`flex items-center gap-2 ${ok ? "text-green-600" : "text-gray-500"}`}
            >
              {ok ? <CheckCircle fontSize="small" /> : <RadioButtonUnchecked fontSize="small" />}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}