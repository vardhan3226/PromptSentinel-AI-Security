import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Plus, Search } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import API_BASE_URL from "../../config/api";

function AIConversationHistory() {
  const navigate = useNavigate();
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/ai/conversations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data?.message || "Unable to load conversation history."
          );
        }

        setConversationHistory(
          Array.isArray(data.conversations) ? data.conversations : []
        );
      } catch (loadError) {
        console.error("Conversation history load error:", loadError);
        setError(
          loadError.message ||
            "Unable to load conversation history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [navigate, token]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversationHistory;

    return conversationHistory.filter((conversation) =>
      String(conversation.title || "Untitled Conversation")
        .toLowerCase()
        .includes(query)
    );
  }, [conversationHistory, search]);

  const handleOpenConversation = (savedConversation) => {
    if (!savedConversation?.id) return;

    navigate("/ai-hub", {
      state: { savedConversation },
    });
  };

  const handleNewConversation = () => {
    navigate("/ai-hub");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-dvh w-full bg-[#f6f9fc]">
      <Sidebar
        navigate={navigate}
        handleLogout={handleLogout}
        active="AI Hub"
      />

      <main className="ml-65 min-h-dvh min-w-0 overflow-x-hidden">
        <div className="w-full px-5 py-5 md:px-7 lg:px-8">
          <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative px-6 py-7 md:px-8">
              <div className="absolute right-0 top-0 h-full w-[30%] overflow-hidden opacity-50">
                <div className="absolute -right-10 top-8 h-14 w-80 rotate-[-7deg] rounded-full border-8 border-cyan-100" />
                <div className="absolute -right-8 top-20 h-14 w-80 rotate-[-7deg] rounded-full border-8 border-blue-100" />
              </div>

              <div className="relative z-10">
                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  <ArrowLeft size={15} />
                  Back to AI Hub
                </button>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Your saved PromptSentinel AI conversations.
                    </p>
                    <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#102a63] md:text-4xl">
                      Conversation History
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Open an existing conversation or start a completely new secure AI conversation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNewConversation}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#102a63] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#0b2152]"
                  >
                    <Plus size={17} />
                    New Conversation
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Bot size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#102a63]">
                    Saved Conversations
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {conversationHistory.length} saved {conversationHistory.length === 1 ? "conversation" : "conversations"}
                  </p>
                </div>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search conversations..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </div>
            </div>
          </section>

          {loading && (
            <section className="rounded-[20px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Loading conversation history...
              </p>
            </section>
          )}

          {!loading && error && (
            <section className="rounded-[20px] border border-red-200 bg-red-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </section>
          )}

          {!loading && !error && filteredConversations.length === 0 && (
            <section className="rounded-[20px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <Bot size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-[#102a63]">
                {search ? "No conversations found" : "No saved conversations yet"}
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-400">
                {search
                  ? "Try a different search term."
                  : "Start a new secure AI conversation and it will appear here."}
              </p>
              {!search && (
                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#102a63] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b2152]"
                >
                  <Plus size={17} />
                  Start New Conversation
                </button>
              )}
            </section>
          )}

          {!loading && !error && filteredConversations.length > 0 && (
            <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredConversations.map((savedConversation) => {
                  const messageCount = Array.isArray(savedConversation.messages)
                    ? savedConversation.messages.length
                    : 0;
                  const turnCount = Math.ceil(messageCount / 2);

                  return (
                    <button
                      key={savedConversation.id}
                      type="button"
                      onClick={() => handleOpenConversation(savedConversation)}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50/30 hover:shadow-md focus:border-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#102a63]">
                            {savedConversation.title || "Untitled Conversation"}
                          </p>
                          <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-cyan-600">
                            Open conversation
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                          Saved
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                        <p className="text-[10px] text-slate-400">
                          {turnCount} {turnCount === 1 ? "turn" : "turns"} · {messageCount} {messageCount === 1 ? "message" : "messages"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {savedConversation.updatedAt
                            ? new Date(savedConversation.updatedAt).toLocaleDateString()
                            : "Recent"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <div className="flex items-center justify-center gap-3 py-5">
            <div className="flex overflow-hidden rounded-full">
              <span className="h-1.5 w-5 bg-orange-500" />
              <span className="h-1.5 w-5 bg-slate-200" />
              <span className="h-1.5 w-5 bg-green-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              PromptSentinel · Secure AI Hub
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIConversationHistory;
