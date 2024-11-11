declare module 'next-auth-session' {
    interface Session {
      user: {
        id: string;
      } & DefaultSession['user'];
    }
  }