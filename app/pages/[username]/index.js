import { useRouter } from 'next/router';
import Head from 'next/head'
import { Image, Text, Title, ThemeIcon } from '@mantine/core';
import { getMonthsNames } from '@mantine/dates';
import 'dayjs/locale/pt';
import { FaCalendarCheck } from 'react-icons/fa';

function convertDateToPT(dateString) {
  const date = new Date(dateString);
  return `${getMonthsNames('pt')[date.getMonth()]} de ${date.getFullYear()}`;
}

async function fetchUser(username) {
  const response = await fetch(process.env.STRAPI_API_URL + `/artic-users/?Username=${username}`);
  if (response.ok) {
    let users = await response.json();
    if (users.length !== 0) {
      return users[0];
    }
  }
  return null;
}

export async function getServerSideProps({ params }) {
  const user = await fetchUser(params.username);
  return {
    props: { user: user }
  };
}

export default function User({ user }) {
  const router = useRouter();
  const username = router.query.username;
  if (user === null) {
    return (<>
      <Head><title>Not Found</title></Head>
      <Text>Usuário {username} não encontrado</Text>
    </>);
  }
  return (<>
    <Head>
      <title>{user.Username}</title>
    </Head>
    {user.Picture !== null &&
      <Image
        src={process.env.STRAPI_API_URL + user.Picture.url}
        width="300px"
        alt="Foto de perfil do usuário."
      />
    }
    {user.Name !== null &&
      <Title order={2}>{user.Name}</Title>
    }
    <Text weight="bold" color="gray">@{user.Username}</Text>
    {user.Bio !== null &&
      <Text size="sm">{user.Bio}</Text>
    }
    <Text size="sm" color="gray"><FaCalendarCheck /> Ingressou em {convertDateToPT(user.created_at)}</Text>
  </>);
}