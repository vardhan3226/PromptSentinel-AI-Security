import { Shield, Mail, Globe } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-cyan-400/10">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center">
                <Shield className="text-slate-950" size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  PromptSentinel
                </h2>
                <p className="text-cyan-400 text-sm">
                  AI Firewall for LLMs
                </p>
              </div>
            </div>

            <p className="mt-6 text-slate-400 leading-7">
              PromptSentinel protects Large Language Models against prompt
              injection, jailbreak attacks and prompt leakage.
            </p>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-5">Product</h3>
            <ul className="space-y-3 text-slate-400">
              <li>Features</li>
              <li>Live Scanner</li>
              <li>Dashboard</li>
              <li>Reports</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              Technologies
            </h3>
            <ul className="space-y-3 text-slate-400">
              <li>React</li>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>MongoDB</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-5">Contact</h3>

            <div className="space-y-4 text-slate-400">
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@promptsentinel.ai</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg">🐙</span>
                <span>GitHub Repository</span>
              </div>

              <div className="flex items-center gap-3">
                <Globe size={18} />
                <span>www.promptsentinel.ai</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-14 pt-8 text-center">
          <p className="text-slate-500">
            © 2026 PromptSentinel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;