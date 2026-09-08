# DLT assistant setup

Status: website and backend implemented; workflow not activated or tested against a live model yet.

1. Import `dlt-assistant.json` into n8n. Select an available model and credentials on the chat model node (replace it with your preferred provider if necessary).
2. Add Header Auth credentials to DLT Webhook: header name `X-DLT-Secret`, value a randomly generated secret. Do not embed this in frontend code.
3. Publish/activate the workflow. Set server environment variables `N8N_DLT_WEBHOOK_URL` to its HTTPS production URL and `N8N_DLT_WEBHOOK_SECRET` to the same secret. Redeploy Vercel.
4. For local development use `vercel dev` (Vite alone does not serve `/api` handlers).
5. Test while logged in: empty day, partial habits, completed habits, expired session, unavailable workflow, unrelated questions, and instructions embedded in task titles. Confirm replies describe missing logs without claiming missed real-world activities.

The authenticated server endpoint accepts `{ question, context }` and expects `{ reply: string }`. Firebase verifies the caller token; context is a bounded client snapshot, not a trusted database record. The workflow has no account write tools and no shared chat memory. Each question receives a fresh snapshot. Personal reflections, credentials, email, and transaction descriptions are omitted. Users see a disclosure before submitting. Configure request quotas in the hosting gateway before broad public rollout.

Workflow uses [Basic LLM Chain](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm/) and [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/). Verify node compatibility in your n8n version when importing.
