import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MessageList } from "@/components/messages/MessageList";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { with?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  // 대화 목록
  const allMessages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 대화 상대별로 그룹화
  const conversationMap = new Map<
    string,
    { user: { id: string; name: string; image: string | null }; lastMessage: (typeof allMessages)[0] }
  >();

  for (const msg of allMessages) {
    const partner = msg.senderId === session.user.id ? msg.receiver : msg.sender;
    if (!conversationMap.has(partner.id)) {
      conversationMap.set(partner.id, { user: partner, lastMessage: msg });
    }
  }

  const conversations = Array.from(conversationMap.values());

  // 선택된 대화 메시지
  let selectedMessages: typeof allMessages = [];
  if (searchParams.with) {
    selectedMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: searchParams.with },
          { senderId: searchParams.with, receiverId: session.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // 읽음 처리
    await prisma.message.updateMany({
      where: { senderId: searchParams.with, receiverId: session.user.id, read: false },
      data: { read: true },
    });
  }

  const selectedPartner = searchParams.with
    ? conversations.find((c) => c.user.id === searchParams.with)?.user || null
    : null;

  return (
    <MessageList
      conversations={conversations}
      selectedMessages={selectedMessages}
      selectedPartnerId={searchParams.with || null}
      selectedPartner={selectedPartner}
      currentUserId={session.user.id}
    />
  );
}
