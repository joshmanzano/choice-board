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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface MovieCardProps {
  name: string;
  genre: any[];
  summary: string;
  trailer: string[];
  img: string;
  mode: string;
  status: boolean;
  setMovie: any;
  unSetMovie: any;
  id: string;
}

export default function MovieCard({
    name,
    genre,
    summary,
    trailer,
    img,
    mode,
    status,
    setMovie,
    unSetMovie,
    id
}: MovieCardProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof MovieCardProps>) {
  const theme = useMantineTheme();

  let trailer_num = 0;

  const submit = (id: string, name: string) => {
    confirmAlert({
      title: 'Confirmation',
      message: 'Confirm that you are '+(mode == 'Remove' ? 'removing' : ((status ? 'un-' : '')+'picking'))+' \"'+name+'\"?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => status && mode == 'Pick' ? unSetMovie(id) : setMovie(id)
        },
        {
          label: 'Cancel',
          onClick: () => null
        },
      ]
    });
  }

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
        <Button onClick={() => { submit(id, name)}} color={status && mode == 'Pick' ? "teal" : ""}>
          {mode == 'Pick' ? status ? 'Picked' : 'Pick' : 'Remove'}
        </Button>
      </Center>
    :null}
    </Card>
  );
}