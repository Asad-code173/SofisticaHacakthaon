export default function Header() {


    return (
        <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              DNSGuard AI
            </h1>

            <p className="text-sm text-slate-400">
              AI-Powered DNS Security Analysis
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            System Online
          </div>

        </div>
      </header>

    )
}
