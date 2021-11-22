import { useRouter } from 'next/router';

import Head from 'next/head';

import {
	Avatar,
	Badge,
	Button,
	Card,
	Container,
	Divider,
	Group,
	Image,
	Space,
	SimpleGrid,
	Text,
	useMantineTheme,
} from '@mantine/core';

// TODO: Add user data to context
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
		props: { user: user },
	};
}

function BasicArtistInfo({ user }) {
	const photo = user.Picture ? `${process.env.STRAPI_API_URL}${user.Picture.url}` : undefined;
	return (
		<Container size='md' padding='sm'>
			<Card withBorder>
				<Group>
					<Card.Section>
						<Avatar src={photo} alt='Foto do usuário' size='xl' />
						{/* User profile pic */}
					</Card.Section>
					{user.Name && (
						<Card.Section>
							<Text weight={700} size='lg' style={{ lineHeight: 1.5 }}>
								{user.Name}
							</Text>
						</Card.Section>
					)}
					{user.Bio && <Card.Section>{user.Bio}</Card.Section>}
				</Group>
			</Card>
		</Container>
	);
}

function ArtCard({ art }) {
	const theme = useMantineTheme();

	const secondaryColor =
		theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

	const photo = art.media ? `${process.env.STRAPI_API_URL}${art.media.url}` : undefined;

	return (
		<Card shadow='md' withBorder>
			<Card.Section>
				<Image src={photo} height={200} alt='Imagem descritiva do projeto' />
			</Card.Section>

			<Group position='apart' style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
				<Text weight={500}>{art.name}</Text>
				<Group position='right' style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
					{art.tags?.map((tag) => (
						<Badge color='pink' variant='light'>
							{tag.name}
						</Badge>
					))}
				</Group>
			</Group>

			{art.description && (
				<Text size='sm' style={{ color: secondaryColor, lineHeight: 1.5 }}>
					{art.description}
				</Text>
			)}

			<Button variant='light' color='blue' fullWidth style={{ marginTop: 14 }}>
				Ver mais
			</Button>
		</Card>
	);
}

export default function WorksOfUser({ user }) {
	const router = useRouter();
	const { username } = router.query;

	const { arts } = user;

	return user ? (
		<>
			<Head>
				<title>{username} | Obras</title>
			</Head>
			<BasicArtistInfo user={user} />
			{arts && arts.length > 0 && (
				<>
					<Space h='xl' />
					<Divider size='sm' />
					<Space h='xl' />
					<Space h='sm' />
					<SimpleGrid cols={3} spacing='lg'>
						{arts.map((art) => (
							<Container key={art.id} m='sm' size='xs'>
								<ArtCard art={art} />
							</Container>
						))}
					</SimpleGrid>
				</>
			)}
		</>
	) : (
		<>
			<Head>
				<title>Not Found</title>
			</Head>
			<Text>Usuário {username} não encontrado</Text>
		</>
	);
}