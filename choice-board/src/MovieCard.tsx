import {
  Card,
  Image,
  Space,
  Text,
  useMantineTheme,
  Anchor,
  Center
} from '@mantine/core';

interface MovieCardProps {
  name: string;
  genre: string;
  summary: string;
  trailer: string;
  img: string;
}

export default function MovieCard({
    name,
    genre,
    summary,
    trailer,
    img
}: MovieCardProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof MovieCardProps>) {
  const theme = useMantineTheme();

  return (
    <Card withBorder radius="md" >
      <Card.Section>
        <Image src={img} height={180}/>
      </Card.Section>

    <Space h='md'/>
      <Text weight={500} component="a">
        {name}
      </Text>

      <Text size="sm" color="dimmed">
        {summary}
      </Text>
    <Space h='md'/>
      <Center>
        <Anchor target="_blank" href={trailer}>
            Trailer
        </Anchor>
      </Center>
    </Card>
  );
}