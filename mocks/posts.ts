import { Post } from "@/types/post";

export const posts: Post[] = [
  
  {
    id: "1",
    user: {
      id: "user1",
      username: "janedoe",
      avatar: "https://images.unsplash.com/photo-1494798108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      verified: true,
    },
    images: [
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000",
      "https://images.unsplash.com/photo-1682687220208-220722543e88?q=80&w=1000"
    ],
    caption: "Enjoying a beautiful day at the beach! The waves were perfect today.",
    hashtags: ["beach", "summer", "waves", "ocean"],
    likes: 1243,
    comments: [
      {
        id: "c1",
        user: {
          id: "user2",
          username: "johndoe",
          avatar: "https://images.unsplash.com/photo-1599566158163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=158&q=80",
          verified: false,
        },
        text: "Looks amazing! Where is this?",
        timestamp: Date.now() - 3600000,
        likes: 24,
      },
      {
        id: "c2",
        user: {
          id: "user3",
          username: "sarahsmith",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          verified: false,
        },
        text: "Perfect day for the beach!",
        timestamp: Date.now() - 7200000,
        likes: 8,
      }
    ],
    saved: false,
    timestamp: Date.now() - 86400000,
  },

  {
    id: "2",
    user: {
      id: "user4",
      username: "traveler",
      avatar: "https://images.unsplash.com/photo-1587003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      verified: true,
    },
    images: [
      "https://images.unsplash.com/photo-1682695794816-7b9da18ed470?q=80&w=1000",
    ],
    caption: "Exploring the mountains and finding peace in nature. Nothing beats this view!",
    hashtags: ["mountains", "hiking", "nature", "adventure"],
    likes: 3567,
    comments: [
      {
        id: "c3",
        user: {
          id: "user5",
          username: "hikingfan",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          verified: false,
        },
        text: "This is breathtaking! Which trail is this?",
        timestamp: Date.now() - 1800000,
        likes: 42,
      }
    ],
    saved: true,
    timestamp: Date.now() - 172800000,
  },
  {
    id: "3",
    user: {
      id: "user6",
      username: "foodie",
      avatar: "https://images.unsplash.com/photo-1438761681833-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      verified: false,
    },
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600"
    ],
    caption: "Homemade dinner tonight! Tried a new recipe and it turned out amazing.",
    hashtags: ["foodporn", "homecooking", "dinner", "yummy"],
    likes: 982,
    comments: [
      {
        id: "c4",
        user: {
          id: "user7",
          username: "cheflife",
          avatar: "https://images.unsplash.com/photo-1472899645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          verified: true,
        },
        text: "Looks delicious! Would love the recipe.",
        timestamp: Date.now() - 5400000,
        likes: 15,
      },
    ],
    saved: false,
    timestamp: Date.now() - 259200000,
  },
  {
    id: "4",
    user: {
      id: "user8",
      username: "artlover",
      avatar: "https://images.unsplash.com/photo-1531427186511-1901a22b7922?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      verified: true,
    },
    images: [
      "https://images.unsplash.com/photo-1552664730-d306a8e82b50?q=80&w=1000"
    ],
    caption: "The plating is perfect!",
    hashtags: ["art", "foodart", "plating"],
    likes: 512,
    comments:[],
    saved: false,
    timestamp: Date.now() - 129600000,
  },
  {
    id: "5",
    user: {
      id: "user9",
      username: "cityexplorer",
      avatar: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      verified: false,
    },
    images: [
      "https://images.unsplash.com/photo-1556549497-d63cbabf4957?q=80&w=1000",
      "https://images.unsplash.com/photo-1499363536502-872347c19c65?q=80&w=1000",
      "https://images.unsplash.com/photo-1480879048634-7d7fa02899f3?q=80&w=1000"
    ],
    caption: "Paris never disappoints. The architecture, the food, the atmosphere - everything is magical!",
    hashtags: ["paris", "travel", "architecture", "citylife"],
    likes: 2789,
    comments: [
      {
        id: "c5",
        user: {
          id: "user10",
          username: "wanderlust",
          avatar: "https://images.unsplash.com/photo-1506868990056-488e2824c33b?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          verified: false,
        },
        text: "Paris is always a good idea! Enjoy your trip!",
        timestamp: Date.now() - 3600000,
        likes: 32,
      }
    ],
    saved: true,
    timestamp: Date.now() - 345600000,
  },
  {
    id: "6",
    user: {
      id: "user11",
      username: "fitnessguru",
      avatar: "https://images.unsplash.com/photo-1534137471514-a3b8203a279a?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      verified: true,
    },
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b7244?q=80&w=1000"
    ],
    caption: "Morning workout done! Starting the day with energy and positivity.",
    hashtags: ["fitness", "workout", "motivation", "healthylifestyle"],
    likes: 1876,
    comments: [
      {
        id: "c6",
        user: {
          id: "user12",
          username: "gymrat",
          avatar: "https://images.unsplash.com/photo-1576779120885-484c530767d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
          verified: false,
        },
        text: "You're such an inspiration! What's your workout routine?",
        timestamp: Date.now() - 7200000,
        likes: 19,
      }
    ],
    saved: false,
    timestamp: Date.now() - 432000000,
  }
];
