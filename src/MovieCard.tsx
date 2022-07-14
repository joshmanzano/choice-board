import {
  Card,
  Image,
  Space,
  Text,
  useMantineTheme,
  Anchor,
  Center,
  Badge,
  Container,
  Button
} from '@mantine/core';
import { StringLiteralLike } from 'typescript';

interface MovieCardProps {
  name: string;
  genre: any[];
  summary: string;
  trailer: string[];
  img: string;
  mode: string;
  status: boolean;
}

export default function MovieCard({
    name,
    genre,
    summary,
    trailer,
    img,
    mode,
    status
}: MovieCardProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof MovieCardProps>) {
  const theme = useMantineTheme();

  let trailer_num = 0;

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
        {trailer.slice(0,2).map(t => {
          trailer_num += 1;
          return (
            <Container>
              <Anchor target="_blank" href={t}>
                  Trailer #{trailer_num}
              </Anchor>
            </Container>
          )
        })}
      </Center>
    <Space h='md'/>
      <Center>
        {genre.map(g => {
          return (
            <Badge>{g.name}</Badge>
          )
        })}
      </Center>
    <Space h='md'/>
    {mode != 'Idle' ? 
      <Center>
        <Button color={status ? "teal" : ""}>
          Select
        </Button>
      </Center>
    :null}
    </Card>
  );
}