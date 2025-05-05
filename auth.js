import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { User } from "./app/models/User";
import { compare } from "bcryptjs";
import connectDB from "./app/lib/db";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email;
        const password = credentials.password;
        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & password");
        }
        await connectDB();
        const user = await User.findOne({ email }).select("+password +role");
        if (!user) throw new Error("Invalid email or password");
        if (!user.password) throw new Error("Invalid email or password");
        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new Error("Password did not matched");
        }
        const userData = {
          username: user.username,
          email: user.email,
          role: user.role,
          id: user._id,
          imgURL: user.imgURL,
        };
        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/Login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.imgURL = token.imgURL;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.imgURL = user.imgURL;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;
          await connectDB();
          const existingUser = await User.findOne({ email });
          if (!existingUser) {
            User.create({ email, name, image, authProviderId: id });
          } else {
            return true;
          }
        } catch (error) {
          throw new Error("Error in Creating User");
        }
      }
      if (account.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
  },
});
