import { useEffect, useState } from "react";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Groups from "@mui/icons-material/Groups";
import SportsEsports from "@mui/icons-material/SportsEsports";
import { APP_NAME } from "../../lib/constants";

// Uses src/assets/login-art.png (or .svg/.webp) if present; otherwise shows the cards
const art = Object.values(
  import.meta.glob("../../assets/login-art.*", { eager: true, import: "default" })
)[0];

const slides = [
  {
    title: "Work feels better together",
    text: "Your people, your workspace, one place.",
  },
  {
    title: "Attendance and leave, sorted",
    text: "Check in, apply for leave and get approvals in a few clicks.",
  },
  {
    title: "Take a 5-minute break",
    text: "Daily trivia and team leaderboards in the Breakroom.",
  },
];

const checklist = ["Check in", "Approve leave", "Daily trivia"];

export default function AuthLayout({ children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => clearTimeout(timer);
  }, [index]);

  const slide = slides[index];

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-gray-100 p-3 sm:p-4">
      <div className="grid h-[min(600px,calc(100dvh-2rem))] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* Left panel: image covers everything */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-pink-200 via-fuchsia-100 to-sky-200 lg:block">
          {art ? (
            <img
              src={art}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-x-0 top-16 mx-auto w-full max-w-[16rem]">
              <div className="animate-float rounded-2xl bg-white/90 p-5 shadow-lg">
                <p className="mb-3 text-sm font-semibold text-gray-700">Today</p>
                <ul className="space-y-3">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle fontSize="small" color="primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-float-slow absolute -bottom-6 -right-4 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
                <SportsEsports fontSize="small" />
                5-min Breakroom
              </div>
            </div>
          )}

          {/* Frosted tagline card */}
          <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/75 p-4 text-center shadow-lg backdrop-blur-md">
            <div key={index} className="animate-fade-in">
              <h2 className="text-lg font-bold text-ink">{slide.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{slide.text}</p>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-label={`Show slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-pink-400" : "w-2 bg-sky-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right panel: only this part scrolls, and only on very short screens */}
        <div className="flex flex-col overflow-y-auto p-6 sm:p-8">
          <div className="my-auto w-full max-w-sm self-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-300 to-sky-300 text-ink">
                <Groups />
              </div>
              <span className="text-lg font-bold text-ink">{APP_NAME}</span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}