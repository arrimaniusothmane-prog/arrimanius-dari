"use client";

import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  name: string;
  propertyTitle: string;
  snippet: string;
  time: string;
  unread: number;
  initials: string;
  messages: ChatMessage[];
};

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Mohamed Benali",
    propertyTitle: "Villa avec Piscine Californie",
    snippet: "Bonjour, nous pouvons convenir d'une visite samedi...",
    time: "10:24",
    unread: 2,
    initials: "MB",
    messages: [
      {
        id: "m1-1",
        from: "them",
        text: "Bonjour Youssef, merci pour votre offre sur la villa. Elle nécessite une contre-proposition.",
        time: "09:12",
      },
    {
      id: "m1-2",
      from: "me",
      text: "Bonjour, je suis ouvert à la discussion.",
      time: "09:30",
    },
    {
      id: "m1-3",
      from: "them",
      text: "Parfait. Nous pouvons convenir d'une visite samedi matin.",
      time: "10:00",
    },
    {
      id: "m1-4",
      from: "them",
      text: "Est-ce que cela vous convient ?",
      time: "10:05",
    },
  ],
},
{
  id: "conv-2",
  name: "Fatima Zahra El Idrissi",
  propertyTitle: "Appartement Luxe Anfa",
  snippet: "Votre offre a bien été reçue, je vous réponds rapidement.",
  time: "Hier",
  unread: 0,
  initials: "FE",
  messages: [
    {
      id: "m2-1",
      from: "me",
      text: "Bonjour, je vous envoie mon offre pour l'appartement Anfa.",
      time: "14:02",
    },
    {
      id: "m2-2",
      from: "them",
      text: "Votre offre a bien été reçue, je vous réponds rapidement.",
      time: "15:40",
    },
  ],
},
{
  id: "conv-3",
  name: "Mohamed Benali",
  propertyTitle: "Appartement Premium Maarif",
  snippet: "Oui, l'appartement est toujours disponible.",
  time: "Lun",
  unread: 1,
  initials: "MB",
  messages: [
    {
      id: "m3-1",
      from: "them",
      text: "Oui, l'appartement est toujours disponible.",
      time: "11:00",
    },
    {
      id: "m3-2",
      from: "them",
      text: "Souhaitez-vous planifier une visite ?",
      time: "11:02",
    },
  ],
},
{
  id: "conv-4",
  name: "Mohamed Benali",
  propertyTitle: "Appartement Vue Mer Ain Diab",
  snippet: "Merci pour votre intérêt pour la vue mer.",
  time: "Vend.",
  unread: 0,
  initials: "MB",
  messages: [
    {
      id: "m4-1",
      from: "them",
      text: "Merci pour votre intérêt pour la vue mer.",
      time: "17:21",
    },
    {
      id: "m4-2",
      from: "me",
      text: "Avec plaisir, je vous recontacte dès que possible.",
      time: "18:00",
    },
  ],
},
];

export default function BuyerMessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const selected = conversations.find((c) => c.id === selectedId);

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !selected) return;
    const now = new Date();
    const time = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              snippet: text,
              time,
              unread: 0,
              messages: [
                ...c.messages,
                { id: `sent-${Date.now()}`, from: "me", text, time },
              ],
            }
          : c
      )
    );
    setDraft("");
  };

  return (
    <div>
      <DashboardHeader
        title="Messages"
        subtitle="Échangez avec les vendeurs et suivez vos discussions."
      />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="grid lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <div
            className={cn(
              "border-border/60 lg:border-r",
              selected && "hidden lg:block"
            )}
          >
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border/60 px-4 py-4 text-left transition-colors hover:bg-muted/50",
                    conv.id === selectedId && "bg-sand/50 hover:bg-sand/50"
                  )}
                >
                  <Avatar className="size-11 shrink-0">
                    <AvatarFallback className="bg-primary font-display font-semibold text-white">
                      {conv.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{conv.name}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {conv.time}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {conv.propertyTitle}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {conv.snippet}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active conversation */}
          <div className={cn("min-w-0", !selected && "hidden lg:block")}>
            {selected ? (
              <div className="flex h-[calc(100vh-280px)] flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                    onClick={() => setSelectedId("")}
                    aria-label="Retour aux conversations"
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary font-display font-semibold text-white">
                      {selected.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{selected.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {selected.propertyTitle}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
                  {selected.messages.map((msg) => {
                    const mine = msg.from === "me";
                    return (
                      <div
                        key={msg.id}
                        className={cn("flex", mine && "justify-end")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] px-4 py-2.5 text-sm shadow-sm",
                            mine
                              ? "rounded-2xl rounded-br-none bg-primary text-white"
                              : "rounded-2xl rounded-bl-none bg-muted text-foreground"
                          )}
                        >
                          <p>{msg.text}</p>
                          <p
                            className={cn(
                              "mt-1 text-[10px]",
                              mine ? "text-white/70" : "text-muted-foreground"
                            )}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Composer */}
                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2 border-t border-border/60 px-4 py-3"
                >
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1 rounded-full"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="shrink-0 rounded-full bg-gold text-white hover:bg-gold/90"
                    disabled={!draft.trim()}
                    aria-label="Envoyer le message"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-280px)] items-center justify-center p-6">
                <p className="text-sm text-muted-foreground">
                  Sélectionnez une conversation pour afficher les messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}