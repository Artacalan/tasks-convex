import { Tasks } from "@/Tasks/Tasks";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu.tsx";
import { api } from "../convex/_generated/api";

export default function App() {
  const user = useQuery(api.users.viewer);
  return (
    <Layout
      menu={
        <Authenticated>
          <UserMenu>{user?.name ?? user?.email}</UserMenu>
        </Authenticated>
      }
    >
      <Authenticated>
        <Tasks />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </Layout>
  );
}
