import { Chat } from "@/types/chat";

export const chats: Chat= [
  {
    id: "chat1",
    participants: [
      {
        id: "user1",
        username: "Johndoe",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        verified: false,
        role: 'user'
      },
      {
        id: "business1",
        username: "Fashionstore",
        avatar: "https://images.unsplash.com/photo-1567481893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        verified: true,
        role: 'business',
      }
    ],
    messages: [
      {
        id: "msg1",
        senderId: "user1",
        text: "Hi, I'm interested in the black dress from your summer collection. Is it available in size M?",
        timestamp: Date.now() - 86400000,
        read: true,
      },
      {
        id: "msg2",
        senderId: "business1",
        text: "Hello! Yes, we have the black dress in size M. Would you like to place an order?",
        timestamp: Date.now() - 82800000,
        read: true,
      },
      {
        id: "msg3",
        senderId: "user1",
        text: "Great! How much is it and do you offer delivery?",
        timestamp: Date.now() - 79200000,
        read: true,
      },
      {
        id: "msg4",
        senderId: "business1",
        text: "The dress is $89.99 and yes, we offer free delivery for orders over $50. Would you like to proceed with the purchase?",
        timestamp: Date.now() - 75600000,
        read: false,
      },
    ],
    lastMessage: {
      id: "msg4",
      senderId: "business1",
      text: "The dress is $89.99 and yes, we offer free delivery for orders over $50. Would you like to proceed with the purchase?",
      timestamp: Date.now() - 75600000,
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: "chat2",
    participants: [
      {
        id: "user1",
        username: "Johndoe",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        verified: false,
        role: 'user'
      },
      {
        id: "business2",
        username: "techgadgets",
        avatar: "https://images.unsplash.com/photo-1566179787-4098ef3623?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
        verified: true,
        role: 'business',
      }
    ],
    messages: [
      {
        id: "msg5",
        senderId: "business2",
        text: "Thank you for your purchase! Your new smartphone will be shipped tomorrow.",
        timestamp: Date.now() - 172800000,
        read: true,
      },
      {
        id: "msg6",
        senderId: "user1",
        text: "Great, thank you! Do you have a tracking number?",
        timestamp: Date.now() - 169200000,
        read: true,
      },
      {
        id: "msg7",
        senderId: "business2",
        text: "We'll send you the tracking number as soon as it ships. You should receive it by email tomorrow.",
        timestamp: Date.now() - 165600000,
        read: true,
      },
      {
        id: "msg8",
        senderId: "business2",
        text: "Your order has been shipped! Here's your tracking number: 1234567890. You can track it on our website.",
        timestamp: Date.now() - 86400000,
        read: false,
      },
      {
        id: "msg9",
        senderId: "business2",
        text: "How are you enjoying your new smartphone? Feel free to reach out if you have any questions!",
        timestamp: Date.now() - 43200000,
        read: false,
      },
    ],
    lastMessage: {
      id: "msg9",
      senderId: "business2",
      text: "How are you enjoying your new smartphone? Feel free to reach out if you have any questions!",
      timestamp: Date.now() - 43200000,
      read: false,
    },
    unreadCount: 2,
  },
];