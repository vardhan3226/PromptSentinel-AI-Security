import {
  analyzePrompt,
} from "../services/scanService.js";

import {
  generateAIResponse,
} from "../services/aiChatService.js";

import prisma from "../lib/prisma.js";

const getSecurityAction = (threatLevel) => {
  switch (
    String(threatLevel).toUpperCase()
  ) {
    case "SAFE":
      return {
        allowed: true,
        action: "ALLOW",
      };

    case "LOW":
      return {
        allowed: true,
        action: "MONITOR",
      };

    case "MEDIUM":
      return {
        allowed: true,
        action: "WARNING",
      };

    case "HIGH":
      return {
        allowed: false,
        action: "BLOCK",
      };

    case "CRITICAL":
      return {
        allowed: false,
        action: "BLOCK_AND_ALERT",
      };

    default:
      return {
        allowed: false,
        action: "REVIEW",
      };
  }
};

export const chatWithAI = async (
  req,
  res
) => {
  try {
    const {
      prompt,
      conversation,
      conversationId,
      provider,
      responseStyle,
    } = req.body;

    if (
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    /*
     * ========================================================
     * STEP 1 — PROMPTSENTINEL SECURITY GATEWAY
     * ========================================================
     */

    const securityResult =
      await analyzePrompt(
        prompt.trim(),
        req.user.id
      );

    const finalResult =
      securityResult?.finalResult;

    if (!finalResult) {
      return res.status(500).json({
        success: false,
        message:
          "Security analysis did not return a valid result.",
      });
    }

    const securityAction =
      getSecurityAction(
        finalResult.threatLevel
      );

    /*
     * ========================================================
     * STEP 2 — BLOCK HIGH / CRITICAL
     * ========================================================
     */

    if (!securityAction.allowed) {
      return res.status(200).json({
        success: true,

        allowed: false,

        blocked: true,

        conversationId:
          conversationId || null,

        security: {
          threatLevel:
            finalResult.threatLevel,

          riskScore:
            finalResult.riskScore,

          confidence:
            finalResult.confidence,

          attackType:
            finalResult.attackType,

          action:
            securityAction.action,

          actionMessage:
            finalResult.actionMessage,

          recommendation:
            finalResult.recommendation,

          detectionReason:
            securityResult.detectionReason,

          matchedKeywords:
            securityResult.matchedKeywords,

          detectedAttacks:
            securityResult.detectedAttacks,

          consistencyAnalysis:
            securityResult.consistencyAnalysis,
        },

        ai: null,
      });
    }

    /*
     * ========================================================
     * STEP 3 — ALLOWED PROMPT → AI PROVIDER
     * ========================================================
     */

    const aiResult =
      await generateAIResponse({
        prompt: prompt.trim(),
        conversation,
        responseStyle,
      });

    /*
     * ========================================================
     * STEP 4 — CREATE / VALIDATE CONVERSATION
     * ========================================================
     */

    let activeConversationId =
      conversationId || null;

    /*
     * IMPORTANT:
     * Prisma exposes the model as `aIConversation`
     * because the schema model is named AIConversation.
     */

    if (activeConversationId) {
      const existingConversation =
        await prisma.aIConversation.findFirst({
          where: {
            id: activeConversationId,
            userId: req.user.id,
          },
          select: {
            id: true,
          },
        });

      /*
       * If the conversation does not belong to
       * the authenticated user, start a new conversation.
       */

      if (!existingConversation) {
        activeConversationId = null;
      }
    }

    /*
     * Create a new conversation when this is
     * the first message or the supplied ID is invalid.
     */

    if (!activeConversationId) {
      const newConversation =
        await prisma.aIConversation.create({
          data: {
            userId: req.user.id,

            title:
              prompt.trim().length > 60
                ? `${prompt
                    .trim()
                    .slice(0, 57)}...`
                : prompt.trim(),
          },

          select: {
            id: true,
          },
        });

      activeConversationId =
        newConversation.id;
    }

    /*
     * ========================================================
     * STEP 5 — SAVE USER + ASSISTANT MESSAGES
     * ========================================================
     */

    await prisma.aIMessage.createMany({
      data: [
        {
          role: "USER",

          content:
            prompt.trim(),

          provider:
            provider ||
            aiResult?.provider ||
            null,

          responseStyle:
            responseStyle ||
            null,

          conversationId:
            activeConversationId,
        },

        {
          role: "ASSISTANT",

          content:
            aiResult?.response ||
            "",

          provider:
            aiResult?.provider ||
            provider ||
            null,

          responseStyle:
            aiResult?.responseStyle ||
            responseStyle ||
            null,

          conversationId:
            activeConversationId,
        },
      ],
    });

    /*
     * ========================================================
     * STEP 6 — RETURN SECURITY + AI + CONVERSATION ID
     * ========================================================
     */

    return res.status(200).json({
      success: true,

      allowed: true,

      blocked: false,

      conversationId:
        activeConversationId,

      security: {
        threatLevel:
          finalResult.threatLevel,

        riskScore:
          finalResult.riskScore,

        confidence:
          finalResult.confidence,

        attackType:
          finalResult.attackType,

        action:
          securityAction.action,

        actionMessage:
          finalResult.actionMessage,

        recommendation:
          finalResult.recommendation,

        detectionReason:
          securityResult.detectionReason,

        matchedKeywords:
          securityResult.matchedKeywords,

        detectedAttacks:
          securityResult.detectedAttacks,

        consistencyAnalysis:
          securityResult.consistencyAnalysis,
      },

      ai: aiResult,
    });
  } catch (error) {
    console.error(
      "AI Hub Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to process AI Hub request.",
    });
  }
};

/*
 * ========================================================
 * STEP 7B — GET AI CONVERSATION HISTORY
 * ========================================================
 */

export const getAIConversations = async (
  req,
  res
) => {
  try {
    const conversations =
      await prisma.aIConversation.findMany({
        where: {
          userId: req.user.id,
        },

        orderBy: {
          updatedAt: "desc",
        },

        select: {
          id: true,

          title: true,

          createdAt: true,

          updatedAt: true,

          messages: {
            orderBy: {
              createdAt: "asc",
            },

            select: {
              id: true,

              role: true,

              content: true,

              provider: true,

              responseStyle: true,

              createdAt: true,
            },
          },
        },
      });

    return res.status(200).json({
      success: true,

      conversations,
    });
  } catch (error) {
    console.error(
      "AI Conversation History Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to load AI conversation history.",
    });
  }
};