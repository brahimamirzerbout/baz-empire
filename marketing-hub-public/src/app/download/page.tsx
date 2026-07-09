import QRCode from "qrcode";

export const metadata = {
  title: "Get the Android app",
  description: "Download the BAZ Empire Hub Android app — ROI Marketing on your phone.",
};

// Absolute origin for the QR (so a desktop visitor can scan it onto their phone).
// MARKETING_HUB_PUBLIC_URL is set in vercel.json env on Vercel; falls back for dev.
const BASE = process.env.MARKETING_HUB_PUBLIC_URL || "http://localhost:3000";
const APK_PATH = "/app/baz-empire-hub-1.0.apk";

export default async function DownloadPage() {
  const apkUrl = `${BASE}${APK_PATH}`;
  const qr = await QRCode.toDataURL(apkUrl, {
    margin: 1,
    width: 256,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return (
    <main className="max-w-xl mx-auto px-4 py-16 md:py-24">
      {/* App identity */}
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/android-chrome-192x192.png"
          alt="BAZ Empire Hub app icon"
          width={96}
          height={96}
          className="mx-auto rounded-2xl border border-black/10 shadow-sm"
        />
        <h1 className="mt-5 text-3xl md:text-4xl font-black tracking-tight">
          BAZ Empire Hub
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
          ROI Marketing on your Android · v1.0 · ~7 MB · Requires Android 7.0+
        </p>
      </div>

      {/* Primary download */}
      <div className="mt-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center">
        <a
          href={APK_PATH}
          download
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
        >
          ⬇ Download APK
        </a>
        <p className="mt-3 text-xs text-emerald-800">
          Direct download · installs in seconds · no Play Store needed
        </p>
      </div>

      {/* QR — scan from desktop to phone */}
      <div className="mt-8 flex flex-col items-center">
        <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qr}
            alt="QR code — scan with your phone camera to download the app"
            width={220}
            height={220}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-zinc-400">
          On a desktop? Scan this with your phone camera to download straight to your device.
        </p>
      </div>

      {/* Install steps */}
      <ol className="mt-10 space-y-3 text-sm text-slate-700 dark:text-zinc-300">
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold grid place-items-center">
            1
          </span>
          <span>
            Tap <strong>Download APK</strong> — or scan the QR with your phone camera.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold grid place-items-center">
            2
          </span>
          <span>
            Open the downloaded file. If prompted, allow{" "}
            <strong>Install unknown apps</strong> for your browser.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold grid place-items-center">
            3
          </span>
          <span>
            Open <strong>BAZ Empire Hub</strong> — it loads your live hub. Sign in to your workspace and go.
          </span>
        </li>
      </ol>

      {/* Web fallback */}
      <div className="mt-10 text-center">
        <a
          href="/"
          className="text-sm font-semibold text-slate-700 dark:text-zinc-300 underline underline-offset-4 hover:text-emerald-700"
        >
          Prefer the web app? Open the hub →
        </a>
      </div>
    </main>
  );
}