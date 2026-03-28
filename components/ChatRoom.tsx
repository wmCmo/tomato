import useDict from "@/hooks/useDict";
import useToast from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import getChatMessages from "@/queries/getChatMessages";
import getProfiles, { MinimalProfile } from "@/queries/getProfiles";
import ProfileType from "@/types/Profile";
import { ClockCounterClockwiseIcon, IconContext, PaperPlaneTiltIcon, PlusCircleIcon } from "@phosphor-icons/react";
import type { User } from "@supabase/supabase-js";
import { skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function ChatRoom({ isHost, profile, user, currentChatRoom }: { isHost: boolean; profile: ProfileType; user: User | null | undefined; currentChatRoom: string | undefined; }) {
    const chatBoxRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const [message, setMessage] = useState('');

    const { toast } = useToast();
    const { dict } = useDict();

    const queryClient = useQueryClient();

    const roomMessageQueryKey = ["messages", profile.id, currentChatRoom];

    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: roomMessageQueryKey,
        queryFn: currentChatRoom ? () => getChatMessages(currentChatRoom) : skipToken,
        staleTime: Infinity,
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const uniqueMemberIds = useMemo(() => {
        return [...new Set(messages?.map(m => m.sent_by))];
    }, [messages]);


    const { data: profiles, isLoading: profilesLoading } = useQuery({
        queryKey: ["profiles", uniqueMemberIds],
        queryFn: uniqueMemberIds.length > 0 ? () => getProfiles(uniqueMemberIds) : skipToken,
        staleTime: Infinity
    });

    const userMap = profiles?.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
    }, {} as Record<string, MinimalProfile>) ?? {};

    useEffect(() => {
        const channel = supabase
            .channel(`chatRoom:${profile.id}:${currentChatRoom}`)
            .on(
                'postgres_changes',
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                    filter: `chat_room=eq.${currentChatRoom}`
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: roomMessageQueryKey });
                }
            ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    function handleInput() {
        const textArea = chatBoxRef.current;
        if (!textArea) return;

        textArea.style.height = `20px`;
        textArea.style.height = `${textArea.scrollHeight}px`;

    }

    async function handleSubmit() {
        if (!user || message.match(/^\s + $/) || message.length < 1) return;
        const { error } = await supabase
            .from('messages')
            .insert({
                sent_by: user.id,
                chat_room: currentChatRoom,
                message: message
            })
            .select()
            .single();

        //ignoring updated_at error
        await supabase
            .from('chats')
            .update({ updated_at: new Date() })
            .eq("owner", profile.id);
        if (error) {
            console.error(error.code, error.message);
            toast(undefined, "Could not send a message", "errorDb");
            return;
        }
        queryClient.invalidateQueries({ queryKey: roomMessageQueryKey });
        setMessage("");
        handleInput();
    }

    return (
        <div className="card max-w-md w-full p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-2xl">チャットルーム</h2>
                {isHost &&
                    <div className="flex gap-2">
                        <IconContext.Provider value={{ weight: "fill", size: 24 }}>
                            <button type="button">
                                <ClockCounterClockwiseIcon className="text-muted-foreground hover:text-accent" />
                            </button>
                            <button type="button" className="text-muted-foreground hover:text-accent">
                                <PlusCircleIcon />
                            </button>
                        </IconContext.Provider>
                    </div>
                }
            </div>
            <div className="bg-background min-h-40 flex flex-col p-2 rounded-md">
                {currentChatRoom ?
                    <div className="grow overflow-y-scroll scrollbar-muted min-h-40 max-h-80 px-2 space-y-4">
                        {
                            (messages && messages.length > 0) ?
                                profilesLoading ?
                                    <div>
                                        {/* another skeleton here */}
                                    </div> :
                                    messages.map(message => {
                                        const user = userMap[message.sent_by];
                                        return (
                                            <div key={message.id} className="space-y-1">
                                                <div className="flex gap-2 items-center">
                                                    <Image src={user.avatar_url} alt={`${user.nickname}'s avatar`} height={16} width={16} className="rounded-full h-4 w-4" />
                                                    <span className="font-bold">{user.nickname}</span>
                                                    <span className="text-sm text-muted-foreground">{dict.profile.formatDate(new Date(message.created_at))}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="bg-foreground px-4 py-1 rounded-xl">{message.message}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                :
                                <div className="text-muted-foreground italic">新たな出会いはここから始まる</div>
                        }
                        <div ref={bottomRef} />
                    </div> :
                    <div>
                        {/* skeleton here */}
                    </div>
                }
                <div className="flex justify-between items-center mt-auto gap-4 pt-2">
                    <div className="bg-foreground rounded-md grow">
                        <textarea ref={chatBoxRef} onChange={e => { handleInput(); setMessage(e.target.value); }} onKeyDown={e => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }} value={message} name="message" id="message" placeholder="他のメンバーとチャットする" className="outline-none px-2 py-1 w-full h-8 resize-none" />
                    </div>
                    <button type="button" onClick={handleSubmit}>
                        <PaperPlaneTiltIcon weight="fill" size={24} className="text-rose-400 mr-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}