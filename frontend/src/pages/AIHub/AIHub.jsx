import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bot,
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";

const API_BASE_URL = "http://localhost:5000";

function AIHub() {
  const navigate = useNavigate();
  const location = useLocation();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [securityResult, setSecurityResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  const [conversation, setConversation] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  // Step 7C: saved AI conversation history
  const [conversationHistory, setConversationHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const getContextualSuggestions = (currentPrompt) => {
    const text = currentPrompt.trim().toLowerCase();

    if (!text) {
      return [];
    }

    const suggestions = [];

    const isCodeRelated =
      /\b(code|coding|program|programming|javascript|typescript|python|java|c\+\+|react|node|sql|html|css|function|bug|error|debug|debugging|algorithm|api)\b/.test(
        text
      );

    const isWritingRelated =
      /\b(write|rewrite|email|message|letter|post|caption|paragraph|essay|resume|cv|cover letter|grammar|proofread|polish)\b/.test(
        text
      );

    const isLearningRelated =
      /\b(explain|learn|teach|understand|what is|how does|why|concept|topic|study|exam|interview)\b/.test(
        text
      );

    if (isCodeRelated) {
      suggestions.push(
        {
          label: "Explain step-by-step",
          description: "Break the technical answer into clear steps.",
          prompt: `Explain this step-by-step, including the important reasoning and how each part works:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Improve the solution",
          description: "Ask for a cleaner and more robust approach.",
          prompt: `Improve this solution for correctness, readability, maintainability, and practical use. Keep the original goal unchanged:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Add an example",
          description: "Request a practical example with the answer.",
          prompt: `Answer this request and include one clear practical example where useful:\n\n${currentPrompt.trim()}`,
        }
      );
    } else if (isWritingRelated) {
      suggestions.push(
        {
          label: "Make it professional",
          description: "Use polished and professional language.",
          prompt: `Rewrite this in a clear, professional, and natural tone while preserving the original meaning:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Make it concise",
          description: "Keep the meaning while reducing unnecessary words.",
          prompt: `Rewrite this to be concise and clear while preserving all important meaning:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Make it friendly",
          description: "Use a warm and approachable tone.",
          prompt: `Rewrite this in a friendly, natural, and approachable tone while preserving the original meaning:\n\n${currentPrompt.trim()}`,
        }
      );
    } else if (isLearningRelated) {
      suggestions.push(
        {
          label: "Explain simply",
          description: "Turn the answer into an easy-to-understand explanation.",
          prompt: `Explain this in simple language, assuming the reader is a beginner, without losing the important concepts:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Explain step-by-step",
          description: "Organize the explanation into logical steps.",
          prompt: `Explain this step-by-step in a logical order, with the key reasoning made clear:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Add examples",
          description: "Include practical examples to make it clearer.",
          prompt: `Explain this clearly and include practical examples to illustrate the main ideas:\n\n${currentPrompt.trim()}`,
        }
      );
    } else {
      suggestions.push(
        {
          label: "Make it clearer",
          description: "Improve clarity without changing the request.",
          prompt: `Make the response clearer and easier to understand while preserving the original intent:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Add examples",
          description: "Include useful examples when they help.",
          prompt: `Answer this request clearly and include practical examples where they improve understanding:\n\n${currentPrompt.trim()}`,
        },
        {
          label: "Explain step-by-step",
          description: "Give the answer in a logical sequence.",
          prompt: `Answer this request step-by-step in a logical and easy-to-follow way:\n\n${currentPrompt.trim()}`,
        }
      );
    }

    return suggestions;
  };

  const contextualSuggestions = getContextualSuggestions(prompt);

  const applySuggestion = (suggestion) => {
    setPrompt(suggestion.prompt);
    setSecurityResult(null);
    setAiResult(null);
    setError("");
  };

  const providers = [
    {
      id: "groq",
      name: "Groq",
      description: "Fast AI responses",
      icon: Zap,
      active: true,
      badge: "Connected",
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      description: "OpenAI assistant",
      icon: Bot,
      active: false,
      badge: "Next",
    },
    {
      id: "grok",
      name: "Grok",
      description: "xAI assistant",
      icon: Sparkles,
      active: false,
      badge: "Next",
    },
    {
      id: "gemini",
      name: "Gemini",
      description: "Google AI assistant",
      icon: Sparkles,
      active: false,
      badge: "Next",
    },
  ];

  const [selectedProvider, setSelectedProvider] = useState("groq");

  const responseStyles = [
    {
      id: "default",
      name: "Default",
      description: "Natural and balanced response.",
    },
    {
      id: "simple",
      name: "Simple",
      description: "Easy language with clear explanations.",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Polished and professional tone.",
    },
    {
      id: "concise",
      name: "Concise",
      description: "Short and focused answer.",
    },
    {
      id: "detailed",
      name: "Detailed",
      description: "More complete explanation and context.",
    },
    {
      id: "friendly",
      name: "Friendly",
      description: "Warm and approachable tone.",
    },
  ];

  const [selectedResponseStyle, setSelectedResponseStyle] =
    useState("default");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Step 7C: load saved conversations for the authenticated user.
  useEffect(() => {
    if (!token) return;

    const loadConversationHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError("");

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

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load conversation history."
          );
        }

        if (!data.success) {
          throw new Error(
            data?.message ||
              "Unable to load conversation history."
          );
        }

        setConversationHistory(
          Array.isArray(data.conversations)
            ? data.conversations
            : []
        );
      } catch (error) {
        console.error(
          "Conversation history load error:",
          error
        );

        setHistoryError(
          error.message ||
            "Unable to load conversation history."
        );
      } finally {
        setHistoryLoading(false);
      }
    };

    loadConversationHistory();
  }, [token, navigate]);

  useEffect(() => {
    const incomingPrompt = location.state?.prompt;
    const incomingSecurityResult = location.state?.securityResult;

    if (
      typeof incomingPrompt === "string" &&
      incomingPrompt.trim()
    ) {
      setPrompt(incomingPrompt);
      setConversation([]);
      setConversationId(null);
      setAiResult(null);
      setError("");
    }

    if (incomingSecurityResult) {
      setSecurityResult(incomingSecurityResult);
    }
  }, [location.state]);

  const handleSend = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("Please enter a prompt.");
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    if (selectedProvider !== "groq") {
      setError(
        `${providers.find(
          (provider) => provider.id === selectedProvider
        )?.name} integration will be connected in the next step. Groq is currently available.`
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      setSecurityResult(null);
      setAiResult(null);

      const response = await fetch(
        `${API_BASE_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: trimmedPrompt,
            provider: selectedProvider,
            responseStyle: selectedResponseStyle,
            conversation,
            conversationId,
          }),
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "AI Hub request failed."
        );
      }

      if (!data.success) {
        throw new Error(
          data?.message ||
            "Unable to process the prompt."
        );
      }

      setSecurityResult(data.security || null);
      setAiResult(data.ai || null);

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      if (data.ai?.response) {
        setConversation((previousConversation) => [
          ...previousConversation,
          {
            role: "user",
            content: trimmedPrompt,
          },
          {
            role: "assistant",
            content: data.ai.response,
          },
        ]);
      }

      setPrompt("");
    } catch (error) {
      console.error(
        "AI Hub request error:",
        error
      );

      setError(
        error.message ||
          "Unable to process the prompt."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConversation = (savedConversation) => {
    if (loading || !savedConversation?.id) return;

    const savedMessages = Array.isArray(
      savedConversation.messages
    )
      ? savedConversation.messages
      : [];

    const restoredConversation = savedMessages
      .map((message) => ({
        role:
          message.role === "USER"
            ? "user"
            : message.role === "ASSISTANT"
            ? "assistant"
            : String(message.role || "").toLowerCase(),
        content: message.content || "",
      }))
      .filter(
        (message) =>
          (message.role === "user" ||
            message.role === "assistant") &&
          message.content
      );

    setConversationId(savedConversation.id);
    setConversation(restoredConversation);
    setPrompt("");
    setSecurityResult(null);
    setError("");

    const lastAssistantMessage = [...restoredConversation]
      .reverse()
      .find(
        (message) => message.role === "assistant"
      );

    if (lastAssistantMessage) {
      const lastSavedAssistantMessage = [...savedMessages]
        .reverse()
        .find(
          (message) =>
            message.role === "ASSISTANT" &&
            message.content === lastAssistantMessage.content
        );

      setAiResult({
        provider:
          lastSavedAssistantMessage?.provider || "Groq",
        response: lastAssistantMessage.content,
        responseStyle:
          lastSavedAssistantMessage?.responseStyle ||
          "default",
      });
    } else {
      setAiResult(null);
    }

    setTimeout(() => {
      document
        .getElementById("active-conversation")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);
  };

  const handleNewConversation = () => {
    if (loading) return;

    setConversation([]);
    setConversationId(null);
    setPrompt("");
    setSecurityResult(null);
    setAiResult(null);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const threatLevel =
    securityResult?.threatLevel || null;

  const isBlocked =
    securityResult?.action === "BLOCK" ||
    securityResult?.action ===
      "BLOCK_AND_ALERT";

  const getThreatClasses = () => {
    switch (threatLevel) {
      case "CRITICAL":
        return {
          border: "border-red-200",
          background: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-100 text-red-700",
        };

      case "HIGH":
        return {
          border: "border-orange-200",
          background: "bg-orange-50",
          text: "text-orange-700",
          badge: "bg-orange-100 text-orange-700",
        };

      case "MEDIUM":
        return {
          border: "border-yellow-200",
          background: "bg-yellow-50",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-700",
        };

      case "LOW":
        return {
          border: "border-lime-200",
          background: "bg-lime-50",
          text: "text-lime-700",
          badge: "bg-lime-100 text-lime-700",
        };

      default:
        return {
          border: "border-emerald-200",
          background: "bg-emerald-50",
          text: "text-emerald-700",
          badge: "bg-emerald-100 text-emerald-700",
        };
    }
  };

  const threatClasses =
    getThreatClasses();

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
                <p className="text-sm font-medium text-slate-500">
                  Secure AI conversations through PromptSentinel.
                </p>

                <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#102a63] md:text-4xl">
                  AI Hub
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Every prompt is security-scanned before
                  it reaches the AI provider.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-1.5 w-9 rounded-full bg-cyan-400" />
                  <span className="h-1.5 w-9 rounded-full bg-blue-500" />
                  <span className="h-1.5 w-9 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  className="text-cyan-500"
                />

                <h2 className="text-lg font-bold text-[#102a63]">
                  Choose AI Provider
                </h2>
              </div>

              <p className="text-xs text-slate-400">
                Select where PromptSentinel should send
                an approved prompt.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {providers.map((provider) => {
                const Icon = provider.icon;

                const isSelected =
                  selectedProvider ===
                  provider.id;

                return (
                  <button
                    key={provider.id}
                    type="button"
                    disabled={!provider.active || loading}
                    onClick={() =>
                      setSelectedProvider(
                        provider.id
                      )
                    }
                    className={`
                      relative
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-50 shadow-md shadow-cyan-100"
                          : provider.active
                          ? "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50"
                          : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                      }
                    `}
                  >
                    {isSelected && (
                      <span
                        className="
                          absolute
                          right-3
                          top-3
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-cyan-500
                          text-white
                        "
                      >
                        <Check size={14} />
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            isSelected
                              ? "bg-cyan-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#102a63]">
                          {provider.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {provider.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-2
                          py-1
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wide
                          ${
                            provider.active
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-200 text-slate-500"
                          }
                        `}
                      >
                        {provider.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3">
              <p className="text-xs leading-5 text-cyan-800">
                <span className="font-bold">
                  Selected provider:
                </span>{" "}
                {
                  providers.find(
                    (provider) =>
                      provider.id ===
                      selectedProvider
                  )?.name
                }
                {" — "}
                Your prompt will first pass through
                the PromptSentinel security gateway.
              </p>
            </div>
          </section>

          <section className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={18}
                  className="text-cyan-500"
                />

                <h2 className="text-lg font-bold text-[#102a63]">
                  Response Style
                </h2>
              </div>

              <p className="text-xs text-slate-400">
                Choose how the AI should format and present its answer.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {responseStyles.map((style) => {
                const isSelected =
                  selectedResponseStyle === style.id;

                return (
                  <button
                    key={style.id}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setSelectedResponseStyle(style.id)
                    }
                    className={`
                      relative
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-50 shadow-md shadow-cyan-100"
                          : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50"
                      }
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    `}
                  >
                    {isSelected && (
                      <span
                        className="
                          absolute
                          right-3
                          top-3
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-cyan-500
                          text-white
                        "
                      >
                        <Check size={14} />
                      </span>
                    )}

                    <p className="text-sm font-bold text-[#102a63]">
                      {style.name}
                    </p>

                    <p className="mt-1 pr-7 text-[11px] leading-5 text-slate-500">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3">
              <p className="text-xs leading-5 text-cyan-800">
                <span className="font-bold">
                  Selected style:
                </span>{" "}
                {
                  responseStyles.find(
                    (style) =>
                      style.id === selectedResponseStyle
                  )?.name
                }
                {" — "}
                This style will be applied to the AI response.
              </p>
            </div>
          </section>

          <section className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Bot
                    size={18}
                    className="text-cyan-500"
                  />

                  <h2 className="text-lg font-bold text-[#102a63]">
                    Conversation History
                  </h2>
                </div>

                <p className="mt-0.5 text-xs text-slate-400">
                  Your saved AI conversations are stored securely in PromptSentinel.
                </p>
              </div>

              <div className="mt-2 w-fit rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 sm:mt-0">
                <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-700">
                  {conversationHistory.length}{" "}
                  {conversationHistory.length === 1
                    ? "conversation"
                    : "conversations"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              {historyLoading && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <p className="text-xs font-medium text-slate-500">
                    Loading conversation history...
                  </p>
                </div>
              )}

              {!historyLoading && historyError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                  <p className="text-xs font-medium text-red-700">
                    {historyError}
                  </p>
                </div>
              )}

              {!historyLoading &&
                !historyError &&
                conversationHistory.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
                    <p className="text-sm font-semibold text-slate-600">
                      No saved conversations yet.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your conversations will appear here after you use the AI Hub.
                    </p>
                  </div>
                )}

              {!historyLoading &&
                !historyError &&
                conversationHistory.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {conversationHistory.map((savedConversation) => {
                      const messageCount =
                        Array.isArray(savedConversation.messages)
                          ? savedConversation.messages.length
                          : 0;

                      const turnCount = Math.ceil(
                        messageCount / 2
                      );

                      return (
                        <div
                          key={savedConversation.id}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            handleOpenConversation(
                              savedConversation
                            )
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" ||
                              event.key === " "
                            ) {
                              event.preventDefault();
                              handleOpenConversation(
                                savedConversation
                              );
                            }
                          }}
                          className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50/40 hover:shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#102a63]">
                                {savedConversation.title ||
                                  "Untitled Conversation"}
                              </p>

                              <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-cyan-600">
                                Tap to open conversation
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {turnCount}{" "}
                                {turnCount === 1
                                  ? "turn"
                                  : "turns"}{" "}
                                · {messageCount}{" "}
                                {messageCount === 1
                                  ? "message"
                                  : "messages"}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                              Saved
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-[10px] text-slate-400">
                              Updated{" "}
                              {savedConversation.updatedAt
                                ? new Date(
                                    savedConversation.updatedAt
                                  ).toLocaleString()
                                : "recently"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </section>

          <section className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#102a63]">
                  Secure AI Prompt
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Enter a prompt to scan and send through
                  the PromptSentinel security gateway.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {conversation.length > 0 && (
                  <button
                    type="button"
                    onClick={handleNewConversation}
                    disabled={loading}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    New Chat
                  </button>
                )}

                <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                    Security Gateway Active
                  </span>
                </div>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              placeholder="Ask the AI anything..."
              disabled={loading}
              rows={7}
              className="
                mt-5
                w-full
                resize-none
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-4
                text-sm
                leading-6
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-cyan-400
                focus:bg-white
                focus:ring-4
                focus:ring-cyan-100
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            />

            {contextualSuggestions.length > 0 && (
              <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                    <Lightbulb size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#102a63]">
                          Smart suggestions
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Suggestions based on your current prompt.
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                      {contextualSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.label}
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            applySuggestion(suggestion)
                          }
                          className="rounded-xl border border-cyan-100 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <p className="text-xs font-bold text-[#102a63]">
                            {suggestion.label}
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            {suggestion.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <p className="text-xs text-slate-400">
                  {prompt.trim()
                    ? `${prompt.trim().split(/\s+/).length} words`
                    : "0 words"}
                </p>

                {conversation.length > 0 && (
                  <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-cyan-700">
                    {Math.ceil(conversation.length / 2)} turns in context
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={
                  loading ||
                  !prompt.trim()
                }
                className="
                  rounded-xl
                  bg-[#102a63]
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-900/10
                  transition
                  hover:bg-[#0b2152]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Scanning & Processing..."
                  : "Scan & Send"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}
          </section>

          {conversation.length > 0 && (
            <section
              id="active-conversation"
              className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-500">
                    Multi-turn AI Conversation
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-[#102a63]">
                    Conversation Context Active
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    The AI can use the previous messages in this conversation to understand follow-up questions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNewConversation}
                  disabled={loading}
                  className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  New Conversation
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {conversation.map((message, index) => {
                  const isUser =
                    message.role === "user";

                  return (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[80%] ${
                          isUser
                            ? "bg-[#102a63] text-white"
                            : "border border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <p
                          className={`mb-1 text-[9px] font-extrabold uppercase tracking-wider ${
                            isUser
                              ? "text-cyan-200"
                              : "text-cyan-600"
                          }`}
                        >
                          {isUser
                            ? "You"
                            : "AI Assistant"}
                        </p>

                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {securityResult && (
            <section
              className={`
                mb-5
                rounded-[20px]
                border
                ${threatClasses.border}
                bg-white
                p-5
                shadow-sm
              `}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    PromptSentinel Security Result
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-[#102a63]">
                    {isBlocked
                      ? "Prompt Blocked"
                      : "Security Check Complete"}
                  </h2>
                </div>

                <span
                  className={`
                    inline-flex
                    w-fit
                    rounded-full
                    px-3
                    py-1.5
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-wide
                    ${threatClasses.badge}
                  `}
                >
                  {threatLevel || "UNKNOWN"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Risk Score
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-slate-800">
                    {securityResult.riskScore ?? 0}

                    <span className="text-sm font-semibold text-slate-400">
                      /100
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Confidence
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-slate-800">
                    {securityResult.confidence ?? 0}

                    <span className="text-sm font-semibold text-slate-400">
                      %
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Action
                  </p>

                  <p
                    className={`mt-1 text-lg font-extrabold ${threatClasses.text}`}
                  >
                    {securityResult.action ||
                      "REVIEW"}
                  </p>
                </div>
              </div>

              {securityResult.attackType && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Detection
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {securityResult.attackType}
                  </p>
                </div>
              )}

              {securityResult.detectionReason && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Detection Reason
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {securityResult.detectionReason}
                  </p>
                </div>
              )}

              {securityResult.recommendation && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Security Recommendation
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {securityResult.recommendation}
                  </p>
                </div>
              )}

              {isBlocked && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-700">
                    This prompt was stopped by PromptSentinel.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    The prompt was not forwarded to the AI provider.
                  </p>
                </div>
              )}
            </section>
          )}

          {aiResult && !isBlocked && (
            <section className="mb-5 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    AI Provider
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-[#102a63]">
                    {aiResult.provider || "Groq"}
                  </h2>
                </div>

                <div className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-700">
                    AI Response Ready
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {aiResult.response}
                </p>
              </div>

              {aiResult.model && (
                <p className="mt-3 text-[10px] text-slate-400">
                  Model: {aiResult.model}
                </p>
              )}
            </section>
          )}

          {!securityResult &&
            !loading &&
            !error && (
              <section className="rounded-[20px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50">
                  <span className="text-2xl">
                    🛡️
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-bold text-[#102a63]">
                  Your AI conversation starts here
                </h2>

                <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-slate-400">
                  Choose an AI provider and enter a prompt above.
                  PromptSentinel will analyze its security before
                  allowing it to reach the AI provider.
                </p>
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

export default AIHub;