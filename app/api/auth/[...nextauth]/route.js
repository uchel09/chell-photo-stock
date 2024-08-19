import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDb from "@/utils/database";
import UserModel from "@/models/userModel";

// Menghubungkan ke database
connectDb();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/", // Halaman sign-in kustom
  },
  callbacks: {
    async signIn({ profile }) {
      return await signWithOauth({ profile });
    },
    async jwt({ token }) {
      const user = await getUserByEmail({ email: token.email });
      token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;


      return session;
    },
  },
};

// Menghandle request GET dan POST untuk NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// =======================================================

async function signWithOauth({ profile }) {
  try {
    // Cek apakah user sudah ada di database
    const user = await UserModel.exists({ email: profile.email });
    if (user) return true;

    // Jika user tidak ada, buat user baru
    const newUser = new UserModel({
      name: profile.name,
      email: profile.email,
      avatar: profile.picture,
    });

    // Simpan user baru ke database
    await newUser.save();

    return true;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return false; // Gagal sign-in
  }
}

async function getUserByEmail({ email }) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("email does not exist!");
  const newuser = {
    ...user._doc,
    _id: user._id.toString(),
    total_followers: user.followers.length,
    total_followings: user.followings.length,
    followers: [],
    followings: [],
    my_user: true,
  };

  return newuser;
}
