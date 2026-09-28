# Mock State vs. Real Meta WhatsApp Cloud API (v22.0)

This document provides the definitive architectural bridge for transitioning this CRM frontend from the default local mock reactive store to a live Meta WhatsApp Cloud API backend.

---

## 1. Feature to Meta API Mapping Matrix

| CRM Feature | Frontend Mock Implementation | Backend Service Role | Meta Graph API v22+ Endpoint / Webhook |
| :--- | :--- | :--- | :--- |
| **Send Text Message** | `src/lib/api/conversations.ts` (`sendMessage`) | Rate limiting, queuing, DB persistence | `POST https://graph.facebook.com/v22.0/{phone_number_id}/messages` |
| **Send Media Message** | `src/lib/api/conversations.ts` (upload + send) | S3/GCS media hosting, Meta media ID upload | `POST /v22.0/{phone_number_id}/media` then `POST /messages` |
| **Receive Customer Messages** | In-memory store + mock auto-reply simulation | Webhook ingress, validation, WebSocket emit | **Webhook**: `object: "whatsapp_business_account"`, field: `messages` |
| **Message Delivery Receipts** | Delayed state progression (`sent` ➔ `delivered` ➔ `read`) | Webhook processing, status update | **Webhook**: `field: "messages"`, entry `statuses` (`sent`, `delivered`, `read`) |
| **Template Sync & Catalog** | `src/lib/api/templates.ts` (`getTemplates`) | Sync cache from Meta | `GET https://graph.facebook.com/v22.0/{waba_id}/message_templates` |
| **Create Template** | `src/lib/api/templates.ts` (`createTemplate`) | Submit to Meta for automated review | `POST https://graph.facebook.com/v22.0/{waba_id}/message_templates` |
| **Delete Template** | `src/lib/api/templates.ts` (`deleteTemplate`) | Delete from WABA account | `DELETE https://graph.facebook.com/v22.0/{waba_id}/message_templates?name={name}` |
| **Broadcast Campaigns** | `src/lib/api/campaigns.ts` (`createCampaign`) | Distributed queue (BullMQ/Kafka) bulk dispatcher | Loop `POST /{phone_number_id}/messages` or Meta Bulk Messaging API |
| **Contact Registry** | `src/lib/api/contacts.ts` (localStorage store) | Internal CRM Database (PostgreSQL/MongoDB) | *Internal CRM Database — Not stored on Meta* |
| **WABA Account Health** | `src/lib/api/dashboard.ts` | Query account limits & quality score | `GET https://graph.facebook.com/v22.0/{waba_id}?fields=quality_score,account_status` |

---

## 2. Meta Cloud API Payloads & Webhook Specs

### 📤 1. Sending an Outbound Text Message

**Endpoint:** `POST https://graph.facebook.com/v22.0/{phone_number_id}/messages`  
**Headers:**
```http
Authorization: Bearer <META_SYSTEM_USER_ACCESS_TOKEN>
Content-Type: application/json
```

**Payload:**
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "+919876543210",
  "type": "text",
  "text": {
    "preview_url": false,
    "body": "Hello, thank you for contacting MindClub Foundation! How can we assist you today?"
  }
}
```

---

### 📥 2. Incoming Customer Message Webhook

When a customer messages your WhatsApp Business Number, Meta delivers a `POST` request to your registered webhook URL:

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WABA_ACCOUNT_ID",
      "changes": [
        {
          "field": "messages",
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "+911234567890",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "contacts": [
              {
                "profile": { "name": "Aarav Sharma" },
                "wa_id": "919876543210"
              }
            ],
            "messages": [
              {
                "from": "919876543210",
                "id": "wamid.HBgLOTE5ODc2NTQzMjEwFQIAEhgg...",
                "timestamp": "1727548800",
                "type": "text",
                "text": {
                  "body": "I would like to enquire about your services."
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

### 📬 3. Delivery Status Updates Webhook

Meta emits status webhooks as messages progress through delivery states:

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WABA_ACCOUNT_ID",
      "changes": [
        {
          "field": "messages",
          "value": {
            "messaging_product": "whatsapp",
            "statuses": [
              {
                "id": "wamid.HBgLOTE5ODc2NTQzMjEwFQIAEhgg...",
                "status": "delivered",
                "timestamp": "1727548805",
                "recipient_id": "919876543210",
                "conversation": {
                  "id": "CONVERSATION_ID",
                  "origin": { "type": "business_initiated" }
                },
                "pricing": {
                  "billable": true,
                  "pricing_model": "CBP",
                  "category": "utility"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## 3. Step-by-Step Transition to Real Backend

To connect this frontend to a production backend:

1. **Update Environment Mode**:
   Set in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_MODE=real
   NEXT_PUBLIC_APP_URL=https://api.yourcompany.com
   ```

2. **Replace Mock Adapters**:
   Update `src/lib/api/contacts.ts`, `conversations.ts`, `templates.ts`, and `campaigns.ts`:
   - Replace the internal local store accessors with standard `fetch()` or `axios` calls directed to your backend API gateway.
   - Example adapter structure:
   ```ts
   export async function sendMessage(input: SendMessageInput): Promise<Message> {
     if (process.env.NEXT_PUBLIC_API_MODE === "mock") {
       return mockSendMessage(input);
     }
     const res = await fetch("/api/v1/messages", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(input),
     });
     if (!res.ok) throw new Error("Failed to dispatch message");
     return res.json();
   }
   ```

3. **Establish Real-Time WebSocket Listener**:
   - In `AppProviders.tsx`, initialize a WebSocket or SSE client to listen for incoming `messages` and `statuses` updates from your backend server.
   - Invalidate or mutate TanStack Query cache dynamically:
   ```ts
   queryClient.setQueryData(
     queryKeys.conversations.messages(conversationId),
     (old: Message[] = []) => [...old, incomingMessage],
   );
   ```
