import { Session, User } from "@prisma/client";
import {
  Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useMemo } from "react";

import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";

import ButtonLink from "components/ButtonLink";
import PageTransition from "components/PageTransition";

import prisma from "utils/prisma";
import { withAuthentication } from "utils/session";
import { formatDate, pluralize, serialize } from "utils/string";

dayjs.locale("fr");
dayjs.extend(relativeTime);

const usersColumnHelper = createColumnHelper<User>();
const sessionsColumnHelper = createColumnHelper<Session>();

interface AdminPageProps {
  session: Session;
  sessions: Array<Session>;
  users: Array<User>;
}
export default function AdminPage({ sessions, users }: AdminPageProps) {
  return (
    <PageTransition
      className="admin"
      style={{
        maxWidth: "1280px",
        width: "100%",
        display: "flex",
        gap: "1em",
        flexDirection: "column",
      }}
    >
      <nav>
        <ul
          style={{
            padding: ".5em",
            display: "flex",
            gap: "1em",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <li>
            <ButtonLink href="/">MyLinks</ButtonLink>
          </li>
          <li>
            <ButtonLink href="/admin">admin</ButtonLink>
          </li>
          <li>
            <ButtonLink onClick={signOut}>Signout</ButtonLink>
          </li>
        </ul>
      </nav>
      <UsersTable users={users} />
      <SessionsTable sessions={sessions} />
    </PageTransition>
  );
}

function UsersTable({ users }: { users: AdminPageProps["users"] }) {
  const userTable = useReactTable({
    data: users,
    columns: [
      usersColumnHelper.accessor("id", {
        header: () => "#",
      }),
      usersColumnHelper.accessor("image", {
        header: () => "Avatar",
        cell: (props) => (
          <Image
            src={props.getValue()}
            alt={"User avatar"}
            height={48}
            width={48}
            style={{
              borderRadius: "50%",
              overflow: "hidden",
            }}
          />
        ),
      }),
      usersColumnHelper.accessor("name", {
        header: () => "Nom",
      }),
      usersColumnHelper.accessor("email", {
        header: () => "Email",
      }),
      usersColumnHelper.accessor("is_admin", {
        header: () => "Admin ?",
        cell: (props) =>
          props.getValue() ? (
            <span style={{ color: "red" }}>Oui</span>
          ) : (
            <span style={{ color: "green" }}>Non</span>
          ),
      }),
      usersColumnHelper.accessor("is_connection_allowed", {
        header: () => "Connexion autorisée ?",
        cell: (props) =>
          props.getValue() ? (
            <span style={{ color: "red" }}>Oui</span>
          ) : (
            <span style={{ color: "green" }}>Non</span>
          ),
      }),
      usersColumnHelper.accessor("createdAt", {
        header: () => "Création",
        cell: (props) => <PrintDate date={props.getValue()} />,
      }),
      usersColumnHelper.accessor("updatedAt", {
        header: () => "MAJ",
        cell: (props) => <PrintDate date={props.getValue()} />,
      }),
      usersColumnHelper.display({
        id: "actions",
        header: () => "Actions",
        cell: () => (
          <>
            <ButtonLink>Supprimer</ButtonLink>
            <br />
            <ButtonLink>Modifier</ButtonLink>
          </>
        ),
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={userTable} caption={pluralize(users, "user")} />;
}

function SessionsTable({ sessions }: { sessions: AdminPageProps["sessions"] }) {
  const activeSessions = useMemo<Session[]>(
    () =>
      sessions.filter((session) => dayjs(session.expires).isAfter(new Date())),
    [sessions]
  );
  const sessionTable = useReactTable({
    data: sessions,
    columns: [
      sessionsColumnHelper.accessor("id", {
        header: () => "#",
      }),
      sessionsColumnHelper.accessor("userId", {
        header: () => "Utilisateur ID",
      }),
      sessionsColumnHelper.accessor("expires", {
        header: () => "Expiration",
        cell: (props) => <PrintDate date={props.getValue()} />,
      }),
      sessionsColumnHelper.display({
        id: "is-active",
        header: () => "Active ?",
        cell: (props) =>
          dayjs(props.row.getValue("expires")).isAfter(new Date()) ? (
            <span style={{ color: "green" }}>Oui</span>
          ) : (
            <span>Non</span>
          ),
      }),
      sessionsColumnHelper.display({
        id: "actions",
        header: () => "Actions",
        cell: () => <ButtonLink>Supprimer</ButtonLink>,
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <BasicTable
      table={sessionTable}
      caption={`${activeSessions.length} / ${pluralize(sessions, "session")}`}
    />
  );
}

function BasicTable({
  table,
  caption,
}: {
  table: Table<any>;
  caption?: string;
}) {
  return (
    <table style={{ width: "100%" }}>
      {caption && <caption>{caption}</caption>}
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PrintDate({ date }: { date: string }) {
  return (
    <>
      {formatDate(date)}
      <br />
      {dayjs(date).fromNow()}
    </>
  );
}

export const getServerSideProps = withAuthentication(
  async ({ session, user }) => {
    if (!user.is_admin) {
      return {
        redirect: {
          destination: "/",
        },
      };
    }

    const sessions = await prisma.session.findMany();
    const users = await prisma.user.findMany();
    return {
      props: {
        session,
        sessions: serialize(sessions),
        users: serialize(users),
      },
    };
  }
);
